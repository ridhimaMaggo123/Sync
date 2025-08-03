require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'sync_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: false, // Set to true if using HTTPS
  },
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/exercise', require('./routes/exercise'));
app.use('/api/cycle', require('./routes/cycle'));
app.use('/api/report', require('./routes/report'));
app.use('/api/notifications', require('./routes/notifications'));

// Start notification job
if (process.env.NODE_ENV !== 'test') {
  require('./jobs/notificationJob');
}

module.exports = app;
