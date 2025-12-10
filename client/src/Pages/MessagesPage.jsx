import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { getCookie } from "../utils/cookies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
import {
    fetchConversations,
    fetchMessages,
    sendMessage as sendMessageAction,
    getOrCreateConversation,
    setSelectedConversation,
    addMessage,
    updateConversationLastMessage
} from "../store/Slices/messagesSlice";

const MessagesPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [typingUser, setTypingUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Redux state
    const {
        conversations,
        messages,
        selectedConversation,
        loading,
        messagesLoading
    } = useSelector((state) => state.messages);

    // Initialize socket connection
    useEffect(() => {
        const token = getCookie('token');
        if (!token) return;

        const newSocket = io("http://localhost:3000", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
        });

        newSocket.on("message:new", (data) => {
            if (selectedConversation?._id === data.conversationId) {
                dispatch(addMessage(data));
            }
            // Update conversation list
            dispatch(updateConversationLastMessage({
                conversationId: data.conversationId,
                message: data
            }));
        });

        newSocket.on("typing:start", ({ userId }) => {
            setTypingUser(userId);
        });

        newSocket.on("typing:stop", () => {
            setTypingUser(null);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [selectedConversation, dispatch]);

    // Fetch conversations on mount
    useEffect(() => {
        const token = getCookie('token');
        if (!token) return;

        dispatch(fetchConversations());

        // Get current user ID from token
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setCurrentUserId(payload.userId);
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }, [dispatch]);

    // Handle URL params for starting a conversation
    useEffect(() => {
        const recipientId = searchParams.get("recipientId");
        if (recipientId && currentUserId) {
            dispatch(getOrCreateConversation(recipientId));
        }
    }, [searchParams, currentUserId, dispatch]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Join conversation room when selected
    useEffect(() => {
        if (socket && selectedConversation) {
            socket.emit("conversation:join", selectedConversation._id);
            return () => {
                socket.emit("conversation:leave", selectedConversation._id);
            };
        }
    }, [socket, selectedConversation]);

    const selectConversation = (conversation) => {
        dispatch(setSelectedConversation(conversation));
        dispatch(fetchMessages(conversation._id));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        setNewMessage("");

        try {
            const result = await dispatch(sendMessageAction({
                conversationId: selectedConversation._id,
                content: messageContent
            })).unwrap();

            // Emit to socket
            const recipient = selectedConversation.participants.find(
                (p) => p._id !== currentUserId
            );
            socket?.emit("message:send", {
                conversationId: selectedConversation._id,
                message: result,
                recipientId: recipient?._id
            });

            // Update conversation in list
            dispatch(updateConversationLastMessage({
                conversationId: selectedConversation._id,
                message: result
            }));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleTyping = () => {
        if (!socket || !selectedConversation) return;

        socket.emit("typing:start", { conversationId: selectedConversation._id });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing:stop", { conversationId: selectedConversation._id });
        }, 1000);
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find((p) => p._id !== currentUserId);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[700px] bg-card rounded-lg border overflow-hidden shadow-lg">
                    <div className="space-y-2 p-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[700px] bg-card rounded-lg border overflow-hidden shadow-lg">
                {/* Conversations List */}
                <div
                    className={`border-r ${selectedConversation ? "hidden md:block" : ""
                        }`}
                >
                    <div className="p-3 border-b bg-muted/20">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Messages
                        </h2>
                    </div>
                    <ScrollArea className="h-[calc(700px-53px)]">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conversation) => {
                                const other = getOtherParticipant(conversation);
                                return (
                                    <button
                                        key={conversation._id}
                                        onClick={() => selectConversation(conversation)}
                                        className={`w-full p-3 text-left hover:bg-accent transition-colors border-b ${selectedConversation?._id === conversation._id
                                            ? "bg-accent"
                                            : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="text-xs font-semibold">
                                                    {other?.firstName?.[0]}
                                                    {other?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">
                                                    {other?.firstName} {other?.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {conversation.lastMessage?.content || "No messages"}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </ScrollArea>
                </div>

                {/* Messages Area */}
                <div
                    className={`col-span-2 flex flex-col ${!selectedConversation ? "hidden md:flex" : ""
                        }`}
                >
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 border-b flex items-center gap-3 bg-muted/20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => dispatch(setSelectedConversation(null))}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="text-sm font-semibold">
                                        {getOtherParticipant(selectedConversation)?.firstName?.[0]}
                                        {getOtherParticipant(selectedConversation)?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-base">
                                        {getOtherParticipant(selectedConversation)?.firstName}{" "}
                                        {getOtherParticipant(selectedConversation)?.lastName}
                                    </p>
                                    {typingUser && (
                                        <p className="text-sm text-muted-foreground">Typing...</p>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                {messagesLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Skeleton
                                                key={i}
                                                className={`h-12 w-48 ${i % 2 === 0 ? "" : "ml-auto"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => {
                                            const isOwn = message.sender._id === currentUserId;
                                            return (
                                                <div
                                                    key={message._id}
                                                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
                                                            }`}
                                                    >
                                                        <p>{message.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${isOwn
                                                                ? "text-primary-foreground/70"
                                                                : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {formatTime(message.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/30">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                            handleTyping();
                                        }}
                                        placeholder="Type a message..."
                                        className="flex-1 h-11 text-base"
                                        autoComplete="off"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        size="lg"
                                        className="h-11 px-6"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Send
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;