const { Message, Conversation } = require('../models/message.model');

// Get all conversations for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'firstName lastName')
            .populate('lastMessage')
            .populate('listing')
            .sort({ lastMessageAt: -1 });

        res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get conversations'
        });
    }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;
        const { page = 1, limit = 50 } = req.query;

        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Mark messages as read
        await Message.updateMany(
            {
                conversation: conversationId,
                sender: { $ne: userId },
                readBy: { $ne: userId }
            },
            { $addToSet: { readBy: userId } }
        );

        res.status(200).json({
            success: true,
            data: messages.reverse()
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get messages'
        });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { conversationId, content, recipientId, listingId, listingType } = req.body;
        const senderId = req.user._id;

        let conversation;

        if (conversationId) {
            // Existing conversation
            conversation = await Conversation.findOne({
                _id: conversationId,
                participants: senderId
            });

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
        } else {
            // Create new conversation
            if (!recipientId) {
                return res.status(400).json({
                    success: false,
                    message: 'Recipient is required for new conversation'
                });
            }

            // Check if conversation already exists
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, recipientId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, recipientId],
                    listing: listingId || null,
                    listingType: listingType || null
                });
            }
        }

        const message = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            content,
            readBy: [senderId]
        });

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'firstName lastName');

        res.status(201).json({
            success: true,
            data: {
                message: populatedMessage,
                conversationId: conversation._id
            }
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send message'
        });
    }
};

// Get or create conversation
const getOrCreateConversation = async (req, res) => {
    try {
        const { recipientId, listingId, listingType } = req.body;
        const userId = req.user._id;

        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: 'Recipient is required'
            });
        }

        // Check if conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, recipientId] }
        }).populate('participants', 'firstName lastName');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, recipientId],
                listing: listingId || null,
                listingType: listingType || null
            });
            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'firstName lastName');
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        console.error('Get or create conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get or create conversation'
        });
    }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({ participants: userId });
        const conversationIds = conversations.map(c => c._id);

        const unreadCount = await Message.countDocuments({
            conversation: { $in: conversationIds },
            sender: { $ne: userId },
            readBy: { $ne: userId }
        });

        res.status(200).json({
            success: true,
            data: { unreadCount }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get unread count'
        });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    getOrCreateConversation,
    getUnreadCount
};