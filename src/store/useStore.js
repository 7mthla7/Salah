import { create } from 'zustand';

// ── Seed products ─────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    price: 89.99,
    discountPrice: 69.99,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for travel, work, and workouts.',
    category: 'Electronics',
    stock: 45,
    status: 'active',
    rating: 4.5,
    reviews: 128,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    price: 149.00,
    discountPrice: null,
    description: 'Track your health and fitness with heart rate monitoring, GPS, sleep tracking, and 7-day battery. Water-resistant up to 50m.',
    category: 'Electronics',
    stock: 28,
    status: 'active',
    rating: 4.7,
    reviews: 95,
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '3',
    name: 'Men\'s Running Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    price: 75.00,
    discountPrice: 59.00,
    description: 'Lightweight and breathable running shoes with cushioned sole, designed for maximum comfort during long-distance runs.',
    category: 'Fashion',
    stock: 60,
    status: 'active',
    rating: 4.3,
    reviews: 74,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    price: 28.00,
    discountPrice: null,
    description: 'Double-wall insulated water bottle keeps drinks cold for 24 hours and hot for 12. BPA-free, leak-proof lid.',
    category: 'Home & Kitchen',
    stock: 120,
    status: 'active',
    rating: 4.6,
    reviews: 210,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: '5',
    name: 'Professional Camera Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    price: 65.00,
    discountPrice: null,
    description: 'Spacious camera backpack with padded compartments for DSLR, lenses, laptop, and accessories. Waterproof exterior.',
    category: 'Electronics',
    stock: 0,
    status: 'active',
    rating: 4.4,
    reviews: 56,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '6',
    name: 'Organic Face Moisturizer',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80',
    price: 34.99,
    discountPrice: 27.99,
    description: 'All-natural, cruelty-free face moisturizer with hyaluronic acid, vitamin C, and aloe vera. Suitable for all skin types.',
    category: 'Beauty',
    stock: 85,
    status: 'active',
    rating: 4.8,
    reviews: 162,
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
  },
  {
    id: '7',
    name: 'Non-Stick Cookware Set',
    image: 'https://images.unsplash.com/photo-1584178639036-613ba728be8b?w=600&q=80',
    price: 120.00,
    discountPrice: 89.00,
    description: '10-piece non-stick cookware set with heat-resistant handles. Dishwasher-safe, compatible with all stovetops including induction.',
    category: 'Home & Kitchen',
    stock: 22,
    status: 'active',
    rating: 4.5,
    reviews: 88,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '8',
    name: 'Leather Wallet',
    image: 'https://images.unsplash.com/photo-1624811533744-f85d5325d49c?w=600&q=80',
    price: 42.00,
    discountPrice: null,
    description: 'Slim genuine leather bi-fold wallet with RFID blocking, 6 card slots, and cash compartment. Elegant and durable.',
    category: 'Fashion',
    stock: 75,
    status: 'active',
    rating: 4.2,
    reviews: 44,
    createdAt: new Date('2024-01-28').toISOString(),
    updatedAt: new Date('2024-01-28').toISOString(),
  },
  {
    id: '9',
    name: 'Yoga Mat Premium',
    image: 'https://images.unsplash.com/photo-1601925228008-d2b36b2c0935?w=600&q=80',
    price: 55.00,
    discountPrice: 45.00,
    description: 'Extra-thick 6mm eco-friendly yoga mat with non-slip surface, alignment lines, and carrying strap. Perfect for all yoga styles.',
    category: 'Sports',
    stock: 40,
    status: 'active',
    rating: 4.6,
    reviews: 118,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '10',
    name: 'Bestseller Novel Collection',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    price: 22.00,
    discountPrice: null,
    description: 'Set of 5 bestselling novels from award-winning authors. Perfect for book lovers and gift-giving.',
    category: 'Books',
    stock: 200,
    status: 'active',
    rating: 4.9,
    reviews: 305,
    createdAt: new Date('2024-02-03').toISOString(),
    updatedAt: new Date('2024-02-03').toISOString(),
  },
  {
    id: '11',
    name: 'Bluetooth Portable Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    price: 49.99,
    discountPrice: null,
    description: '360° surround sound, 20-hour playtime, waterproof design. Perfect for outdoor adventures and parties.',
    category: 'Electronics',
    stock: 33,
    status: 'active',
    rating: 4.4,
    reviews: 79,
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: '12',
    name: 'Cotton Bed Sheet Set',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    price: 58.00,
    discountPrice: 44.00,
    description: '100% organic cotton 400-thread-count sheet set. Includes flat sheet, fitted sheet, and 2 pillowcases. Hypoallergenic.',
    category: 'Home & Kitchen',
    stock: 50,
    status: 'active',
    rating: 4.7,
    reviews: 143,
    createdAt: new Date('2024-02-08').toISOString(),
    updatedAt: new Date('2024-02-08').toISOString(),
  },
];

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books', 'Toys', 'Automotive'];

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_PRODUCTS = 'salah_products';
const LS_CART = 'salah_cart';
const LS_AUTH = 'salah_auth';

