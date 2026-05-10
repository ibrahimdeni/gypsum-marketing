import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const token = searchParams.get('token');

  useEffect(() => {
    // Kalau gak ada token, redirect ke order detail
    if (!token || token === 'null') {
      navigate(`/orders/${data.data.order._id}`);
      return;
    }

    // Load Midtrans Snap
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.onload = () => {
      window.snap.pay(token, {
        onSuccess: () => window.location.href = `/orders/${orderId}`,
        onPending: () => window.location.href = `/orders/${orderId}`,
        onError: () => alert('Payment failed!'),
        onClose: () => window.location.href = `/orders/${orderId}`,
      });
    };
    script.onerror = () => {
      navigate(`/orders/${orderId}`, { replace: true });
    };
    document.body.appendChild(script);
  }, [token, orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting to your order...</p>
      </div>
    </div>
  );
};

export default Payment;