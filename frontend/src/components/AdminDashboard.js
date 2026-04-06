import React, { useState } from 'react';
import { useAuth } from '../App';

function Navbar({ cartCount }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Collections', path: '/collections' },
        { name: 'Brands', path: '/brands' },
        { name: 'Sale', path: '/sale' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            window.location.href = `/products?search=${searchQuery}`;
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">

                {/* Logo */}
                <div
                    className="nav-logo"
                    onClick={() => (window.location.href = '/')}
                >
                    LUXE
                </div>

                {/* Navigation Links */}
                <ul className="nav-links">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a href={link.path} className="nav-link">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="nav-actions">

                    {/* Search */}
                    <form className="nav-search" onSubmit={handleSearch}>
                        <button type="submit" className="search-icon">
                            🔍
                        </button>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Cart */}
                    <button
                        className="nav-icon-btn"
                        onClick={() => (window.location.href = '/cart')}
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </button>

                    {/* Notifications */}
                    <button className="nav-icon-btn">🔔</button>

                    {/* User Menu */}
                    <div className="nav-user-menu">
                        <button className="nav-avatar">
                            {user?.fullName?.charAt(0) || 'U'}
                        </button>

                        <div className="user-dropdown">
                            <a href="/orders">My Orders</a>
                            <a href="/wishlist">Wishlist</a>

                            {user?.role === 'ADMIN' && (
                                <a href="/admin">Admin Panel</a>
                            )}

                            <hr />

                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;