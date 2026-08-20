import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Globe, AtSign, Share2, Rss, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Package size={24} />
              <span>Salah</span>
            </Link>
            <p>Your trusted marketplace for quality products at great prices. Shop with confidence.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Globe size={18} /></a>
              <a href="#" aria-label="Twitter"><AtSign size={18} /></a>
              <a href="#" aria-label="Instagram"><Share2 size={18} /></a>
              <a href="#" aria-label="Youtube"><Rss size={18} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Home+%26+Kitchen">Home & Kitchen</Link>
            <Link to="/products?category=Beauty">Beauty</Link>
          </div>
          <div className="footer-col">
            <h4>Customer Service</h4>
            <a href="#">Help Center</a>
            <a href="#">Track Order</a>
            <a href="#">Returns & Refunds</a>
            <a href="#">Shipping Info</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{fontSize: '13px', marginBottom: '12px', color: 'var(--footer-muted)'}}>
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your email" className="footer-email-input" />
              <button className="btn btn-primary btn-sm">
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Salah Marketplace. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
