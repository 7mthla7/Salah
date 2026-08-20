import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Package, ChevronDown } from 'lucide-react';
import useStore from '../store/useStore';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const catRef = useRef(null);

  const cart = useStore(s => s.cart);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const categories = useStore(s => s.categories);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handler(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Package size={26} strokeWidth={2.5} />
          <span>Salah</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search products…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm search-btn">Search</button>
        </form>

        {/* Desktop nav */}
        <nav className="navbar-nav">
          <div className="nav-cat" ref={catRef}>
            <button className="nav-link cat-btn" onClick={() => setCatOpen(o => !o)}>
              Categories <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="cat-dropdown">
                <Link to="/products" className="cat-all" onClick={() => setCatOpen(false)}>All Products</Link>
                {categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="cat-item"
                    onClick={() => setCatOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/cart" className="nav-cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <div className="mobile-actions">
          <Link to="/cart" className="nav-cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="search"
              placeholder="Search products…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <Link to="/products" className="mob-link">All Products</Link>
          <div className="mob-categories">
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="mob-cat-link">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
