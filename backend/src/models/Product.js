const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
    // Hapus "required: true" - biarin aja kosong
  },
  description: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    default: 'gypsum-board'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  applications: [String],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  images: [{
    url: String,
    public_id: String,
    alt: String
  }],
  specifications: {
    thickness: String,
    width: String,
    length: String,
    weight: String,
    color: String,
    material: String,
    brand: String,
    warranty: String
  },
});

// Auto-generate slug sebelum save
productSchema.pre('save', function(next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);