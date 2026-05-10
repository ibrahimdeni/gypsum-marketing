const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  paymentNotification
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

// Midtrans callback (NO AUTH)
router.post('/notification', paymentNotification);

module.exports = router;