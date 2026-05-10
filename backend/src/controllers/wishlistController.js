const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('products');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    
    res.json({ success: true, data: wishlist.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ 
        user: req.user.id, 
        products: [productId] 
      });
    } else {
      // Check if already in wishlist
      const exists = wishlist.products.includes(productId);
      if (!exists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }
    
    const populated = await Wishlist.findById(wishlist._id).populate('products');
    
    res.json({ success: true, data: populated.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        p => p.toString() !== productId
      );
      await wishlist.save();
    }
    
    const populated = await Wishlist.findById(wishlist._id).populate('products');
    
    res.json({ success: true, data: populated.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }
    
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};