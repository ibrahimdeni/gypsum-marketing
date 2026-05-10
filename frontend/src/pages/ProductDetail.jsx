import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ImageSlider from '../components/ImageSlider';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(data.data);
        } catch (error) { console.error('Error fetching product:', error); }
    };

    const handleAddToCart = () => { addToCart(product, quantity); alert(t('success')); };

    const getWhatsAppLink = () => {
        const message = `Halo GypsumPro! Saya tertarik dengan produk ${product.name}. Bisa info lebih lanjut?`;
        return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    };

    if (!product) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">{t('loading')}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 dark:bg-gray-950">
            <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">{t('detail_back')}</Link>

            <div className="grid md:grid-cols-2 gap-12">
                <ImageSlider images={product.images} productName={product.name} />

                <div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm mb-4 inline-block">
                        {product.category?.replace('-', ' ')}
                    </span>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        {product.discountPrice ? (
                            <>
                                <span className="text-3xl font-bold text-red-600">Rp {product.discountPrice.toLocaleString()}</span>
                                <span className="text-xl text-gray-400 line-through">Rp {product.price.toLocaleString()}</span>
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 px-3 py-1 rounded-full text-sm">SALE</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">Rp {product.price?.toLocaleString()}</span>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{product.description}</p>

                    <div className="mb-6">
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            product.stock > 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                            {t('detail_stock')}: {product.stock || 0} {t('detail_units')}
                        </span>
                    </div>

                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{t('detail_specifications')}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    value && <div key={key} className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400 capitalize">{key}:</span>{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl text-gray-700 dark:text-gray-300">-</button>
                            <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl text-gray-700 dark:text-gray-300">+</button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {isAuthenticated ? (
                            <>
                                <button onClick={handleAddToCart} disabled={product.stock === 0}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400">
                                    {t('detail_add_cart')}
                                </button>
                                <button onClick={() => addToWishlist(product)}
                                    className={`px-8 py-3 border-2 rounded-lg transition font-semibold ${
                                        isInWishlist(product._id) ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-500' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
                                    }`}>
                                    {isInWishlist(product._id) ? t('detail_in_wishlist') : t('detail_add_wishlist')}
                                </button>
                                <Link to={`/chat?product=${product._id}`}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                                    {t('detail_chat_product')}
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold text-center">
                                {t('detail_login_required')}
                            </Link>
                        )}
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
                            {t('detail_chat_wa')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;