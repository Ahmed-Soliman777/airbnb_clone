const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    // Track online users
    const onlineUsers = new Map();

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`User connected: ${userId}`);

        // Add to online users
        onlineUsers.set(userId, socket.id);
        io.emit('users:online', Array.from(onlineUsers.keys()));

        // Join user's personal room
        socket.join(userId);

        // Join conversation room
        socket.on('conversation:join', (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${userId} joined conversation ${conversationId}`);
        });

        // Leave conversation room
        socket.on('conversation:leave', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
        });

        // Handle new message
        socket.on('message:send', (data) => {
            const { conversationId, message, recipientId } = data;

            // Emit to conversation room
            socket.to(`conversation:${conversationId}`).emit('message:new', {
                ...message,
                conversationId
            });

            // Also emit to recipient's personal room for notifications
            if (recipientId) {
                socket.to(recipientId).emit('message:notification', {
                    conversationId,
                    message
                });
            }
        });

        // Handle typing indicator
        socket.on('typing:start', ({ conversationId }) => {
            socket.to(`conversation:${conversationId}`).emit('typing:start', { userId });
        });

        socket.on('typing:stop', ({ conversationId }) => {
            socket.to(`conversation:${conversationId}`).emit('typing:stop', { userId });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
            io.emit('users:online', Array.from(onlineUsers.keys()));
        });
    });

    return io;
};

module.exports = { initializeSocket };
