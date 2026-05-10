const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Total counts
    const [totalProducts, totalUsers, totalInquiries, totalReviews, totalOrders, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Review.countDocuments(),
      Order.countDocuments(),
      Order.find({}).populate('user', 'name').sort('-createdAt')
    ]);

    // Revenue calculations
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonth);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);

    // Order status counts
    const statusCounts = {
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Sales per month (last 12 months)
    const salesPerMonth = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const monthOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= d && date <= monthEnd;
      });
      salesPerMonth.push({
        month: d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
        orders: monthOrders.length
      });
    }

    // Top products (by order count)
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Category distribution (from products)
    const categoryDist = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(5)
      .select('orderNumber user total status createdAt');

    res.json({
      success: true,
      data: {
        totals: {
          products: totalProducts,
          users: totalUsers,
          inquiries: totalInquiries,
          reviews: totalReviews,
          orders: totalOrders,
        },
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          thisMonth: monthRevenue,
        },
        statusCounts,
        salesPerMonth,
        topProducts,
        categoryDistribution: categoryDist,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};