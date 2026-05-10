import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../utils/toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/auth/users', config);
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/auth/users/${userId}`, { role: newRole }, config);
      Toast.success('Role updated!');
      fetchUsers();
    } catch (error) {
      Toast.error('Failed to update role');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await axios.put(`/api/auth/users/${userId}`, { isActive: !isActive }, config);
      Toast.success(isActive ? 'User disabled' : 'User enabled');
      fetchUsers();
    } catch (error) {
      Toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Delete this user? This cannot be undone!')) {
      try {
        await axios.delete(`/api/auth/users/${userId}`, config);
        Toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        Toast.error('Failed to delete user');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition">← Dashboard</Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-xl font-bold">👥 User Management</h1>
          </div>
          <Link to="/" className="text-gray-300 hover:text-white transition">View Site</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold">
                            {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                      <td className="p-4">
                        <button onClick={() => handleDelete(u._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;