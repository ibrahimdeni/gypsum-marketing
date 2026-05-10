const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/single', protect, uploadSingle);
router.post('/multiple', protect, uploadMultiple);

module.exports = router;