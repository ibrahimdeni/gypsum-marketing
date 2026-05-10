const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getChatRooms,
  getUnreadCount
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', sendMessage);
router.get('/messages', getMessages);
router.get('/rooms', getChatRooms);
router.get('/unread', getUnreadCount);

module.exports = router;