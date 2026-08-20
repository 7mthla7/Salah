import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart, Star, Truck, Shield,
  RefreshCw, Share2, CheckCircle, AlertCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const products = useStore(s => s.products);
  const addToCart = useStore(s => s.addToCart);
  const [qty, setQty] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px' }}>
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Product Not Found</h3>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  function handleAddToCart() {
    if (product.stock === 0) return;
    const ok = addToCart(product.id, qty);
    if (ok) toast.success(`${product.name} added to cart!`);
    else toast.error('Failed to add to cart.');
  }

  return (
    <div className="product-detail page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="detail-layout">
          {/* Image */}
          <div className="detail-image-wrap">
            <img
              src={product.image || 'https://via.placeholder.com/600x500?text=No+Image'}
              alt={product.name}
              className="detail-image"
            />
            {hasDiscount && <span className="detail-badge">-{discountPct}%</span>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category}</div>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="detail-rating-text">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
            </div>

            <div className="detail-price-row">
              {hasDiscount ? (
                <>
                  <span className="price" style={{fontSize:'28px'}}>${product.discountPrice.toFixed(2)}</span>
                  <span className="price-original" style={{fontSize:'18px'}}>${product.price.toFixed(2)}</span>
                  <span className="price-discount">Save {discountPct}%</span>
                </>
              ) : (
                <span className="price" style={{fontSize:'28px'}}>${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="detail-stock">
              {product.stock > 10 ? (
                <span className="stock-ok"><CheckCircle size={15} /> In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="stock-low"><AlertCircle size={15} /> Only {product.stock} left — order soon!</span>
              ) : (
                <span className="stock-out"><AlertCircle size={15} /> Out of Stock</span>
              )}
            </div>

            <div className="detail-desc">
              <h3>About this product</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="detail-qty">
                <label className="form-label">Quantity</label>
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ flex: 1 }}
              >
                <ShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="btn btn-ghost btn-icon btn-lg" title="Share"><Share2 size={18} /></button>
            </div>

            <div className="detail-features">
              <div className="detail-feature"><Truck size={16} /><span>Free shipping on orders over $50</span></div>
              <div className="detail-feature"><Shield size={16} /><span>30-day return policy</span></div>
              <div className="detail-feature"><RefreshCw size={16} /><span>Easy exchanges</span></div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Related Products</h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="btn btn-ghost btn-sm">
                View all in {product.category}
              </Link>
            </div>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
