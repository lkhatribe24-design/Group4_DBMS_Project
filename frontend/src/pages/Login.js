import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (role === 'USER') {
        res = await api.loginUser(email);
        if (res.user_id) {
          localStorage.setItem('role', 'USER');
          localStorage.setItem('email', email);
          localStorage.setItem('userId', res.user_id);
          navigate('/user/dashboard');
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        res = await api.loginAdmin(email);
        if (res.admin_id) {
          localStorage.setItem('role', 'ADMIN');
          localStorage.setItem('email', email);
          localStorage.setItem('adminId', res.admin_id);
          navigate('/admin/dashboard');
        } else {
          setError(res.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '3rem 2.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        maxWidth: '460px',
        width: '100%',
        margin: '4rem auto'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '0.5rem', fontWeight: '700' }}>Welcome Back</h2>
        <p style={{ color: '#6B7280', marginBottom: '2.5rem', fontSize: '1rem' }}>Please identify yourself to access the platform.</p>

        {error && <div className="error-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #D1D5DB', width: '100%', fontSize: '1rem', background: '#ffffff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Select Role</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button"
                onClick={() => setRole('USER')}
                style={{ 
                  flex: 1, 
                  padding: '0.875rem', 
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  border: role === 'USER' ? '1px solid #1D4ED8' : '1px solid #D1D5DB',
                  background: role === 'USER' ? '#2563EB' : '#ffffff',
                  color: role === 'USER' ? '#ffffff' : '#4B5563',
                  boxShadow: 'none',
                  transform: 'none'
                }}
              >
                Standard User
              </button>
              <button 
                type="button"
                onClick={() => setRole('ADMIN')}
                style={{ 
                  flex: 1, 
                  padding: '0.875rem', 
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  border: role === 'ADMIN' ? '1px solid #1D4ED8' : '1px solid #D1D5DB',
                  background: role === 'ADMIN' ? '#2563EB' : '#ffffff',
                  color: role === 'ADMIN' ? '#ffffff' : '#4B5563',
                  boxShadow: 'none',
                  transform: 'none'
                }}
              >
                Administrator
              </button>
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            background: '#0447C5', 
            color: 'white', 
            padding: '0.875rem', 
            borderRadius: '6px', 
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            Login to Dashboard
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
          <span style={{ padding: '0 1rem', color: '#9CA3AF', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Don't have an account?</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
        </div>

        <button 
          onClick={() => navigate('/register')}
          style={{ 
            width: '100%', 
            background: '#ffffff', 
            color: '#0447C5', 
            border: '1px solid #0447C5',
            padding: '0.875rem', 
            borderRadius: '6px', 
            fontWeight: '600',
            fontSize: '0.95rem',
            marginBottom: '2.5rem',
            boxShadow: 'none'
          }}
        >
          Register New Entity
        </button>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderTop: '1px solid #E5E7EB', 
          paddingTop: '1.5rem',
          color: '#6B7280',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          <span>Secure Session: 0x8F22A</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            AES-256 Protected
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
