const Inquiry = require('../models/Inquiry');

// Create inquiry (dari customer)
exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all inquiries (admin)
exports.getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const inquiries = await Inquiry.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      data: inquiries,
      pagination: { current: page, pages: Math.ceil(total / limit), total, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single inquiry
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};