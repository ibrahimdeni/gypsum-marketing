import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import Toast from '../utils/toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchData();
  }, [filterProduct]);

  const fetchData = async () => {
    try {
      const [reviewRes, prodRes] = await Promise.all([
        axios.get(`/api/reviews/admin/all${filterProduct ? `?productId=${filterProduct}` : ''}`, config),
        axios.get('/api/products')
      ]);
      setReviews(reviewRes.data.data || []);
      setStats(reviewRes.data.stats);
      setProducts(prodRes.data.data || []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleToggle = async (reviewId) => {
    try {
      await axios.put(`/api/reviews/admin/${reviewId}/toggle`, {}, config);
      Toast.success('Review status updated');
      fetchData();
    } catch (error) { Toast.error('Failed'); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await axios.delete(`/api/reviews/${reviewId}`, config);
      Toast.success('Review deleted');
      fetchData();
    } catch (error) { Toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</Link>
            <h1 className="text-xl font-bold">⭐ Reviews Management</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReviews}</p>
              <p className="text-xs text-gray-500">Total Reviews</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
              <p className="text-2xl font-bold text-yellow-500">⭐ {stats.avgRating?.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </div>
            {[5,4,3,2,1].map(star => (
              <div key={star} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-center">
                <p className="text-lg font-bold text-yellow-500">{'★'.repeat(star)}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.distribution[star] || 0}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">All Products</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm">User</th>
                  <th className="p-4 text-left text-sm">Product</th>
                  <th className="p-4 text-left text-sm">Rating</th>
                  <th className="p-4 text-left text-sm">Comment</th>
                  <th className="p-4 text-left text-sm">Date</th>
                  <th className="p-4 text-left text-sm">Status</th>
                  <th className="p-4 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r._id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4 text-sm">{r.user?.name}</td>
                    <td className="p-4 text-sm max-w-[150px] truncate">{r.product?.name}</td>
                    <td className="p-4"><StarRating rating={r.rating} interactive={false} size="sm" showValue={false} /></td>
                    <td className="p-4 text-sm max-w-[200px] truncate">{r.comment}</td>
                    <td className="p-4 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => handleToggle(r._id)}
                        className={`px-3 py-1 rounded-full text-xs ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                    </td>
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

export default AdminReviews;