import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone_no: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.register(formData);
      if (res.user_id) {
        navigate('/login');
      } else {
        setError(res.error || 'Registration failed');
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
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        maxWidth: '520px',
        width: '100%',
        margin: '3rem auto',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '3rem 3rem 2rem 3rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '0.5rem', fontWeight: '700' }}>Create Account</h2>
          <p style={{ color: '#4B5563', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
            Join the LOST AND FOUND community to help reunite items with their owners.
          </p>

          {error && <div className="error-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Name</label>
              <input 
                name="name" 
                placeholder="Enter your full name"
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>Email Address</label>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.05em' }}>VERIFICATION REQUIRED</span>
              </div>
              <input 
                type="email" 
                name="email" 
                placeholder="name@company.com"
                value={formData.email} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
              />
              <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic' }}>
                *Must be a corporate or verified email domain.
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Phone Number</label>
              <input 
                name="phone_no" 
                placeholder="+1 (555) 000-0000"
                value={formData.phone_no} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Physical Address</label>
              <textarea 
                name="address" 
                placeholder="Enter your full mailing address"
                value={formData.address} 
                onChange={handleChange}
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', width: '100%', minHeight: '80px', fontSize: '0.95rem', background: '#ffffff', outline: 'none', resize: 'vertical' }}
              ></textarea>
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              background: '#0447C5', 
              color: 'white', 
              padding: '0.875rem', 
              borderRadius: '6px', 
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              Register 
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#4B5563', margin: 0 }}>
            Already have an account? <Link to="/login" style={{ color: '#0447C5', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>

        {/* Footer verification box */}
        <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '2rem 3rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#2563EB', padding: '0.6rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <div>
            <h4 style={{ color: '#111827', margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '700' }}>Secure Identity Verification</h4>
            <p style={{ color: '#4B5563', margin: 0, fontSize: '0.75rem', lineHeight: '1.4' }}>Your information is protected by industry-standard encryption and used solely for reunions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
