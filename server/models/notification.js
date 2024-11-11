import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User ', // Assuming you have a User model
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 255 // Optional: limit message length
    },
    isRead: {
        type: Boolean,
        default: false // Notifications are unread by default
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the notification is created
    },
    type: {
        type: String,
        enum: ['application', 'rating', 'message', 'other'], // Define types of notifications
        required: true
    },
    relatedId: {
        type: Schema.Types.ObjectId,
        required: false, // Optional: could reference another model (e.g., applicationId, ratingId)
    }
});

// Create a Notification model
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;