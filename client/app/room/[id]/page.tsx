'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: string;
    username: string;
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender: User;
}

interface RoomDetails {
    id: string;
    name: string;
    topic: string;
    messages: Message[];
}

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.id as string;
    const [room, setRoom] = useState<RoomDetails | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, setMessages, sendMessage, isConnected } = useSocket(roomId);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        const joinAndFetch = async () => {
            try {
                // Try to join the room first
                await api.post(`/rooms/${roomId}/join`);
            } catch (error) {
                // Ignore if already joined or other error, just proceed to fetch
                console.log('Already joined or error joining');
            }
            fetchRoomDetails();
        };

        joinAndFetch();
    }, [roomId]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchRoomDetails = async () => {
        try {
            const res = await api.get(`/rooms/${roomId}`);
            setRoom(res.data);
            // Initialize messages with historical data
            // Note: In a real app, we might want to merge or handle duplicates, 
            // but for now we'll just set the initial state if empty
            if (res.data.messages) {
                setMessages(res.data.messages.reverse()); // API returns desc, we want asc for chat
            }
        } catch (error) {
            console.error('Failed to fetch room', error);
            router.push('/dashboard');
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        sendMessage(inputMessage);
        setInputMessage('');
    };

    if (!room) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="border-b p-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{room.name}</h1>
                    <p className="text-sm text-muted-foreground">{room.topic}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-xs text-muted-foreground">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, idx) => {
                    const isMe = msg.sender.id === currentUser?.id;
                    return (
                        <div key={idx} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[70%] rounded-lg p-3",
                                isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                {!isMe && <p className="mb-1 text-xs font-bold opacity-70">{msg.sender.username}</p>}
                                <p className="text-sm">{msg.content}</p>
                                <p className="mt-1 text-[10px] opacity-50 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!isConnected}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
