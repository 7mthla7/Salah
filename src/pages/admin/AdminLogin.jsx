import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Package, Eye, EyeOff, LogIn } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const auth = useStore(s => s.auth);
  const login = useStore(s => s.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (auth.isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    // Simulate async
    await new Promise(r => setTimeout(r, 500));
    const ok = login(username.trim(), password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin / admin123');
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <Package size={36} strokeWidth={2} />
          <span>Salah</span>
        </div>
        <h2>Admin Dashboard</h2>
        <p className="admin-login-sub">Sign in to manage your store</p>

        {error && (
          <div className="admin-login-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pw-wrap">
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-hint">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}
