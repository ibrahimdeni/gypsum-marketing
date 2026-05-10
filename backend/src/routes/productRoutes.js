const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProduct);

// Protected routes (admin only)
router.post('/', protect, authorize('admin', 'editor'), productController.createProduct);
router.put('/:id', protect, authorize('admin', 'editor'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;