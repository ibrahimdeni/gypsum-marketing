import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import { getImageUrl } from '../utils/baseUrl';
import EmptyState from '../components/EmptyState';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/api/orders/${id}`);
      setOrder(data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const statusSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order?.status);

  const statusColors = {
    pending: 'bg-yellow-500',
    paid: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  if (!order) return <EmptyState icon="🔍" title="Order not found" actionText="My Orders" actionLink="/orders" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/orders" className="text-blue-600 hover:underline mb-6 inline-block">← Back to Orders</Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order {order.orderNumber}</h1>
            <p className="text-gray-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize text-white ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Status Tracker */}
        {order.status !== 'cancelled' && (
          <div className="mb-8">
            <div className="flex items-center">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex text-xs mt-2">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex-1 text-center capitalize">{step}</div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Items</h3>
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b dark:border-gray-700">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏗️</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500">{item.quantity}x @ Rp {item.price?.toLocaleString()}</p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
          <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress?.name} | {order.shippingAddress?.phone}</p>
          <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
        </div>

        {/* Total */}
        <div className="border-t dark:border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span><span>Rp {order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span><span>Rp {order.shippingCost?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
            <span>Total</span><span className="text-blue-600">Rp {order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;