# Sync Health App - Backend Authentication

A secure, scalable authentication system for the Sync hormonal health app using Node.js, Express, and MongoDB.

## 🚀 Features

- **User Registration & Login**: Secure user authentication with bcrypt password hashing
- **Session Management**: Express-session with MongoDB storage
- **Input Validation**: Comprehensive validation for all user inputs
- **Security**: Password hashing, session security, and CORS protection
- **Error Handling**: Robust error handling and user-friendly messages

## 📋 Requirements

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory with:
   ```env
   # MongoDB Configuration
   MONGO_URI=mongodb+srv://ridhima3915beai23:<@Ridhimajpmc17>@cluster0.awyo0ck.mongodb.net/sync-app?retryWrites=true&w=majority&appName=Cluster0
   
   # Session Configuration
   SESSION_SECRET=sync_health_app_secret_key_2024
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # Backend URL (for frontend API calls)
   BACKEND_URL=http://localhost:5000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── authMiddleware.js   # Authentication middleware
├── models/
│   └── User.js            # User schema and methods
├── routes/
│   └── auth.js            # Authentication routes
├── server.js              # Main server file
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication Routes

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/auth/logout`
Logout the current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/me`
Get current user information.

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/auth/status`
Check authentication status.

**Response:**
```json
{
  "success": true,
  "isAuthenticated": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Health Check

#### `GET /api/health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "message": "Sync Health App Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **Session Security**: HttpOnly cookies, secure in production
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Secure error messages without exposing internals

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  createdAt: Date (default: now),
  updatedAt: Date (auto)
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  session: String (session data),
  expires: Date (TTL index)
}
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (already logged in)
- `404` - Not Found
- `500` - Server Error

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `SESSION_SECRET` | Session encryption key | `sync_secret_key_2024` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `BACKEND_URL` | Backend URL for frontend | `http://localhost:5000` |

## 🧪 Testing

To test the API endpoints:

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Test registration**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. **Test login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## 🚀 Deployment

1. **Set environment variables** for production
2. **Update CORS origin** to your frontend URL
3. **Enable secure cookies** in production
4. **Use PM2 or similar** for process management

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Sync Health App** 