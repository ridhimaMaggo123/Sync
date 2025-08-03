const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Send due notifications
  static async sendDueNotifications() {
    try {
      const dueNotifications = await Notification.find({
        dueDate: { $lte: new Date() },
        sent: false
      }).populate('userId');

      for (const notification of dueNotifications) {
        await this.sendNotification(notification);
      }

      return dueNotifications.length;
    } catch (error) {
      console.error('Error sending due notifications:', error);
      throw error;
    }
  }

  // Send a single notification
  static async sendNotification(notification) {
    try {
      // In a real app, this would integrate with push notifications, email, SMS, etc.
      console.log(`Sending notification to user ${notification.userId._id}: ${notification.message}`);
      
      // Mark as sent
      await Notification.findByIdAndUpdate(notification._id, {
        sent: true,
        sentAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Create period reminder notifications
  static async createPeriodReminders(userId, nextPeriodDate, reminderDays = [3, 1]) {
    try {
      const notifications = [];

      for (const daysBefore of reminderDays) {
        const reminderDate = new Date(nextPeriodDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
        
        // Only create reminder if it's in the future
        if (reminderDate > new Date()) {
          notifications.push({
            userId: userId,
            message: `Your next period is predicted in ${daysBefore} day${daysBefore > 1 ? 's' : ''}. Time to prepare!`,
            dueDate: reminderDate,
            sent: false,
            type: 'period_reminder',
            priority: daysBefore === 1 ? 'high' : 'medium'
          });
        }
      }

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating period reminders:', error);
      throw error;
    }
  }

  // Get user's upcoming notifications
  static async getUserNotifications(userId, limit = 10) {
    try {
      return await Notification.find({
        userId: userId,
        dueDate: { $gte: new Date() },
        sent: false
      })
      .sort({ dueDate: 1 })
      .limit(limit);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Clear old sent notifications
  static async clearOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        sent: true,
        sentAt: { $lt: cutoffDate }
      });

      return result.deletedCount;
    } catch (error) {
      console.error('Error clearing old notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 