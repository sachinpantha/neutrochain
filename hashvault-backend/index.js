// server.js additions:
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Your frontend URL
        methods: ["GET", "POST"]
    }
});

// Store io instance in app for access in routes
app.set('io', io);

// Your existing middleware
app.use(cors());
app.use(express.json());

//Socket.io connection handling
// io.on('connection', (socket) => {
//     console.log('Client connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// Your existing routes
const uploadRouter = require('./upload');
const downloadRouter = require('./download');
const neutroChainRouter = require('./neutrochain');
app.use('/api', uploadRouter);
app.use('/api', downloadRouter);
app.use('/api/neutrochain', neutroChainRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});