const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    const formattedItems = cart.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
      category: item.product.category,
      quantity: item.quantity,
      stock: item.product.stock
    }));
    
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      
      await cart.save();
    }
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    const formattedItems = updatedCart.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
      quantity: item.quantity,
      stock: item.product.stock
    }));
    
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const item = cart.items.find(
      item => item.product.toString() === productId
    );
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    const formattedItems = updatedCart.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
      quantity: item.quantity,
      stock: item.product.stock
    }));
    
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (cart) {
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
      await cart.save();
    }
    
    res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};