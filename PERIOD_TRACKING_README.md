# Period Tracking & Notification System

## Overview

This feature adds comprehensive period tracking with smart prediction algorithms and automated notifications to help users manage their menstrual cycles effectively.

## Features

### 🗓️ Smart Period Prediction
- **Multiple Prediction Algorithms**: Uses both simple average and weighted average methods for more accurate predictions
- **Cycle History Tracking**: Maintains up to 12 cycles for improved prediction accuracy
- **Cycle Phase Detection**: Identifies current cycle phase (menstrual, follicular, ovulatory, luteal, premenstrual)
- **Progress Visualization**: Shows cycle progress with visual indicators

### 🔔 Automated Notifications
- **Customizable Reminders**: Set reminders 1, 2, 3, 5, or 7 days before predicted period
- **Multiple Reminder Types**: Support for different notification priorities (high, medium, low)
- **Real-time Updates**: Notifications automatically update when cycle data changes
- **Notification Bell**: Easy access to upcoming reminders in the navigation bar

### 📊 Cycle Analytics
- **Cycle History**: Track and visualize past cycles
- **Average Cycle Length**: Automatically calculated based on recorded cycles
- **Cycle Length Trends**: Monitor changes in cycle patterns over time
- **Overdue Detection**: Alerts when periods are overdue

### 🎨 User Interface
- **Beautiful Design**: Modern, responsive interface with gradient backgrounds
- **Interactive Elements**: Smooth animations and hover effects
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Dark Mode Support**: Full theme compatibility

## Technical Implementation

### Backend Components

#### Enhanced Models
- **User Model**: Extended with cycle history and reminder preferences
- **Notification Model**: Support for different notification types and priorities

#### API Routes
- `POST /api/cycle/update`: Update cycle information and preferences
- `GET /api/cycle/status`: Get current cycle status and predictions
- `POST /api/cycle/start-period`: Record period start and update predictions
- `GET /api/notifications`: Fetch user notifications
- `POST /api/notifications/mark-read/:id`: Mark notification as read

#### Services
- **NotificationService**: Handles notification creation, sending, and cleanup
- **Prediction Algorithms**: Weighted average and simple average methods
- **Cron Jobs**: Automated notification sending every 5 minutes

### Frontend Components

#### Pages
- **Period Tracking Page** (`/period-tracking`): Main interface for cycle management
- **API Routes**: Frontend API routes for backend communication

#### Components
- **NotificationBell**: Displays upcoming notifications in navigation
- **Enhanced Navbar**: Added period tracking link and notification bell

## Usage

### Setting Up Period Tracking

1. **Initial Setup**: Navigate to the Period Tracking page
2. **Enter Cycle Data**: Provide last period date and average cycle length
3. **Configure Reminders**: Choose when to receive notifications (1-7 days before)
4. **Start Tracking**: Click "Start Period Today" when your period begins

### Managing Notifications

1. **View Notifications**: Click the bell icon in the navigation bar
2. **Customize Reminders**: Adjust reminder days in the settings section
3. **Track Progress**: Monitor cycle progress and upcoming predictions

### Cycle Analytics

1. **View History**: See past cycles and their lengths
2. **Monitor Trends**: Track changes in cycle patterns
3. **Phase Awareness**: Understand your current cycle phase

## Configuration

### Environment Variables
```env
BACKEND_URL=http://localhost:5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

### Notification Settings
- **Default Reminder Days**: 3 and 1 days before period
- **Notification Types**: period_reminder, health_alert, general
- **Priority Levels**: high, medium, low

## Database Schema

### User Model Extensions
```javascript
cycleInfo: {
  lastPeriodDate: Date,
  avgCycleLength: Number,
  cycleHistory: [{
    startDate: Date,
    length: Number,
    recordedAt: Date
  }],
  reminderDays: [Number],
  notificationEnabled: Boolean
}
```

### Notification Model
```javascript
{
  userId: ObjectId,
  message: String,
  dueDate: Date,
  sent: Boolean,
  type: String,
  priority: String,
  sentAt: Date,
  createdAt: Date
}
```

## Security Features

- **Authentication Required**: All cycle operations require user authentication
- **Session Management**: Secure session handling with MongoDB store
- **Data Validation**: Input validation and sanitization
- **User Isolation**: Users can only access their own data

## Performance Optimizations

- **Cron Job Efficiency**: Notifications processed every 5 minutes
- **Database Indexing**: Optimized queries for cycle data
- **Caching**: Session data cached for improved performance
- **Cleanup Jobs**: Automatic cleanup of old notifications

## Future Enhancements

### Planned Features
- **Symptom Tracking**: Track symptoms throughout the cycle
- **Fertility Tracking**: Ovulation prediction and fertility windows
- **Health Insights**: AI-powered health recommendations
- **Export Data**: Download cycle data for medical appointments
- **Partner Sharing**: Share cycle data with healthcare providers

### Technical Improvements
- **Push Notifications**: Real-time push notifications
- **Email Notifications**: Email reminders for important events
- **Advanced Analytics**: Machine learning for better predictions
- **Integration**: Connect with health apps and devices

## Troubleshooting

### Common Issues

1. **Notifications Not Sending**
   - Check if cron job is running
   - Verify MongoDB connection
   - Check notification service logs

2. **Predictions Inaccurate**
   - Ensure sufficient cycle history (3+ cycles recommended)
   - Verify last period date accuracy
   - Check for data entry errors

3. **Frontend Not Loading**
   - Verify backend URL configuration
   - Check API route availability
   - Ensure proper CORS settings

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=cycle:*
```

## Contributing

When contributing to the period tracking feature:

1. **Follow Code Style**: Use consistent formatting and naming conventions
2. **Add Tests**: Include unit tests for new functionality
3. **Update Documentation**: Keep this README current
4. **Security Review**: Ensure all changes follow security best practices

## Support

For issues or questions about the period tracking feature:
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

**Note**: This feature is designed to support general health tracking and should not replace professional medical advice. Users should consult healthcare providers for medical concerns. 