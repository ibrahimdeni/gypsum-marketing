const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;