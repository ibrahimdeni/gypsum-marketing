const Review = require('../models/Review');
const Product = require('../models/Product');

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = '-createdAt', page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ product: productId, isActive: true })
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: productId, isActive: true });

    res.json({
      success: true,
      data: reviews,
      pagination: { current: page, pages: Math.ceil(total / limit), total, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
      images: images || []
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    review.updatedAt = Date.now();
    await review.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete review (user)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership (customer only delete own, admin can delete any)
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { productId, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const query = {};
    if (productId) query.product = productId;

    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name images')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    // Get stats
    const stats = await Review.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        distribution: { $push: '$rating' }
      }}
    ]);

    // Rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0 && stats[0].distribution) {
      stats[0].distribution.forEach(r => distribution[r]++);
    }

    res.json({
      success: true,
      data: reviews,
      stats: {
        avgRating: stats[0]?.avgRating || 0,
        totalReviews: stats[0]?.totalReviews || 0,
        distribution
      },
      pagination: { current: page, pages: Math.ceil(total / limit), total, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Toggle review active status
exports.toggleReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isActive = !review.isActive;
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};