import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';

function Dashboard({ addToCart }) {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories] = useState(['All', 'Shoes', 'Clothing', 'Watches', 'Bags', 'Electronics']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const { api } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/public/featured');
            setFeaturedProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback mock data
            setFeaturedProducts([
                { id: 1, name: 'Apex Runner Pro', brand: 'NIKE', price: 8999, oldPrice: 12999, emoji: '👟', rating: 4.8, reviewCount: 124, category: 'Shoes' },
                { id: 2, name: 'Silk Touch Hoodie', brand: 'ZARA', price: 3499, emoji: '🧥', rating: 4.5, reviewCount: 89, category: 'Clothing' },
                { id: 3, name: 'Chrono Elite Watch', brand: 'FOSSIL', price: 14999, oldPrice: 22000, emoji: '⌚', rating: 4.9, reviewCount: 256, category: 'Watches' },
                { id: 4, name: 'Velvet Tote Bag', brand: 'GUCCI', price: 45000, emoji: '👜', rating: 5.0, reviewCount: 43, category: 'Bags' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = activeCategory === 'All'
        ? featuredProducts
        : featuredProducts.filter(p => p.category === activeCategory);

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        New Season Arrivals
                    </div>
                    <h1 className="hero-title">
                        Define<br />
                        Your <em>Style</em>
                    </h1>
                    <p className="hero-description">
                        Discover curated fashion from the world's most coveted brands.
                        Luxury meets accessibility at LUXE.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary">Shop Now →</button>
                        <button className="btn btn-outline">View Collections</button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-floating-emoji">👟</div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <div className="section-eyebrow">Curated For You</div>
                            <h2 className="section-title">Featured <em>Products</em></h2>
                        </div>
                        <button className="section-link">View All →</button>
                    </div>

                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading products...</div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Banner */}
            <div className="promo-banner">
                <div className="promo-content">
                    <div className="promo-badge">Limited Time Offer</div>
                    <h3 className="promo-title">Up to <em>50% Off</em></h3>
                    <p className="promo-description">
                        Shop our biggest sale of the year. Premium brands at unbeatable prices.
                    </p>
                    <button className="btn btn-primary">Shop Sale →</button>
                </div>
                <div className="promo-emoji">⌚</div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">LUXE</div>
                        <p>Premium e-commerce bringing luxury brands to your doorstep.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Shop</h4>
                        <ul>
                            <li>New Arrivals</li>
                            <li>Best Sellers</li>
                            <li>Sale</li>
                            <li>Brands</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li>Contact Us</li>
                            <li>FAQs</li>
                            <li>Returns</li>
                            <li>Track Order</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Press</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2025 LUXE. All rights reserved.</span>
                    <span>Privacy · Terms · Cookies</span>
                </div>
            </footer>
        </>
    );
}

export default Dashboard;