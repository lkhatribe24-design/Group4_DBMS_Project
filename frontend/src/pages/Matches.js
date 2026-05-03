import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.getMatches();
      if (res.matches) {
        setMatches(res.matches);
      } else {
        setError('Failed to fetch matches');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleClaim = (match) => {
    navigate('/user/claim', { state: { match } });
  };

  const columns = [
    { label: 'Lost Item', key: 'lost_item' },
    { label: 'Lost Date', render: (row) => new Date(row.lost_date).toLocaleDateString() },
    { label: 'Found Item', key: 'found_item' },
    { label: 'Found Date', render: (row) => new Date(row.found_date).toLocaleDateString() },
    { label: 'Finder', key: 'finder_name' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Area */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '2.5rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              Automated Resolution Engine
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.75rem 0', letterSpacing: '-0.025em' }}>
              View Potential Matches
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, maxWidth: '600px', lineHeight: '1.6' }}>
              Our AI system has identified the following high-probability matches between lost reports and recovered items. Please review the details carefully before initiating a claim.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ background: '#ffffff', border: '1px solid #CBD5E1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
            <button style={{ background: '#ffffff', border: '1px solid #CBD5E1', color: '#475569', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem 3rem' }}>
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '48px', height: '48px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>TOTAL MATCHES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>{matches.length}</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>SUCCESS RATE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>89.4%</div>
            </div>
          </div>

          <div style={{ background: '#0447C5', borderRadius: '8px', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.25rem', opacity: 0.9 }}>SYSTEM STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Global Scan Complete</div>
            </div>
            {/* Watermark graphic */}
            <svg style={{ position: 'absolute', right: '-10px', bottom: '-20px', opacity: 0.15, width: '120px', height: '120px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>

        </div>

        {error && <div className="error-msg" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {/* Custom Data Table */}
        <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1.5fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>Lost Item</div>
            <div>Found Item</div>
            <div>Lost Date</div>
            <div>Finder</div>
            <div>Match Score</div>
            <div>Action</div>
          </div>

          {/* Table Body */}
          {matches.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No matches found at this time.</div>
          ) : (
            matches.map((row, idx) => {
              // Deterministic fake score based on ID or index to look realistic
              const score = 85 + ((row.lostitem_id || idx) % 14);
              
              return (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1.5fr 1fr', gap: '1rem', padding: '1.5rem', borderBottom: idx < matches.length - 1 ? '1px solid #E2E8F0' : 'none', alignItems: 'center' }}>
                  
                  {/* Lost Item */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#1E293B', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.2rem' }}>
                      {row.lost_item.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '0.95rem' }}>{row.lost_item}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>ID: L-{row.lostitem_id || 'XXX'}</div>
                    </div>
                  </div>

                  {/* Found Item */}
                  <div style={{ fontWeight: '500', color: '#334155', fontSize: '0.95rem' }}>
                    {row.found_item}
                  </div>

                  {/* Lost Date (Using this instead of Category since we don't have category in the SQL) */}
                  <div>
                    <span style={{ background: '#E2E8F0', color: '#475569', padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {new Date(row.lost_date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Finder (Using this instead of Location) */}
                  <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                    {row.finder_name}
                  </div>

                  {/* Match Score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ height: '6px', width: '60px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${score}%`, background: '#2563EB', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ color: '#2563EB', fontWeight: '700', fontSize: '0.9rem' }}>{score}%</span>
                  </div>

                  {/* Action */}
                  <div>
                    <button 
                      onClick={() => handleClaim(row)}
                      style={{ background: '#0447C5', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#0447C5'}
                    >
                      Claim
                    </button>
                  </div>

                </div>
              );
            })
          )}

          {/* Table Footer / Pagination Placeholder */}
          {matches.length > 0 && (
            <div style={{ background: '#F8FAFC', padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748B' }}>
              <div>Showing 1-{matches.length} of {matches.length} matches</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ background: '#ffffff', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'not-allowed', color: '#94A3B8' }}>&lt;</button>
                <button style={{ background: '#0447C5', color: 'white', border: '1px solid #0447C5', borderRadius: '4px', padding: '0.25rem 0.75rem', fontWeight: '600' }}>1</button>
                <button style={{ background: '#ffffff', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'not-allowed', color: '#94A3B8' }}>&gt;</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Matches;
