import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import Toast from '../utils/toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validasi di frontend dulu
    if (form.message.length < 10) {
      Toast.error('Pesan minimal 10 karakter ya! ✏️');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/inquiries', form);
      Toast.contactSent();
      setSent(true);
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || '';

      // ✅ Translate error ke bahasa user-friendly
      if (errorMsg.includes('message')) {
        Toast.error('Pesan terlalu pendek. Minimal 10 karakter ya! ✏️');
      } else if (errorMsg.includes('email')) {
        Toast.error('Format email tidak valid 📧');
      } else if (errorMsg.includes('phone')) {
        Toast.error('Nomor telepon wajib diisi 📱');
      } else if (errorMsg.includes('name')) {
        Toast.error('Nama wajib diisi 👤');
      } else {
        Toast.contactError();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-950">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t('contact_title')}</h1>
        <p className="text-xl text-white/90">{t('contact_subtitle')}</p>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-8 lg:p-12">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-green-600 dark:text-green-400 text-xl">{t('contact_success')}</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {t('contact_send')} lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_name')} *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_email')} *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_phone')} *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_company')}</label>
                    <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_subject')} *</label>
                  <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact_message')} *</label>
                  <textarea rows="6" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                  {loading ? t('loading') : t('contact_send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;