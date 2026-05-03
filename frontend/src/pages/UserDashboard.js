import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, matchesRes] = await Promise.all([
          api.getUserReports(),
          api.getMatches()
        ]);
        if (reportsRes.reports) setReports(reportsRes.reports);
        if (matchesRes.matches) setMatchesCount(matchesRes.matches.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userEmail = localStorage.getItem('email') || 'User';
  const userName = userEmail.split('@')[0];

  return (
    <div style={{ padding: '2.5rem', background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
          Welcome back, <span style={{ textTransform: 'capitalize' }}>{userName}</span>
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.1rem', margin: 0 }}>
          {matchesCount > 0 
            ? `You have ${matchesCount} new potential matches for your reported lost items.`
            : 'You have no new potential matches at this time.'}
        </p>
      </div>

      {/* Action Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Report Lost Card */}
        <div 
          onClick={() => navigate('/user/report-lost')}
          style={{ cursor: 'pointer', background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s', position: 'relative' }}
          onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: '#3B82F6', transform: 'translateY(-2px)' })}
          onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: '#E2E8F0', transform: 'translateY(0)' })}
        >
          <div style={{ width: '48px', height: '48px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: '0 0 0.5rem 0' }}>Report Lost Item</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>Log a new item you've misplaced.</p>
        </div>

        {/* Report Found Card */}
        <div 
          onClick={() => navigate('/user/report-found')}
          style={{ cursor: 'pointer', background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s', position: 'relative' }}
          onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: '#3B82F6', transform: 'translateY(-2px)' })}
          onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: '#E2E8F0', transform: 'translateY(0)' })}
        >
          <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: '0 0 0.5rem 0' }}>Report Found Item</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>Register an item you found in public.</p>
        </div>

        {/* View Matches Card */}
        <div 
          onClick={() => navigate('/user/matches')}
          style={{ cursor: 'pointer', background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s', position: 'relative' }}
          onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: '#3B82F6', transform: 'translateY(-2px)' })}
          onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: '#E2E8F0', transform: 'translateY(0)' })}
        >
          {matchesCount > 0 && (
            <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#DC2626', color: 'white', fontSize: '0.65rem', fontWeight: '800', padding: '0.25rem 0.5rem', borderRadius: '999px', letterSpacing: '0.05em' }}>
              {matchesCount} NEW
            </span>
          )}
          <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><polyline points="11 8 11 11 14 11"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: '0 0 0.5rem 0' }}>View Matches</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>Review system-identified matches.</p>
        </div>

        {/* My Claims Card */}
        <div 
          onClick={() => navigate('/user/my-claims')}
          style={{ cursor: 'pointer', background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative', transition: 'all 0.2s' }}
          onMouseOver={e => Object.assign(e.currentTarget.style, { borderColor: '#3B82F6', transform: 'translateY(-2px)' })}
          onMouseOut={e => Object.assign(e.currentTarget.style, { borderColor: '#E2E8F0', transform: 'translateY(0)' })}
        >
          <div style={{ width: '48px', height: '48px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A', margin: '0 0 0.5rem 0' }}>My Claims</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>Track your active ownership claims.</p>
        </div>

      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Reports List */}
        <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0F172A' }}>My Reported Items</h2>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>See all activity</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading records...</div>
            ) : reports.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No items reported yet.</div>
            ) : (
              reports.map((item, index) => (
                <div key={index} style={{ padding: '1.5rem', borderBottom: index < reports.length - 1 ? '1px solid #E2E8F0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Placeholder thumbnail */}
                    <div style={{ width: '64px', height: '64px', background: '#1E293B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      {item.category.substring(0,3).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>{item.item_name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.8rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Reported as {item.type} on {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ 
                      background: item.type === 'Lost' ? '#FEE2E2' : '#DCFCE7', 
                      color: item.type === 'Lost' ? '#B91C1C' : '#15803D', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem', 
                      fontWeight: '800', 
                      letterSpacing: '0.05em' 
                    }}>
                      {item.type.toUpperCase()} ITEM
                    </span>
                    <button 
                      style={{ background: '#0447C5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {item.status === 'Claimed' ? 'Claimed' : 'Active'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Information Sidebars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Claim Status Box */}
          <div style={{ background: '#0447C5', borderRadius: '12px', padding: '1.5rem', color: 'white', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '500', margin: '0 0 1rem 0', opacity: 0.9 }}>Active System Status</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em' }}>VERIFICATION ONLINE</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>100%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: '#ffffff', borderRadius: '3px' }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, opacity: 0.9 }}>
              Database connection is stable. The smart matching engine is actively scanning for potential item associations in real-time.
            </p>
          </div>

          {/* Pro Safety Tip Box */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0447C5' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Pro Safety Tip</h4>
            </div>
            <p style={{ color: '#4B5563', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
              Always include unique identifiers like serial numbers, distinct scratches, or custom wallpapers when reporting items to increase matching accuracy.
            </p>
          </div>

          {/* Nearest Found Center Map Box */}
          <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.05em' }}>NEAREST FOUND CENTER</h4>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </div>
            <div style={{ height: '120px', background: '#E2E8F0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Fake Map Grid lines */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" style={{ position: 'relative', zIndex: 1, dropShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Thapar University Security Center</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Main Campus Gate, Patiala, PB</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
