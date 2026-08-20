import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

export default function Cart() {
  const cart = useStore(s => s.cart);
  const products = useStore(s => s.products);
  const removeFromCart = useStore(s => s.removeFromCart);
  const updateCartQty = useStore(s => s.updateCartQty);
  const clearCart = useStore(s => s.clearCart);

  const cartItems = cart
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.qty;
  }, 0);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  function handleRemove(productId, name) {
    removeFromCart(productId);
    toast.success(`${name} removed from cart.`);
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '100px' }}>
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet. Start shopping!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingBag size={18} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">Shopping Cart</h1>
          <span className="cart-header-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <button className="btn btn-ghost btn-sm" onClick={() => { clearCart(); toast.success('Cart cleared.'); }}>
                Clear Cart
              </button>
            </div>
            {cartItems.map(item => {
              const price = item.product.discountPrice ?? item.product.price;
              const hasDiscount = item.product.discountPrice && item.product.discountPrice < item.product.price;
              return (
                <div key={item.productId} className="cart-item">
                  <Link to={`/products/${item.productId}`} className="cart-item-img-wrap">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/products/${item.productId}`} className="cart-item-name">{item.product.name}</Link>
                    <span className="cart-item-cat">{item.product.category}</span>
                    <div className="cart-item-price-row">
                      <span className="price" style={{fontSize:'16px'}}>${price.toFixed(2)}</span>
                      {hasDiscount && <span className="price-original">${item.product.price.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty - 1)}>−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.qty + 1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">${(price * item.qty).toFixed(2)}</div>
                    <button
                      className="btn btn-ghost btn-icon cart-remove-btn"
                      onClick={() => handleRemove(item.productId, item.product.name)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-continue">
              <Link to="/products" className="btn btn-outline btn-sm">
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <div className="cart-summary-header">
              <Package size={18} />
              <h3>Order Summary</h3>
            </div>
            <div className="cart-summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{color:'var(--success)'}}>FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {subtotal < 50 && (
                <div className="free-shipping-hint">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => toast.success('Checkout feature coming soon! 🚀')}
            >
              Proceed to Checkout
            </button>
            <div className="cart-secure">
              🔒 Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
