import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('sendEmoji', (data) => {
            console.log(`Emoji received: ${data.emoji}`);
            io.emit('newEmoji', { event: 'newEmoji', emoji: data.emoji });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}; 