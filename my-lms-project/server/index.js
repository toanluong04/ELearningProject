// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); 
const { Server } = require('socket.io');

// Import models
const Chat = require('./models/chat'); 

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Import payment controller for the raw webhook
const paymentController = require('./controllers/paymentController');

const app = express();
const server = http.createServer(app); 
const PORT = process.env.PORT || 5000;

// Socket.io Initialization
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware - Static Files & CORS
app.use(cors());
app.use('/uploads', express.static('uploads')); 

// 🚨 1. STRIPE WEBHOOK MUST GO HERE (BEFORE express.json!)
// We use express.raw() to preserve the exact security signature from Stripe
app.post(
  '/api/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.stripeWebhook
);

// ✅ 2. ENABLE JSON FOR ALL OTHER ROUTES
app.use(express.json());

// Mount Standard Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingsRoutes);

// --- SOCKET LOGIC ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join private rooms
  socket.on('join_chat', (userId) => socket.join(userId));
  socket.on('join_admin_room', () => socket.join('admin'));

  // FETCH ACTIVE CHAT USERS (For Admin Sidebar)
  socket.on('get_active_users', async () => {
    try {
      const users = await Chat.aggregate([
        { $match: { senderId: { $ne: 'admin' } } },
        { $group: { _id: "$senderId", senderName: { $first: "$senderName" }, lastMessage: { $max: "$createdAt" } } },
        { $sort: { lastMessage: -1 } }
      ]);
      socket.emit('active_users_list', users);
    } catch (err) { console.error(err); }
  });

  // FETCH SPECIFIC CHAT HISTORY
  socket.on('fetch_messages', async (userId) => {
    try {
      const history = await Chat.find({
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }).sort({ createdAt: 1 });
      
      socket.emit('load_history', history);
    } catch (err) { console.error("Error fetching history:", err); }
  });

  // SEND MESSAGE & SAVE TO DB
  socket.on('send_message', async (data) => {
    try {
      // 1. Save to MongoDB
      const newMessage = new Chat({
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        text: data.text
      });
      await newMessage.save();

      // 2. Send to recipient
      io.to(data.receiverId).emit('receive_message', data);
      
      // 3. If student sends to admin, notify admin room and refresh user list
      if (data.receiverId === 'admin') {
          io.to('admin').emit('receive_message', data);
          
          // Refresh the sidebar for admin
          const users = await Chat.aggregate([
            { $match: { senderId: { $ne: 'admin' } } },
            { $group: { _id: "$senderId", senderName: { $first: "$senderName" }, lastMessage: { $max: "$createdAt" } } },
            { $sort: { lastMessage: -1 } }
          ]);
          io.to('admin').emit('active_users_list', users);
      }
    } catch (err) {
      console.error("Chat save error:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to DB then Start Server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Database Connected & Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to DB", err);
});