import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import Toast from '../utils/toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/api/orders/admin/all${params}`, config);
      setOrders(data.data || []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
      Toast.success('Order status updated!');
      fetchOrders();
    } catch (error) { Toast.error('Failed to update'); }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</Link>
            <h1 className="text-xl font-bold">📋 Order Management</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                statusFilter === status ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold">Order #</th>
                    <th className="p-4 text-left text-sm font-semibold">Customer</th>
                    <th className="p-4 text-left text-sm font-semibold">Items</th>
                    <th className="p-4 text-left text-sm font-semibold">Total</th>
                    <th className="p-4 text-left text-sm font-semibold">Status</th>
                    <th className="p-4 text-left text-sm font-semibold">Date</th>
                    <th className="p-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders found</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                        <td className="p-4 text-sm">{order.user?.name || 'N/A'}</td>
                        <td className="p-4 text-sm">{order.items?.length || 0} items</td>
                        <td className="p-4 font-semibold text-sm">Rp {order.total?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;