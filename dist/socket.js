"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const setupSocket = (io) => {
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
exports.setupSocket = setupSocket;
