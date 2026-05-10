import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ImageSlider from '../components/ImageSlider';
import StarRating from '../components/StarRating';
import Toast from '../utils/toast';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/baseUrl';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', images: [] });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewSort, setReviewSort] = useState('-createdAt');
    const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specifications' | 'reviews'

    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated, user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data.data);
        } catch (error) { console.error('Error fetching product:', error); }
    };

    useEffect(() => {
        if (product) fetchReviews();
    }, [product, reviewSort]);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/reviews/product/${id}?sort=${reviewSort}`);
            setReviews(data.data || []);
            if (user) {
                const myReview = data.data.find(r => r.user._id === user._id);
                setUserReview(myReview || null);
            }
        } catch (error) { console.error('Error fetching reviews:', error); }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) { Toast.loginRequired(); return; }
        const result = await addToCart(product, quantity);
        if (result) Toast.cartAdded(product.name);
        else Toast.error('Failed to add to cart');
    };

    const handleWishlist = async () => {
        if (!isAuthenticated) { Toast.loginRequired(); return; }
        const wasInWishlist = isInWishlist(product._id);
        const result = await addToWishlist(product);
        if (result) {
            if (!wasInWishlist) Toast.wishlistAdded(product.name);
            else Toast.wishlistRemoved();
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { Toast.loginRequired(); return; }
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (userReview) {
                await axios.put(`/api/reviews/${userReview._id}`, reviewForm, config);
                Toast.success('Review updated!');
            } else {
                await axios.post(`/api/reviews/product/${id}`, reviewForm, config);
                Toast.success('Review submitted! ⭐');
            }
            setShowReviewForm(false);
            setReviewForm({ rating: 5, comment: '', images: [] });
            fetchReviews();
        } catch (error) {
            Toast.error(error.response?.data?.message || 'Failed');
        }
    };

    const handleDeleteReview = async () => {
        if (!window.confirm('Delete your review?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/reviews/${userReview._id}`, { headers: { Authorization: `Bearer ${token}` } });
            Toast.success('Review deleted');
            setUserReview(null);
            fetchReviews();
        } catch (error) { Toast.error('Failed'); }
    };

    const getWhatsAppLink = () => {
        const message = `Halo! Saya tertarik dengan produk *${product?.name}*. Bisa info lebih lanjut?`;
        return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    };

    if (!product) return (
        <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">{t('loading')}</p>
        </div>
    );

    return (
        <>
            <SEO
                title={`${product.name} - GypsumPro`}
                description={product.description?.slice(0, 160)}
                keywords={`${product.name}, ${product.category}, gypsum, gypsumpro`}
                image={product.images?.[0]?.url}
                url={`/products/${product._id}`}
                type="product"
                product={product}
            />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block text-sm">
                    ← {t('detail_back')}
                </Link>

                {/* ===== TOP SECTION: Image + Info ===== */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* Left: Image Slider */}
                    <div className="md:sticky md:top-20 md:self-start">
                        <ImageSlider images={product.images} productName={product.name} />
                    </div>

                    {/* Right: Product Info - Sticky */}
                    <div className="md:sticky md:top-20 md:self-start">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium mb-3 inline-block">
                            {product.category?.replace('-', ' ')}
                        </span>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900 dark:text-white">{product.name}</h1>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={product.rating || 0} interactive={false} size="sm" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({product.numReviews || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            {product.discountPrice ? (
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-3xl font-bold text-red-600">Rp {product.discountPrice.toLocaleString()}</span>
                                    <span className="text-lg text-gray-400 line-through">Rp {product.price.toLocaleString()}</span>
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 px-3 py-1 rounded-full text-xs font-medium">SALE</span>
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">Rp {product.price?.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                            {product.shortDescription || product.description?.slice(0, 150)}...
                        </p>

                        {/* Stock */}
                        <div className="mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${product.stock > 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${product.stock > 50 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-5">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">−</button>
                                <span className="px-5 py-2 font-semibold text-gray-900 dark:text-white text-sm">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">+</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2.5 mb-6">
                            <button onClick={handleAddToCart} disabled={product.stock === 0}
                                className="flex-1 min-w-[140px] px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                                🛒 Add to Cart
                            </button>
                            <button onClick={handleWishlist}
                                className={`px-4 py-3 rounded-xl border-2 transition font-semibold text-sm ${isInWishlist(product._id)
                                    ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-500'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                                    }`}>
                                {isInWishlist(product._id) ? '❤️' : '🤍'}
                            </button>
                            <Link to={`/chat?product=${product._id}`}
                                className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-sm">
                                💬 Chat
                            </Link>
                        </div>
                        <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                            className="block w-full text-center px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-semibold text-sm mb-4">
                            💬 Order via WhatsApp
                        </a>
                    </div>
                </div>

                {/* ===== BOTTOM SECTION: Tabs (Description | Specs | Reviews) ===== */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 gap-0">
                        {['description', 'specifications', 'reviews'].map(tab => (
                            <button key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-medium transition border-b-2 -mb-[2px] ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}>
                                {tab === 'description' && '📝 Description'}
                                {tab === 'specifications' && '📋 Specifications'}
                                {tab === 'reviews' && `⭐ Reviews (${product.numReviews || 0})`}
                            </button>
                        ))}
                    </div>

                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === 'specifications' && (
                        <div>
                            {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No specifications available.</p>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div>
                            {/* Review Header */}
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-gray-900 dark:text-white">{product.rating?.toFixed(1) || '0'}</p>
                                        <StarRating rating={product.rating || 0} interactive={false} size="sm" showValue={false} />
                                        <p className="text-xs text-gray-500 mt-1">{product.numReviews || 0} reviews</p>
                                    </div>
                                    {/* Rating Bars */}
                                    <div className="space-y-1 hidden sm:block">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviews.filter(r => r.rating === star).length;
                                            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2 text-xs">
                                                    <span className="w-3 text-gray-500">{star}</span>
                                                    <span className="text-yellow-400">★</span>
                                                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                    <span className="text-gray-400 w-6">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select value={reviewSort} onChange={e => setReviewSort(e.target.value)}
                                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <option value="-createdAt">Newest</option>
                                        <option value="createdAt">Oldest</option>
                                        <option value="-rating">Highest Rated</option>
                                        <option value="rating">Lowest Rated</option>
                                    </select>
                                    {isAuthenticated && (
                                        <button onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                            {userReview ? '✏️ Edit' : '⭐ Write Review'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Review Form */}
                            {showReviewForm && (
                                <form onSubmit={handleSubmitReview} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        {userReview ? 'Edit Your Review' : 'Write a Review'}
                                    </h3>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                        <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} size="lg" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
                                        <textarea rows="4" required minLength={3} maxLength={500} value={reviewForm.comment}
                                            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            placeholder="Share your experience with this product..."
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                        <p className="text-xs text-gray-400 mt-1">{reviewForm.comment.length}/500</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                                            {userReview ? 'Update Review' : 'Submit Review'}
                                        </button>
                                        <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm">
                                            Cancel
                                        </button>
                                        {userReview && (
                                            <button type="button" onClick={handleDeleteReview} className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm ml-auto">
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-5xl mb-4">⭐</p>
                                        <p className="text-gray-400 text-lg">No reviews yet. Be the first to review!</p>
                                    </div>
                                ) : (
                                    reviews.map(review => (
                                        <div key={review._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                        {review.user?.avatar ? <img src={review.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : review.user?.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.user?.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} interactive={false} size="sm" showValue={false} />
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                            {review.updatedAt !== review.createdAt && (
                                                <p className="text-[10px] text-gray-400 mt-2 italic">(edited)</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;