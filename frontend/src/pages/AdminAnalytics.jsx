import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/api/analytics/dashboard', config);
      setData(res.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  if (loading || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  const formatRupiah = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

  const salesChartData = {
    labels: data.salesPerMonth.map(d => d.month),
    datasets: [{
      label: 'Revenue',
      data: data.salesPerMonth.map(d => d.revenue),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3B82F6',
    }]
  };

  const ordersChartData = {
    labels: data.salesPerMonth.map(d => d.month),
    datasets: [{
      label: 'Orders',
      data: data.salesPerMonth.map(d => d.orders),
      backgroundColor: '#10B981',
      borderRadius: 8,
    }]
  };

  const categoryChartData = {
    labels: data.categoryDistribution.map(d => d._id?.replace('-', ' ') || 'Unknown'),
    datasets: [{
      data: data.categoryDistribution.map(d => d.count),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'],
      borderWidth: 2,
      borderColor: '#fff',
    }]
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</Link>
            <h1 className="text-xl font-bold">📊 Analytics</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* ===== TOP CARDS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Revenue Today', value: formatRupiah(data.revenue.today), color: 'bg-green-500', icon: '💰' },
            { label: 'Revenue Month', value: formatRupiah(data.revenue.thisMonth), color: 'bg-blue-500', icon: '📅' },
            { label: 'Total Revenue', value: formatRupiah(data.revenue.total), color: 'bg-purple-500', icon: '💵' },
            { label: 'Total Orders', value: data.totals.orders, color: 'bg-orange-500', icon: '📦' },
            { label: 'Total Products', value: data.totals.products, color: 'bg-pink-500', icon: '🏗️' },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* ===== CHARTS ROW 1 ===== */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Revenue Trend</h3>
            <Line data={salesChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Orders per Month</h3>
            <Bar data={ordersChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {/* ===== CHARTS ROW 2 ===== */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Categories</h3>
            <Doughnut data={categoryChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
          {/* Order Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📦 Order Status</h3>
            <div className="space-y-3">
              {Object.entries(data.statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 Top Products</h3>
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-400 w-6">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.quantity} sold</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{formatRupiah(p.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== ADDITIONAL STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Users', value: data.totals.users, icon: '👥' },
            { label: 'Inquiries', value: data.totals.inquiries, icon: '📧' },
            { label: 'Reviews', value: data.totals.reviews, icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ===== RECENT ORDERS ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🕐 Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm">Order #</th>
                  <th className="p-4 text-left text-sm">Customer</th>
                  <th className="p-4 text-left text-sm">Total</th>
                  <th className="p-4 text-left text-sm">Status</th>
                  <th className="p-4 text-left text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="p-4 text-sm">{order.user?.name || 'N/A'}</td>
                    <td className="p-4 text-sm font-semibold">{formatRupiah(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;