function loadProducts() {
  try {
    const raw = localStorage.getItem(LS_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
}

function loadCart() {
  try {
    const raw = localStorage.getItem(LS_CART);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveCart(cart) {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { isAuthenticated: false };
}

// ── Store ─────────────────────────────────────────────────────────────────────
const useStore = create((set, get) => ({
  // ── Products ────────────────────────────────────────────────────────────────
  products: loadProducts(),
  categories: CATEGORIES,

  addProduct(data) {
    const product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      reviews: 0,
    };
    const products = [product, ...get().products];
    saveProducts(products);
    set({ products });
    return product;
  },

  updateProduct(id, data) {
    const products = get().products.map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    saveProducts(products);
    set({ products });
  },

  deleteProduct(id) {
    const products = get().products.filter(p => p.id !== id);
    saveProducts(products);
    // Also remove from cart
    const cart = get().cart.filter(item => item.productId !== id);
    saveCart(cart);
    set({ products, cart });
  },

  getProduct(id) {
    return get().products.find(p => p.id === id);
  },

  // ── Cart ────────────────────────────────────────────────────────────────────
  cart: loadCart(),

  addToCart(productId, qty = 1) {
    const product = get().getProduct(productId);
    if (!product || product.stock === 0) return false;
    const cart = [...get().cart];
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx >= 0) {
      const newQty = Math.min(cart[idx].qty + qty, product.stock);
      cart[idx] = { ...cart[idx], qty: newQty };
    } else {
      cart.push({ productId, qty: Math.min(qty, product.stock) });
    }
    saveCart(cart);
    set({ cart });
    return true;
  },

  removeFromCart(productId) {
    const cart = get().cart.filter(i => i.productId !== productId);
    saveCart(cart);
    set({ cart });
  },

  updateCartQty(productId, qty) {
    const product = get().getProduct(productId);
    if (!product) return;
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const safeQty = Math.min(qty, product.stock);
    const cart = get().cart.map(i =>
      i.productId === productId ? { ...i, qty: safeQty } : i
    );
    saveCart(cart);
    set({ cart });
  },

  clearCart() {
    saveCart([]);
    set({ cart: [] });
  },

  getCartItems() {
    const { products, cart } = get();
    return cart
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean);
  },

  getCartTotal() {
    return get().getCartItems().reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + price * item.qty;
    }, 0);
  },

  getCartCount() {
    return get().cart.reduce((s, i) => s + i.qty, 0);
  },

  // ── Auth ─────────────────────────────────────────────────────────────────────
  auth: loadAuth(),

  login(username, password) {
    // Simple admin auth — in production use a real backend
    if (username === 'admin' && password === 'admin123') {
      const auth = { isAuthenticated: true, username };
      localStorage.setItem(LS_AUTH, JSON.stringify(auth));
      set({ auth });
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(LS_AUTH);
    set({ auth: { isAuthenticated: false } });
  },
}));

export default useStore;
