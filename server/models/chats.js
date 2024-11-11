import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatMessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User ', // Assuming you have a User model
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User ', // Assuming you have a User model
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000 // Optional: limit message length
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the message is created
    },
    isRead: {
        type: Boolean,
        default: false // Messages are unread by default
    },
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom', // Optional: reference to a chat room if using group chats
        required: false
    }
});

// Create a ChatMessage model
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;