import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import responseRoutes from './routes/responseRoutes.js';

dotenv.config();
dotenv.config();
console.log('CLIENT_URL:', process.env.CLIENT_URL); // debug line
connectDB();

connectDB();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Attach io to app so controllers can access it
app.set('io', io);

// Middlewares — must come before routes
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/responses', responseRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pulseboard API is running!' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('joinPoll', (pollId) => {
    socket.join(`poll_${pollId}`);
    console.log(`Socket ${socket.id} joined poll_${pollId}`);
  });

  socket.on('leavePoll', (pollId) => {
    socket.leave(`poll_${pollId}`);
    console.log(`Socket ${socket.id} left poll_${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});