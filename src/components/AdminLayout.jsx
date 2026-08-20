import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <Package size={22} />
            <span>Salah</span>
          </Link>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-section-label">Main Menu</div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${location.pathname === to ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="sidebar-chevron" />
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link">
            <Package size={18} />
            <span>View Store</span>
          </Link>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <button
            className="btn btn-ghost btn-icon admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="admin-topbar-right">
            <span className="admin-user">Admin</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
