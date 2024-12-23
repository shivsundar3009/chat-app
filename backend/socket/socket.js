import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'https://chat-app-60lc.onrender.com/', credentials: true } });

const socketData = {};

export const getSocketId = (userId) => {
    return socketData[userId];
};

io.on('connection', (socket) => {
    console.log(`socket connected`, socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
        console.log(`userId: ${userId}`);
    }

    // Store the socket ID for each userId
    if (userId !== undefined) {
        socketData[userId] = socket.id;
    }

    console.log('backend data', socketData);

    // Emit the online users to all clients
    io.emit('getOnlineUsers', Object.keys(socketData));

    // Update the last online time when the user disconnects
    socket.on('disconnect', () => {
        console.log(`socket disconnected`, socket.id);

        delete socketData[userId];

        io.emit('getOnlineUsers', Object.keys(socketData));
    });
});

export { app, server, io };
