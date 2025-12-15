import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { getCookie } from "@/utils/cookies";

const API_URL = "http://localhost:3000/api";

// Fetch all conversations
export const fetchConversations = createAsyncThunk(
    "messages/fetchConversations",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/messages/conversations`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch conversations");
        }
    }
);

// Fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async (conversationId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/messages/conversations/${conversationId}`,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
        }
    }
);

// Send a message
export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async ({ conversationId, content }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/messages/send`,
                { conversationId, content },
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to send message");
        }
    }
);

// Get or create conversation
export const getOrCreateConversation = createAsyncThunk(
    "messages/getOrCreateConversation",
    async (recipientId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/messages/conversations`,
                { recipientId },
                { withCredentials: true },
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create conversation");
        }
    }
);

// Get unread count
export const fetchUnreadCount = createAsyncThunk(
    "messages/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/messages/unread-count`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch unread count");
        }
    }
);

const initialState = {
    conversations: [],
    messages: [],
    selectedConversation: null,
    unreadCount: 0,
    loading: false,
    messagesLoading: false,
    sendingMessage: false,
    error: null
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateConversationLastMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            state.conversations = state.conversations.map((conv) =>
                conv._id === conversationId
                    ? { ...conv, lastMessage: message, lastMessageAt: new Date().toISOString() }
                    : conv
            );
        },
        clearMessages: (state) => {
            state.messages = [];
            state.selectedConversation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch conversations
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch messages
            .addCase(fetchMessages.pending, (state) => {
                state.messagesLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesLoading = false;
                state.error = action.payload;
            })
            // Send message
            .addCase(sendMessage.pending, (state) => {
                state.sendingMessage = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sendingMessage = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendingMessage = false;
                state.error = action.payload;
            })
            // Get or create conversation
            .addCase(getOrCreateConversation.fulfilled, (state, action) => {
                const exists = state.conversations.find((c) => c._id === action.payload._id);
                if (!exists) {
                    state.conversations.unshift(action.payload);
                }
                state.selectedConversation = action.payload;
            })
            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            });
    }
});

export const {
    setSelectedConversation,
    addMessage,
    updateConversationLastMessage,
    clearMessages
} = messagesSlice.actions;

export default messagesSlice.reducer;
