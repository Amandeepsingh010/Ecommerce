import React, { useState } from 'react';

function ProductCard({ product, addToCart }) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '½'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <div className="product-card">
            <div className="product-image">
                {product.badge && (
                    <span className={`product-badge badge-${product.badge.toLowerCase()}`}>
                        {product.badge}
                    </span>
                )}
                <button 
                    className="product-wishlist"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    style={{ color: isWishlisted ? '#DC3545' : 'white' }}
                >
                    {isWishlisted ? '♥' : '♡'}
                </button>
                <span className="product-emoji">{product.emoji}</span>
            </div>
            <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span className="review-count">({product.reviewCount})</span>
                </div>
                <div className="product-footer">
                    <div>
                        <span className="product-price">₹{product.price.toLocaleString()}</span>
                        {product.oldPrice && (
                            <span className="product-old-price">₹{product.oldPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;