import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Toast from '../utils/toast';
import api from '../utils/axios';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [shipping, setShipping] = useState({
        name: user?.name || '', phone: '', address: '', city: '', postalCode: '', notes: ''
    });

    if (!isAuthenticated) return navigate('/login');
    if (cart.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <span className="text-6xl">🛒</span>
                <h1 className="text-3xl font-bold mt-4 mb-4">Cart is Empty</h1>
                <Link to="/products" className="text-blue-600 hover:underline">Browse Products</Link>
            </div>
        );
    }

    const shippingCost = 25000;
    const total = cartTotal + shippingCost;

    const handleCheckout = async () => {
        if (!shipping.phone || !shipping.address || !shipping.city) {
            Toast.error('Please fill all required fields!');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/api/orders', {
                shippingAddress: shipping,
                paymentMethod: 'midtrans'
            });
            clearCart();
            navigate(`/orders/${data.data.order._id}`);
        } catch (error) {
            Toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

            {/* Steps */}
            <div className="flex mb-8">
                {['Cart', 'Shipping', 'Payment'].map((s, i) => (
                    <div key={i} className={`flex-1 text-center pb-2 border-b-2 text-sm font-medium ${step >= i + 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'
                        }`}>{s}</div>
                ))}
            </div>

            {step === 1 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Review Order</h2>
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between py-3 border-b dark:border-gray-700">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                    <div className="flex justify-between mt-4 pt-4 text-lg font-bold text-gray-900 dark:text-white">
                        <span>Subtotal</span>
                        <span>Rp {cartTotal.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                        Continue to Shipping
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Full Name *</label>
                                <input type="text" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Phone *</label>
                                <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Address *</label>
                            <textarea value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} rows="3"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">City *</label>
                                <input type="text" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Postal Code *</label>
                                <input type="text" value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg dark:border-gray-600">Back</button>
                        <button onClick={() => setStep(3)} className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                            Continue to Payment
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Confirm & Pay</h2>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900 dark:text-white font-medium">Rp {cartTotal.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-900 dark:text-white font-medium">Rp {shippingCost.toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700"><span>Total</span><span className="text-blue-600">Rp {total.toLocaleString()}</span></div>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">You will be redirected to payment page. QRIS, Bank Transfer, E-Wallet available.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="px-6 py-3 border rounded-lg dark:border-gray-600">Back</button>
                        <button onClick={handleCheckout} disabled={loading}
                            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50">
                            {loading ? 'Processing...' : 'Pay Now - Rp ' + total.toLocaleString()}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;