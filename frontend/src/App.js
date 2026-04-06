import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Axios instance with interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });
                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Components
import Login from './components/Login';
import Register from './components/Register';
import OTPVerification from './components/OTPVerification';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Products from './components/Products';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.sub,
                    fullName: localStorage.getItem('userName'),
                    role: decoded.role
                });
            } catch (e) {
                console.error('Invalid token');
            }
        }
        setTimeout(() => setLoading(false), 1000);
    }, []);

    // Cart functions
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success(`${product.name} added to cart`);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setCart([]);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout, api }}>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <div className="app">
                {user && <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />}
                
                {/* Simple routing */}
                {!user ? (
                    <Routes />
                ) : (
                    <>
                        {window.location.pathname === '/admin' && user.role === 'ADMIN' ? (
                            <AdminDashboard />
                        ) : window.location.pathname === '/products' ? (
                            <Products addToCart={addToCart} />
                        ) : window.location.pathname === '/cart' ? (
                            <Cart
                                cart={cart}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                                clearCart={clearCart}
                                getCartTotal={getCartTotal}
                            />
                        ) : window.location.pathname === '/orders' ? (
                            <Orders />
                        ) : (
                            <Dashboard addToCart={addToCart} />
                        )}
                    </>
                )}
            </div>
        </AuthContext.Provider>
    );
}

// Simple routing without react-router-dom
function Routes() {
    const [currentPage, setCurrentPage] = useState('login');
    
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path === '/login') setCurrentPage('login');
            else if (path === '/register') setCurrentPage('register');
            else if (path === '/otp') setCurrentPage('otp');
            else if (path === '/forgot') setCurrentPage('forgot');
            else setCurrentPage('login');
        };
        handlePopState();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (page, path) => {
        setCurrentPage(page);
        window.history.pushState({}, '', path);
    };

    switch (currentPage) {
        case 'register':
            return <Register navigate={navigate} />;
        case 'otp':
            return <OTPVerification navigate={navigate} />;
        case 'forgot':
            return <ForgotPassword navigate={navigate} />;
        default:
            return <Login navigate={navigate} />;
    }
}

function Loader() {
    return (
        <div className="loader">
            <div className="loader-content">
                <div className="loader-logo">LUXE</div>
                <div className="loader-spinner"></div>
                <div className="loader-text">Experience Luxury Shopping</div>
            </div>
        </div>
    );
}

export default App;