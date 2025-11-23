import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (roomId: string) => {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Initialize socket
        socketRef.current = io('http://localhost:4000', {
            auth: { token },
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to socket server');
            // Join the room
            socketRef.current?.emit('join_room', roomId);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        socketRef.current.on('receive_message', (message: any) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    const sendMessage = (content: string) => {
        if (socketRef.current) {
            socketRef.current.emit('send_message', { roomId, content });
        }
    };

    return { socket: socketRef.current, isConnected, messages, setMessages, sendMessage };
};
