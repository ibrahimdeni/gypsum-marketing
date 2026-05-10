import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Toast from '../utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      Toast.loginSuccess(user.name);
      
      // ✅ REDIRECT SETELAH LOGIN BERHASIL
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      Toast.loginError();
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">{t('login_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('login_subtitle')}</p>
        </div>

        {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('login_email')}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('login_password')}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg disabled:opacity-50">
            {loading ? t('loading') : t('login_button')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t('login_no_account')}{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">{t('login_signup')}</Link>
        </p>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">{t('login_back')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;