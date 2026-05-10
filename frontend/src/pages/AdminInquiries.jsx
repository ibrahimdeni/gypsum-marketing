import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const { data } = await axios.get(`/api/inquiries${params}`, config);
      setInquiries(data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/inquiries/${id}`, { status: newStatus }, config);
      Toast.success('Status updated!');
      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      Toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await axios.delete(`/api/inquiries/${id}`, config);
        Toast.success('Inquiry deleted');
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
        fetchInquiries();
      } catch (error) {
        Toast.error('Failed to delete');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      qualified: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return badges[status] || badges.new;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition">← {t('nav_dashboard')}</Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-xl font-bold">📧 Inquiries</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white transition">{t('view_site')}</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'new', 'contacted', 'qualified', 'converted', 'closed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
              {statusFilter === status && inquiries.length > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{inquiries.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl text-gray-400">No inquiries found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                      onClick={() => setSelectedInquiry(inq)}>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(inq.createdAt)}</td>
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{inq.name}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{inq.email}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{inq.subject}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(inq.status)}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                          <select
                            value={inq.status}
                            onChange={e => handleStatusChange(inq._id, e.target.value)}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(inq._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInquiry(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedInquiry.subject}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
                <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedInquiry.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedInquiry.company || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Message</p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status</p>
                  <select
                    value={selectedInquiry.status}
                    onChange={e => handleStatusChange(selectedInquiry._id, e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;