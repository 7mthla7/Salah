import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones, Star, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  Electronics: '💻',
  Fashion: '👗',
  'Home & Kitchen': '🏠',
  Beauty: '✨',
  Sports: '⚽',
  Books: '📚',
  Toys: '🧸',
  Automotive: '🚗',
};

export default function Home() {
  const navigate = useNavigate();
  const products = useStore(s => s.products);
  const categories = useStore(s => s.categories);
  const [searchVal, setSearchVal] = useState('');

  const active = products.filter(p => p.status === 'active');

  const featured = useMemo(() => {
    return [...active].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  }, [active]);

  const newest = useMemo(() => {
    return [...active].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  }, [active]);

  const popular = useMemo(() => {
    return [...active].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [active]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
  }

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <ShoppingBag size={14} /> New Arrivals Every Week
            </div>
            <h1>Discover Quality Products at <span className="hero-accent">Amazing Prices</span></h1>
            <p>Shop thousands of products across all categories. Fast shipping, easy returns, and unbeatable deals — only at Salah.</p>
            <form onSubmit={handleSearch} className="hero-search">
              <input
                type="search"
                placeholder='Try "headphones", "shoes", "books"…'
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="btn btn-primary btn-lg">
                Search <ArrowRight size={16} />
              </button>
            </form>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{active.length}+</strong><span>Products</span></div>
              <div className="hero-stat"><strong>{categories.length}</strong><span>Categories</span></div>
              <div className="hero-stat"><strong>Free</strong><span>Shipping on $50+</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-cards">
              {featured.slice(0, 3).map((p, i) => (
                <div key={p.id} className={`hero-card-float hero-card-${i}`}>
                  <img src={p.image} alt={p.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item"><Truck size={22} className="trust-icon" /><div><strong>Free Shipping</strong><span>On orders over $50</span></div></div>
          <div className="trust-item"><Shield size={22} className="trust-icon" /><div><strong>Secure Payments</strong><span>100% protected</span></div></div>
          <div className="trust-item"><Headphones size={22} className="trust-icon" /><div><strong>24/7 Support</strong><span>We're always here</span></div></div>
          <div className="trust-item"><Star size={22} className="trust-icon" /><div><strong>Quality Guarantee</strong><span>30-day returns</span></div></div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-sub">Browse our wide selection of product categories</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => {
              const count = active.filter(p => p.category === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="cat-card"
                >
                  <span className="cat-card-icon">{CATEGORY_ICONS[cat] || '🛍️'}</span>
                  <strong>{cat}</strong>
                  <span className="cat-card-count">{count} items</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-sub">Hand-picked top sellers and customer favorites</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">Shop All <ChevronRight size={14} /></Link>
          </div>
          {featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <h3>No products yet</h3>
              <p>Check back soon for amazing products!</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* New arrivals + Popular split */}
      <section className="section">
        <div className="container split-section">
          <div className="split-col">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
              <Link to="/products?sort=newest" className="btn btn-ghost btn-sm">See All <ChevronRight size={14} /></Link>
            </div>
            <div className="mini-list">
              {newest.map(p => <MiniProductRow key={p.id} product={p} />)}
            </div>
          </div>
          <div className="split-col">
            <div className="section-header">
              <h2 className="section-title">Top Rated</h2>
              <Link to="/products?sort=rating" className="btn btn-ghost btn-sm">See All <ChevronRight size={14} /></Link>
            </div>
            <div className="mini-list">
              {popular.map(p => <MiniProductRow key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to start shopping?</h2>
            <p>Join thousands of satisfied customers. Browse all products now.</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-lg">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MiniProductRow({ product }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  return (
    <Link to={`/products/${product.id}`} className="mini-product">
      <img src={product.image} alt={product.name} className="mini-product-img" />
      <div className="mini-product-info">
        <span className="mini-product-name">{product.name}</span>
        <div className="mini-product-price">
          <span className="price" style={{fontSize:'15px'}}>${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}</span>
          {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
        </div>
      </div>
    </Link>
  );
}
