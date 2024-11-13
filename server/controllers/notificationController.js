import Notification from '../models/notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            userId: req.user._id 
        })
        .sort({ createdAt: -1 })
        .limit(20);

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { 
                _id: req.params.id,
                userId: req.user._id
            },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification'
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification'
        });
    }
};

export const createNotification = async ({
    userId,
    type,
    title,
    message,
    jobId = null
}) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            jobId
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}; 