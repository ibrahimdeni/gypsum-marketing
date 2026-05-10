const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Get all inventory logs
exports.getInventoryLogs = async (req, res) => {
  try {
    const { productId, type, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (productId) query.product = productId;
    if (type) query.type = type;

    const logs = await Inventory.find(query)
      .populate('product', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add stock (stock masuk)
exports.addStock = async (req, res) => {
  try {
    const { productId, quantity, notes } = req.body;
    
    const inventory = await Inventory.create({
      product: productId,
      type: 'in',
      quantity,
      notes: notes || 'Stock masuk',
      createdBy: req.user?.name || 'Admin'
    });

    const updatedProduct = await Product.findById(productId);
    
    res.status(201).json({
      success: true,
      data: inventory,
      currentStock: updatedProduct.stock
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reduce stock (stock keluar)
exports.reduceStock = async (req, res) => {
  try {
    const { productId, quantity, notes } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Stok tidak cukup! Tersedia: ${product.stock}` 
      });
    }

    const inventory = await Inventory.create({
      product: productId,
      type: 'out',
      quantity,
      notes: notes || 'Stock keluar',
      createdBy: req.user?.name || 'Admin'
    });

    res.status(201).json({
      success: true,
      data: inventory,
      currentStock: product.stock - quantity
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get inventory summary
exports.getInventorySummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);

    const recentLogs = await Inventory.find()
      .populate('product', 'name')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        outOfStock,
        totalStock: totalStock[0]?.total || 0,
        recentLogs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};