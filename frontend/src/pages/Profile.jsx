import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';

const Profile = () => {
    const { user, checkAuth } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', avatar: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        if (!user) return navigate('/login');
        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            avatar: user.avatar || ''
        });
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('/api/auth/profile', form, config);
            await checkAuth();
            Toast.success('Profile updated!');
        } catch (error) {
            Toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return Toast.error('Passwords do not match!');
        }
        if (passwordForm.newPassword.length < 6) {
            return Toast.error('Password must be at least 6 characters');
        }
        setPassLoading(true);
        try {
            await axios.put('/api/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, config);
            Toast.success('Password changed!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (error) {
            Toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setPassLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ✅ Validasi ukuran (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Toast.error('Ukuran file terlalu besar! Maksimal 5MB 📦');
            return;
        }

        // ✅ Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            Toast.error('Format tidak didukung! Gunakan JPG, PNG, GIF, atau WebP 🖼️');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const { data } = await axios.post('/api/upload/single', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                maxContentLength: 5 * 1024 * 1024, // 5MB limit
            });

            const avatarUrl = `${data.data.url}`;
            setForm(prev => ({ ...prev, avatar: avatarUrl }));

            // Update profile dengan avatar baru
            await axios.put('/api/auth/profile', { avatar: avatarUrl }, config);
            await checkAuth(); // Refresh user data
            Toast.success('Foto profil berhasil diupdate! 📷');
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            if (errMsg.includes('large') || errMsg.includes('size')) {
                Toast.error('File terlalu besar! Maksimal 5MB 📦');
            } else if (errMsg.includes('format') || errMsg.includes('type')) {
                Toast.error('Format file tidak didukung 🖼️');
            } else {
                Toast.error('Gagal upload gambar. Coba lagi! ❌');
            }
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 dark:bg-gray-950">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">👤 My Profile</h1>

            {/* Avatar Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mb-8 text-center">
                <div className="relative inline-block cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 mx-auto">
                        {form.avatar ? (
                            <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white dark:border-gray-800">
                        📷
                    </div>
                    {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">...</div>}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <p className="text-sm text-gray-500 mt-3">Click to change photo</p>
                <p className="text-xs text-gray-400 mt-1">Max 5MB, jpg/png/gif</p>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Password</h2>
                    <button onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                            <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <button type="submit" disabled={passLoading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
                            {passLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;