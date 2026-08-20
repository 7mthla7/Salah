import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addToCart = useStore(s => s.addToCart);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  function handleAddToCart(e) {
    e.preventDefault();
    if (product.stock === 0) return;
    const ok = addToCart(product.id);
    if (ok) toast.success('Added to cart!');
    else toast.error('Could not add to cart.');
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-img-wrap">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="product-card-badge">-{discountPct}%</span>
        )}
        {product.stock === 0 && (
          <div className="product-card-oos">Out of Stock</div>
        )}
      </Link>
      <div className="product-card-body">
        <span className="product-card-cat">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-card-name">{product.name}</Link>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="product-card-footer">
          <div className="product-card-price">
            {hasDiscount ? (
              <>
                <span className="price">${product.discountPrice.toFixed(2)}</span>
                <span className="price-original">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="price">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="product-card-actions">
            <Link to={`/products/${product.id}`} className="btn btn-ghost btn-sm btn-icon" title="View Details">
              <Eye size={16} />
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={14} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
