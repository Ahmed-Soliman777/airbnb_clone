const express = require('express');
const router = express.Router();
const auth = require('../middleware/userMiddleware');
const {
    getConversations,
    getMessages,
    sendMessage,
    getOrCreateConversation,
    getUnreadCount
} = require('../controllers/message.controller');

// All routes require authentication
router.use(auth);

// Get all conversations
router.get('/conversations', getConversations);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Get or create conversation
router.post('/conversations', getOrCreateConversation);

// Get messages for a conversation
router.get('/conversations/:conversationId', getMessages);

// Send a message
router.post('/send', sendMessage);

module.exports = router;
