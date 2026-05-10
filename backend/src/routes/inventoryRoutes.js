const express = require('express');
const router = express.Router();
const { 
  getInventoryLogs, 
  addStock, 
  reduceStock, 
  getInventorySummary 
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getInventoryLogs);
router.get('/summary', protect, getInventorySummary);
router.post('/add', protect, authorize('admin', 'editor'), addStock);
router.post('/reduce', protect, authorize('admin', 'editor'), reduceStock);

module.exports = router;