const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.post('/', createInquiry);

// Admin only
router.get('/', protect, authorize('admin'), getInquiries);
router.get('/:id', protect, authorize('admin'), getInquiry);
router.put('/:id', protect, authorize('admin'), updateInquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

module.exports = router;