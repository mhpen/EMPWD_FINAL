import ChatMessage from '../models/chats.js';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'receiverId and message are required fields' 
      });
    }

    const newMessage = new ChatMessage({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await ChatMessage.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    })
    .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all unique conversations for the current user
    const conversations = await ChatMessage.aggregate([
      // Match messages where the current user is either sender or receiver
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(currentUserId) },
            { receiverId: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      // Sort by creation date descending
      { $sort: { createdAt: -1 } },
      // Group by conversation partner
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
              then: '$receiverId',
              else: '$senderId'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(currentUserId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get user details for each conversation partner
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const partner = await User.findById(conv._id)
          .select('email role firstName lastName');
        
        return {
          partner: {
            _id: partner._id,
            email: partner.email,
            role: partner.role,
            firstName: partner.firstName,
            lastName: partner.lastName
          },
          lastMessage: {
            _id: conv.lastMessage._id,
            message: conv.lastMessage.message,
            createdAt: conv.lastMessage.createdAt,
            senderId: conv.lastMessage.senderId,
            receiverId: conv.lastMessage.receiverId
          },
          unreadCount: conv.unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: conversationsWithDetails
    });
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user._id;

    await ChatMessage.updateMany(
      {
        senderId: senderId,
        receiverId: currentUserId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
}; 