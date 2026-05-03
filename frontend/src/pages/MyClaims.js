import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const fetchMyClaims = async () => {
    try {
      const res = await api.getMyClaims();
      if (res.claims) {
        setClaims(res.claims);
      } else {
        setError('Failed to fetch claims');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#DCFCE7', text: '#166534' };
      case 'Rejected': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#FEF3C7', text: '#92400E' }; // Pending
    }
  };

  const columns = [
    { label: 'Lost Item', key: 'lost_item' },
    { label: 'Matched Found Item', key: 'found_item' },
    { label: 'Claim Submitted On', render: (row) => new Date(row.claim_date).toLocaleDateString() },
    { 
      label: 'Status', 
      render: (row) => {
        const colors = getStatusColor(row.verification_status);
        return (
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '999px', 
            background: colors.bg, 
            color: colors.text,
            fontWeight: '600',
            fontSize: '0.85rem'
          }}>
            {row.verification_status}
          </span>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '2.5rem', background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/user/dashboard')}
          style={{ background: '#ffffff', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>My Active Claims</h1>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {error && <div className="error-msg">{error}</div>}
        
        {loading ? (
          <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>Loading claims...</p>
        ) : claims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't submitted any ownership claims yet.</p>
            <button 
              onClick={() => navigate('/user/matches')}
              style={{ background: '#0447C5', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              View Potential Matches
            </button>
          </div>
        ) : (
          <Table columns={columns} data={claims} />
        )}
      </div>
    </div>
  );
};

export default MyClaims;
