import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportFound = () => {
  const [formData, setFormData] = useState({
    item_name: '', category: 'Electronics', description: '', found_location: '', found_date: ''
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.reportFound(formData);
      if (res.found_item_id) {
        setMsg('Found item reported successfully!');
        setTimeout(() => navigate('/user/dashboard'), 2000);
      } else {
        setError(res.error || 'Failed to report item');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '2rem 1rem', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        maxWidth: '650px',
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        
        {/* Header Section */}
        <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '2rem 2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: '#0F172A', marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Report Found Item</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
            Help reunite an owner with their property by providing accurate details below.
          </p>
        </div>

        <div style={{ padding: '2.5rem' }}>
          {error && <div className="error-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error}</div>}
          {msg && <div className="success-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' }}>{msg}</div>}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Item Name</label>
              <input 
                name="item_name" 
                placeholder="e.g., Blue Leather Wallet"
                value={formData.item_name} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none', appearance: 'none' }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Personal">Personal</option>
                  <option value="Keys">Keys</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Found Date</label>
                <input 
                  type="date" 
                  name="found_date" 
                  value={formData.found_date} 
                  onChange={handleChange} 
                  required 
                  style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none', color: formData.found_date ? '#0F172A' : '#94A3B8' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Found Location</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <input 
                  name="found_location" 
                  placeholder="e.g., Central Station, Platform 4"
                  value={formData.found_location} 
                  onChange={handleChange} 
                  required 
                  style={{ padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>Description</label>
              <textarea 
                name="description" 
                placeholder="Describe unique features, condition, or contents to help identify the owner..."
                value={formData.description} 
                onChange={handleChange}
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', minHeight: '120px', fontSize: '0.95rem', background: '#ffffff', outline: 'none', resize: 'vertical' }}
              ></textarea>
            </div>

            <div style={{ height: '1px', background: '#E2E8F0', margin: '0 -2.5rem 1.5rem -2.5rem' }}></div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => navigate('/user/dashboard')}
                style={{ 
                  background: '#ffffff', 
                  color: '#475569', 
                  padding: '0.75rem 2rem', 
                  borderRadius: '6px', 
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ 
                  background: '#0447C5', 
                  color: 'white', 
                  padding: '0.75rem 2.5rem', 
                  borderRadius: '6px', 
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;
