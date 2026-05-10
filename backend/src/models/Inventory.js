const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  notes: String,
  createdBy: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update product stock after save
inventorySchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    if (this.type === 'in') {
      product.stock += this.quantity;
    } else {
      product.stock -= this.quantity;
    }
    await product.save();
  }
});

// Update product stock after remove
inventorySchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    if (this.type === 'in') {
      product.stock -= this.quantity;
    } else {
      product.stock += this.quantity;
    }
    await product.save();
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);