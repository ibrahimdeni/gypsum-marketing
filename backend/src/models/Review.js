const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    minlength: [3, 'Comment must be at least 3 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  images: [{
    url: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isActive: true } },
    { $group: {
      _id: '$product',
      avgRating: { $avg: '$rating' },
      numReviews: { $sum: 1 }
    }}
  ]);

  const Product = mongoose.model('Product');
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) doc.constructor.calcAverageRating(doc.product);
});

reviewSchema.post('findOneAndUpdate', function(doc) {
  if (doc) doc.constructor.calcAverageRating(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);