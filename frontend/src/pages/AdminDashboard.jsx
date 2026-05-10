import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';
import { getImageUrl } from '../utils/baseUrl';


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', category: 'gypsum-board', description: '',
    shortDescription: '', stock: '', isFeatured: false, slug: '', images: []
  });
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.data || []);
    } catch (error) { console.error('Error fetching products:', error); }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // ✅ Validasi jumlah
    if (form.images.length + files.length > 12) {
      Toast.warning('Maksimal 12 gambar per produk! 📸');
      return;
    }

    // ✅ Validasi tiap file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        Toast.error(`File "${file.name}" terlalu besar! Maks 5MB 📦`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        Toast.error(`File "${file.name}" format tidak didukung! 🖼️`);
        return;
      }
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const { data } = await axios.post('/api/upload/multiple', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      const newImages = data.data.map(img => ({
        url: `${getImageUrl(img.url)}`,
        alt: img.filename
      }));
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      Toast.uploadSuccess(files.length);
    } catch (error) {
      Toast.uploadError();
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing) {
        await axios.put(`/api/products/${editing}`, payload, config);
        Toast.productUpdated();
      } else {
        await axios.post('/api/products', payload, config);
        Toast.productCreated();
      }
      setEditing(null);
      setForm({ name: '', price: '', category: 'gypsum-board', description: '', shortDescription: '', stock: '', isFeatured: false, slug: '', images: [] });
      fetchProducts();
    } catch (error) { Toast.error('Failed to save product'); }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name, price: product.price, category: product.category,
      description: product.description || '', shortDescription: product.shortDescription || '',
      stock: product.stock || 0, isFeatured: product.isFeatured || false,
      slug: product.slug || '', images: product.images || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await axios.delete(`/api/products/${id}`, config);
        Toast.productDeleted();
        fetchProducts();
      } catch (error) { Toast.error('Failed to delete'); }
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition">← {t('view_site')}</Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-xl font-bold">🛠️ {t('admin_dashboard')}</h1>
            <span className="text-gray-600">|</span>
            <Link to="/admin/inventory" className="text-green-400 hover:text-green-300 transition">📦 {t('nav_inventory')}</Link>
            <Link to="/admin/chat" className="text-yellow-400 hover:text-yellow-300 transition">💬 {t('nav_chat')}</Link>
            <Link to="/admin/inquiries" className="text-yellow-400 hover:text-yellow-300 transition">📧 Inquiries</Link>
            <Link to="/admin/reviews" className="text-yellow-400 hover:text-yellow-300">⭐ Reviews</Link>
            <Link to="/admin/analytics" className="text-pink-400 hover:text-pink-300">📊 Analytics</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white transition">{t('view_site')}</Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">{t('nav_logout')}</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-gray-900/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{editing ? t('admin_edit_product') : t('admin_add_product')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_product_name')} *</label>
                <input type="text" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_price')} *</label>
                <input type="number" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_category')}</label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="gypsum-board">{t('products_category_board')}</option>
                  <option value="gypsum-powder">{t('products_category_powder')}</option>
                  <option value="ceiling-tiles">{t('products_category_ceiling')}</option>
                  <option value="cornice">{t('products_category_cornice')}</option>
                  <option value="compound">{t('products_category_compound')}</option>
                  <option value="accessories">{t('products_category_accessories')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_stock')}</label>
                <input type="number" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_short_desc')}</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ {t('admin_featured')}</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('admin_images')} ({form.images.length}/12)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 group">
                    <img src={getImageUrl(img.url)} alt={img.alt || 'Product'} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-bl-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                    <span className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-0.5 rounded-tr-lg">{index + 1}</span>
                  </div>
                ))}
                {form.images.length < 12 && (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                    <span className="text-2xl text-gray-400">📷</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{uploading ? '...' : t('admin_upload')}</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{t('admin_description')} *</label>
              <textarea required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows="3"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                {editing ? `✅ ${t('admin_update')}` : `➕ ${t('admin_create')}`}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', category: 'gypsum-board', description: '', shortDescription: '', stock: '', isFeatured: false, slug: '', images: [] }); }}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium">{t('admin_cancel')}</button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Image</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_product_name')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_category')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_price')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_stock')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_featured')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">{t('admin_no_products')}</td></tr>
                ) : (
                  products.map(p => (
                    <tr key={p._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="p-4">
                        {p.images && p.images.length > 0 ? (
                          <img src={getImageUrl(p.images[0]?.url)} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-lg">🏗️</div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{p.name}</td>
                      <td className="p-4"><span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">{p.category?.replace('-', ' ')}</span></td>
                      <td className="p-4 font-semibold text-green-600 dark:text-green-400">Rp {p.price?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${p.stock > 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          p.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>{p.stock || 0} units</span>
                      </td>
                      <td className="p-4 text-xl">{p.isFeatured ? '⭐' : '−'}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">{t('admin_edit')}</button>
                          <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">{t('admin_delete')}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;