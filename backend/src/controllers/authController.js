const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: generateToken(user._id) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email, phone, address, avatar }, { new: true, runValidators: true });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ADMIN: Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Update User
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ADMIN: Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};