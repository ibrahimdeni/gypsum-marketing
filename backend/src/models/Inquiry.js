const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  company: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: 10
  },
  productInterest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'social_media', 'referral'],
    default: 'website'
  },
  notes: [{
    text: String,
    addedBy: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);