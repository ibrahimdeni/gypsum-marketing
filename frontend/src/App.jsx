import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Skeleton loaders untuk fallback
import { DetailSkeleton, ProductGridSkeleton } from './components/SkeletonLoader';

// Eager load (yang langsung diakses)
import Layout from './components/Layout';

// Lazy load semua halaman
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const InventoryManagement = lazy(() => import('./pages/InventoryManagement'));
const AdminChat = lazy(() => import('./pages/AdminChat'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminInquiries = lazy(() => import('./pages/AdminInquiries'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const Checkout = lazy(() => import('./pages/Checkout'));
// const Payment = lazy(() => import('./pages/Payment'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));

// Page Loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <HelmetProvider>
          <LanguageProvider>
            <AuthProvider>
              <ChatProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Router>
                      <ScrollToTop />
                      <Toaster
                        position="top-right"
                        reverseOrder={false}
                        gutter={8}
                        toastOptions={{ duration: 3000 }}
                      />
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="products" element={
                              <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20"><ProductGridSkeleton count={6} /></div>}>
                                <Products />
                              </Suspense>
                            } />
                            <Route path="products/:id" element={
                              <Suspense fallback={<DetailSkeleton />}>
                                <ProductDetail />
                              </Suspense>
                            } />
                            <Route path="contact" element={<Contact />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="checkout" element={<Checkout />} />
                            {/* <Route path="payment" element={<Payment />} /> */}
                            <Route path="orders" element={<MyOrders />} />
                            <Route path="orders/:id" element={<OrderDetail />} />
                          </Route>
                          <Route path="/chat" element={
                            <Suspense fallback={<PageLoader />}>
                              <Chat />
                            </Suspense>
                          } />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/admin/dashboard" element={<AdminDashboard />} />
                          <Route path="/admin/inventory" element={<InventoryManagement />} />
                          <Route path="/admin/chat" element={<AdminChat />} />
                          <Route path="/admin/users" element={<AdminUsers />} />
                          <Route path="/admin/inquiries" element={<AdminInquiries />} />
                          <Route path="/admin/reviews" element={<AdminReviews />} />
                          <Route path="/admin/orders" element={<AdminOrders />} />
                          <Route path="/admin/analytics" element={<AdminAnalytics />} />
                        </Routes>
                      </Suspense>
                    </Router>
                  </WishlistProvider>
                </CartProvider>
              </ChatProvider>
            </AuthProvider>
          </LanguageProvider>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;