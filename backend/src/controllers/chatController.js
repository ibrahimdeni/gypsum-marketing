const { Chat, ChatRoom } = require('../models/Chat');
const User = require('../models/User');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { message, productId } = req.body;
    const senderId = req.user.id;

    // Find or create admin (first admin found)
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'No admin available' });
    }

    // If user is admin, they send to specific user
    let receiverId;
    if (req.user.role === 'admin') {
      receiverId = req.body.receiverId;
      if (!receiverId) {
        return res.status(400).json({ success: false, message: 'Receiver ID required' });
      }
    } else {
      receiverId = admin._id;
    }

    // Create message
    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      message,
      product: productId || null
    });

    // Update or create chat room
    let chatRoom = await ChatRoom.findOne({
      user: req.user.role === 'admin' ? receiverId : senderId
    });

    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        user: req.user.role === 'admin' ? receiverId : senderId,
        admin: admin._id,
        lastMessage: message,
        unreadCount: req.user.role === 'admin' ? 0 : 1
      });
    } else {
      chatRoom.lastMessage = message;
      chatRoom.lastMessageDate = new Date();
      if (req.user.role !== 'admin') {
        chatRoom.unreadCount += 1;
      }
      await chatRoom.save();
    }

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages between user and admin
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    let otherUserId = req.query.userId;

    if (!otherUserId && req.user.role !== 'admin') {
      // Customer: get admin
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        return res.json({ success: true, data: [] });
      }
      otherUserId = admin._id;
    }

    const query = {
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    };

    // Optional: filter by product
    if (req.query.productId) {
      query.product = req.query.productId;
    }

    const messages = await Chat.find(query)
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .populate('product', 'name')
      .sort('createdAt')
      .limit(100);

    // Mark messages as read
    await Chat.updateMany(
      { sender: otherUserId, receiver: userId, isRead: false },
      { isRead: true }
    );

    // Reset unread count
    if (req.user.role === 'admin') {
      await ChatRoom.findOneAndUpdate(
        { user: otherUserId },
        { unreadCount: 0 }
      );
    }

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all chat rooms (admin only)
exports.getChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ isActive: true })
      .populate('user', 'name email')
      .sort('-lastMessageDate');

    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unread count for current user
exports.getUnreadCount = async (req, res) => {
  try {
    let count = 0;
    
    if (req.user.role === 'admin') {
      // Admin: count all unread rooms
      const rooms = await ChatRoom.find({ unreadCount: { $gt: 0 } });
      count = rooms.reduce((sum, room) => sum + room.unreadCount, 0);
    } else {
      // Customer: count unread from admin
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        count = await Chat.countDocuments({
          sender: admin._id,
          receiver: req.user.id,
          isRead: false
        });
      }
    }

    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};