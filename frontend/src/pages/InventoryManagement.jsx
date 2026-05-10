import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('in');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { if (!token) return navigate('/login'); fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [prodRes, invRes, sumRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/inventory', config),
        axios.get('/api/inventory/summary', config)
      ]);
      setProducts(prodRes.data.data);
      setInventoryLogs(invRes.data.data);
      setSummary(sumRes.data.data);
    } catch (error) { console.error('Error fetching data:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return alert('Fill all fields');
    try {
      const endpoint = type === 'in' ? '/api/inventory/add' : '/api/inventory/reduce';
      await axios.post(`${endpoint}`, { productId: selectedProduct, quantity: Number(quantity), notes }, config);
      Toast.stockUpdated();
      setSelectedProduct(''); setQuantity(''); setNotes('');
      fetchData();
    } catch (error) { Toast.error(error.response?.data?.message || 'Failed to update stock'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition">← {t('nav_dashboard')}</Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-xl font-bold">📦 {t('inventory_title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white transition">{t('view_site')}</Link>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">{t('nav_logout')}</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('inventory_total_products')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalProducts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('inventory_total_stock')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalStock}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl shadow">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">{t('inventory_low_stock')}</p>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{summary.lowStock}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow">
              <p className="text-red-600 dark:text-red-400 text-sm">{t('inventory_out_stock')}</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-400">{summary.outOfStock}</p>
            </div>
          </div>
        )}

        {/* Update Stock Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('inventory_update_stock')}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4">
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{t('inventory_select_product')}</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
              ))}
            </select>
            <select value={type} onChange={e => setType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="in">{t('inventory_stock_in')} (+)</option>
              <option value="out">{t('inventory_stock_out')} (-)</option>
            </select>
            <input type="number" placeholder={t('inventory_quantity')} required value={quantity} onChange={e => setQuantity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input type="text" placeholder={t('inventory_notes')} value={notes} onChange={e => setNotes(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('inventory_update')}</button>
          </form>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900/50 overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{t('inventory_recent')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('inventory_date')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_product_name')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('inventory_type')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('inventory_quantity')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('inventory_notes')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('inventory_by')}</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.map(log => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 text-gray-900 dark:text-white text-sm">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{log.product?.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        log.type === 'in' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {log.type === 'in' ? t('inventory_stock_in') : t('inventory_stock_out')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{log.quantity}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{log.notes}</td>
                    <td className="p-4 text-gray-900 dark:text-white">{log.createdBy}</td>
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

export default InventoryManagement;