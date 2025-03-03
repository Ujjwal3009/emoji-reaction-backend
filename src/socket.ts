import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected');

        socket.on('emoji-click', (data) => {
            console.log('Received emoji click:', data);
            io.emit('emoji-update', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}; 