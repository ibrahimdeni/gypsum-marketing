const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort('-createdAt');
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};