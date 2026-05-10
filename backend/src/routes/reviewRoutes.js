const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  toggleReviewStatus
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/product/:productId', getProductReviews);

// Customer
router.post('/product/:productId', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllReviews);
router.put('/admin/:reviewId/toggle', protect, authorize('admin'), toggleReviewStatus);

module.exports = router;