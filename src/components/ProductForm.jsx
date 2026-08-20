import React, { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const INITIAL = {
  name: '',
  image: '',
  price: '',
  discountPrice: '',
  description: '',
  category: '',
  stock: '',
  status: 'active',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Product name is required.';
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
    errors.price = 'Enter a valid positive price.';
  if (form.discountPrice && (isNaN(Number(form.discountPrice)) || Number(form.discountPrice) <= 0))
    errors.discountPrice = 'Enter a valid positive discount price.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.category) errors.category = 'Select a category.';
  if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0)
    errors.stock = 'Enter a valid non-negative stock number.';
  return errors;
}

export default function ProductForm({ product = null, onClose }) {
  const categories = useStore(s => s.categories);
  const addProduct = useStore(s => s.addProduct);
  const updateProduct = useStore(s => s.updateProduct);

  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          image: product.image,
          price: String(product.price),
          discountPrice: product.discountPrice ? String(product.discountPrice) : '',
          description: product.description,
          category: product.category,
          stock: String(product.stock),
          status: product.status,
        }
      : INITIAL
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        image: form.image.trim() || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        description: form.description.trim(),
        category: form.category,
        stock: Number(form.stock),
        status: form.status,
      };
      if (product) {
        updateProduct(product.id, payload);
        toast.success('Product updated successfully!');
      } else {
        addProduct(payload);
        toast.success('Product added successfully!');
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                className={`form-input${errors.name ? ' error' : ''}`}
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className={`form-input${errors.category ? ' error' : ''}`}
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="https://... (leave blank for default image)"
              value={form.image}
              onChange={e => set('image', e.target.value)}
            />
            {form.image && (
              <div className="img-preview">
                <img src={form.image} alt="preview" onError={e => e.target.style.display='none'} />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                className={`form-input${errors.price ? ' error' : ''}`}
                type="number" min="0" step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={e => set('price', e.target.value)}
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Discount Price ($)</label>
              <input
                className={`form-input${errors.discountPrice ? ' error' : ''}`}
                type="number" min="0" step="0.01"
                placeholder="Optional"
                value={form.discountPrice}
                onChange={e => set('discountPrice', e.target.value)}
              />
              {errors.discountPrice && <span className="form-error">{errors.discountPrice}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                className={`form-input${errors.stock ? ' error' : ''}`}
                type="number" min="0"
                placeholder="0"
                value={form.stock}
                onChange={e => set('stock', e.target.value)}
              />
              {errors.stock && <span className="form-error">{errors.stock}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-input${errors.description ? ' error' : ''}`}
              placeholder="Describe this product…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
