const cron = require('node-cron');
const NotificationService = require('../utils/notificationService');

// Run every 5 minutes to check for due notifications
const notificationJob = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running notification job...');
    
    // Send due notifications
    const sentCount = await NotificationService.sendDueNotifications();
    if (sentCount > 0) {
      console.log(`Sent ${sentCount} notifications`);
    }
    
    // Clean up old notifications (run once per day)
    const now = new Date();
    if (now.getHours() === 2 && now.getMinutes() < 5) { // Run around 2 AM
      const deletedCount = await NotificationService.clearOldNotifications(30);
      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} old notifications`);
      }
    }
  } catch (error) {
    console.error('Error in notification job:', error);
  }
});

// Start the job
notificationJob.start();

console.log('Notification job scheduled');

module.exports = notificationJob; 