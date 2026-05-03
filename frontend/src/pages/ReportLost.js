import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportLost = () => {
  const [formData, setFormData] = useState({
    item_name: '', category: 'Electronics', description: '', lost_location: '', lost_date: ''
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await api.reportLost(formData);
      if (res.lost_item_id) {
        setMsg('Lost item reported successfully!');
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
        padding: '3rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        maxWidth: '650px',
        width: '100%',
        margin: '0 auto'
      }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '56px', height: '56px', background: '#EFF6FF', borderRadius: '14px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0F172A', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Report Lost Item</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '450px', margin: '0 auto' }}>
            Provide as much detail as possible to help our recovery team identify and return your missing belongings.
          </p>
        </div>

        {error && <div className="error-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error}</div>}
        {msg && <div className="success-msg" style={{ padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' }}>{msg}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Item Name</label>
            <input 
              name="item_name" 
              placeholder="e.g., Silver MacBook Pro 14-inch"
              value={formData.item_name} 
              onChange={handleChange} 
              required 
              style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Category</label>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Lost Date</label>
              <input 
                type="date" 
                name="lost_date" 
                value={formData.lost_date} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none', color: formData.lost_date ? '#0F172A' : '#94A3B8' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Lost Location</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <input 
                name="lost_location" 
                placeholder="e.g., Terminal 3, Near Gate B12"
                value={formData.lost_location} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', fontSize: '0.95rem', background: '#ffffff', outline: 'none' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</label>
            <textarea 
              name="description" 
              placeholder="Describe unique identifying marks, stickers, or condition..."
              value={formData.description} 
              onChange={handleChange}
              style={{ padding: '0.875rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', width: '100%', minHeight: '120px', fontSize: '0.95rem', background: '#ffffff', outline: 'none', resize: 'vertical' }}
            ></textarea>
          </div>

          {/* Note: Photo upload dashed box omitted per user request */}

          <button type="submit" style={{ 
            width: '100%', 
            background: '#2563EB', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '6px', 
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}>
            Submit Report 
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
            By submitting this form, you verify that the information provided is accurate. Our team will review the claim within 24-48 business hours.
          </p>
        </form>

      </div>
    </div>
  );
};

export default ReportLost;
