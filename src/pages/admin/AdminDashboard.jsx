import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const products = useStore(s => s.products);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const cats = new Set(products.map(p => p.category)).size;
    return { total, active, inactive: total - active, outOfStock, cats };
  }, [products]);

  const recent = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [products]);

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);

  return (
    <AdminLayout>
      <div className="admin-page page-enter">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            + Add Product
          </Link>
        </div>

        {/* Stat cards */}
        <div className="stat-cards">
          <StatCard
            icon={<Package size={22} />}
            label="Total Products"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle size={22} />}
            label="Active Products"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={<XCircle size={22} />}
            label="Out of Stock"
            value={stats.outOfStock}
            color="red"
          />
          <StatCard
            icon={<Layers size={22} />}
            label="Categories"
            value={stats.cats}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Inactive"
            value={stats.inactive}
            color="orange"
          />
        </div>

        <div className="dashboard-grid">
          {/* Recent products */}
          <div className="card dash-card">
            <div className="dash-card-header">
              <h3>Recent Products</h3>
              <Link to="/admin/products" className="btn btn-ghost btn-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <img src={p.image} alt={p.name} style={{width:36, height:36, objectFit:'cover', borderRadius:'6px'}} />
                          <span style={{fontWeight:500}}>{p.name}</span>
                        </div>
                      </td>
                      <td>${(p.discountPrice ?? p.price).toFixed(2)}</td>
                      <td><span className="badge badge-info">{p.category}</span></td>
                      <td>{p.stock}</td>
                      <td>
                        <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {p.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low stock */}
          <div className="card dash-card">
            <div className="dash-card-header">
              <h3>Low Stock Alerts</h3>
              <span className="badge badge-warning">{lowStock.length} items</span>
            </div>
            {lowStock.length === 0 ? (
              <div style={{padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:'14px'}}>
                ✅ All products are well stocked!
              </div>
            ) : (
              <div className="low-stock-list">
                {lowStock.map(p => (
                  <div key={p.id} className="low-stock-item">
                    <img src={p.image} alt={p.name} />
                    <div className="low-stock-info">
                      <span className="low-stock-name">{p.name}</span>
                      <span className="low-stock-cat">{p.category}</span>
                    </div>
                    <span className="badge badge-warning">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}
