'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Users, MessageSquare, LogOut } from 'lucide-react';

interface Room {
    id: string;
    name: string;
    description: string;
    topic: string;
    _count: {
        members: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // New Room Form State
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomTopic, setNewRoomTopic] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
            // If unauthorized, redirect to login
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/rooms', {
                name: newRoomName,
                topic: newRoomTopic,
                description: newRoomDesc
            });
            setIsCreateOpen(false);
            fetchRooms(); // Refresh list
            // Reset form
            setNewRoomName('');
            setNewRoomTopic('');
            setNewRoomDesc('');
        } catch (error) {
            console.error('Failed to create room', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <h1 className="text-2xl font-bold text-primary">ProjectIt</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Study Rooms</h2>
                        <p className="text-muted-foreground">Join a room to start collaborating.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Room
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a Study Room</DialogTitle>
                                <DialogDescription>
                                    Start a new discussion group for a specific topic.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateRoom}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="name" className="text-sm font-medium">Room Name</label>
                                        <Input id="name" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="topic" className="text-sm font-medium">Topic</label>
                                        <Input id="topic" value={newRoomTopic} onChange={(e) => setNewRoomTopic(e.target.value)} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="desc" className="text-sm font-medium">Description</label>
                                        <Input id="desc" value={newRoomDesc} onChange={(e) => setNewRoomDesc(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Room</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Room Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <Card key={room.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => router.push(`/room/${room.id}`)}>
                            <CardHeader>
                                <CardTitle>{room.name}</CardTitle>
                                <CardDescription>{room.topic}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {room.description || 'No description provided.'}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Users className="mr-1 h-4 w-4" />
                                    {room._count.members} members
                                </div>
                                <div className="flex items-center">
                                    <MessageSquare className="mr-1 h-4 w-4" />
                                    Join
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
