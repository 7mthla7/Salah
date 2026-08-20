import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import useStore from '../../store/useStore';
import AdminLayout from '../../components/AdminLayout';
import ProductForm from '../../components/ProductForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const products = useStore(s => s.products);
  const categories = useStore(s => s.categories);
  const deleteProduct = useStore(s => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (catFilter) list = list.filter(p => p.category === catFilter);
    if (statusFilter) list = list.filter(p => p.status === statusFilter);
    return list;
  }, [products, search, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleDelete() {
    const p = products.find(x => x.id === deleteId);
    deleteProduct(deleteId);
    toast.success(`"${p?.name}" deleted.`);
    setDeleteId(null);
  }

  function openEdit(product) {
    setEditProduct(product);
    setShowForm(true);
  }

  function openAdd() {
    setEditProduct(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditProduct(null);
  }

  const deleteTarget = products.find(p => p.id === deleteId);

  return (
    <AdminLayout>
      <div className="admin-page page-enter">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Products</h1>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="card admin-filters">
          <div className="admin-filters-row">
            <div style={{position:'relative', flex:1, minWidth:'200px'}}>
              <Search size={15} style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} />
              <input
                className="form-input"
                style={{paddingLeft:'36px'}}
                placeholder="Search products…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="form-input"
              style={{width:'180px', flexShrink:0}}
              value={catFilter}
              onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="form-input"
              style={{width:'150px', flexShrink:0}}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {(search || catFilter || statusFilter) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(''); setCatFilter(''); setStatusFilter(''); setPage(1); }}
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
          <div className="admin-filters-count">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        <div className="card">
          {paginated.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No products found</h3>
              <p>{products.length === 0 ? 'Add your first product to get started.' : 'Try adjusting your filters.'}</p>
              {products.length === 0 && (
                <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add Product</button>
              )}
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="table-product-cell">
                            <img src={p.image} alt={p.name} className="table-product-img" />
                            <div>
                              <div className="table-product-name">{p.name}</div>
                              <div className="table-product-desc">{p.description.slice(0, 60)}…</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span style={{fontWeight:700, color:'var(--primary)'}}>
                              ${(p.discountPrice ?? p.price).toFixed(2)}
                            </span>
                            {p.discountPrice && (
                              <div style={{fontSize:'12px', color:'var(--text-light)', textDecoration:'line-through'}}>
                                ${p.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td><span className="badge badge-info">{p.category}</span></td>
                        <td>
                          <span style={{
                            fontWeight:600,
                            color: p.stock === 0 ? 'var(--danger)' : p.stock <= 5 ? 'var(--warning)' : 'var(--text)'
                          }}>
                            {p.stock === 0 ? 'Out of Stock' : p.stock}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                            {p.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-ghost btn-sm btn-icon"
                              title="Edit"
                              onClick={() => openEdit(p)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm btn-icon"
                              title="Delete"
                              style={{color:'var(--danger)'}}
                              onClick={() => setDeleteId(p.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="table-pagination">
                  <span className="pagination-info">
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        className={`page-btn${n === page ? ' active' : ''}`}
                        onClick={() => setPage(n)}
                      >{n}</button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >›</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Product form modal */}
        {showForm && (
          <ProductForm product={editProduct} onClose={closeForm} />
        )}

        {/* Delete confirm dialog */}
        {deleteId && (
          <ConfirmDialog
            title="Delete Product"
            message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            danger
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
