import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import EmptyState from '../components/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/my');
      setOrders(data.data || []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>;
  if (orders.length === 0) return <EmptyState icon="📦" title="No orders yet" description="You haven't placed any orders." actionText="Shop Now" actionLink="/products" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">📦 My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link to={`/orders/${order._id}`} key={order._id}
            className="block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-sm text-gray-500">{order.orderNumber}</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">Rp {order.total?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{order.items?.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;