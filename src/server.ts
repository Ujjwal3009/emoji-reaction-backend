import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocket } from './socket';

const app = express();
const server = http.createServer(app);

// More detailed CORS configuration
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost"],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Enable CORS for all routes
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost"],
    credentials: true
}));

setupSocket(io);

const PORT = process.env.PORT || 5000;

// Enhanced health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check endpoint called');
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Add error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('CORS enabled for:', ["http://localhost:3000", "http://localhost"]);
}); 