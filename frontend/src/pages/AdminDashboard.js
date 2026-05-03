import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const formatCount = (value) => new Intl.NumberFormat('en-IN').format(value);

const formatClaimDate = (dateValue) => {
  if (!dateValue) return 'Not available';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString();
};

const getStatusTone = (status = '') => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved' || normalized === 'verified') return 'verified';
  if (normalized === 'pending') return 'pending';
  return 'review';
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.getClaims();
        setClaims(res.pending_claims || []);
      } catch (err) {
        console.error(err);
        setClaims([]);
      } finally {
        setLoadingClaims(false);
      }
    };

    fetchClaims();
  }, []);

  const pendingClaimsCount = useMemo(
    () => claims.filter((claim) => (claim.verification_status || '').toLowerCase() === 'pending').length,
    [claims]
  );

  const recentActivities = useMemo(
    () => claims.slice(0, 3).map((claim, index) => ({
      icon: index % 3 === 0 ? 'laptop' : index % 3 === 1 ? 'wallet' : 'key',
      item: claim.lost_item || claim.found_item || 'Claimed Item',
      detail: claim.found_item ? `Matched with ${claim.found_item}` : 'Claim submitted',
      claimant: claim.claimed_by || 'Unknown',
      status: claim.verification_status || 'Pending',
      statusTone: getStatusTone(claim.verification_status),
      date: formatClaimDate(claim.claim_date)
    })),
    [claims]
  );

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <section className="admin-content">
          <div className="admin-header-row">
            <div>
              <h1>Admin Dashboard</h1>
              <p>System overview and claim management status.</p>
            </div>
            <button className="manage-claims-btn" onClick={() => navigate('/admin/manage-claims')}>
              <span className="btn-icon clipboard-icon" aria-hidden="true"></span>
              Manage Claims
            </button>
          </div>

          <div className="admin-layout">
            <div className="admin-left">
              <section className="stats-grid" aria-label="Claim metrics">
                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon box-icon" aria-hidden="true"></span>
                    <span className="stat-note success">+12% vs last month</span>
                  </div>
                  <p>Total Claims</p>
                  <strong>{loadingClaims ? '...' : formatCount(claims.length)}</strong>
                </article>

                <article className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-icon pending-icon" aria-hidden="true"></span>
                    <span className="stat-note warning">Requires Attention</span>
                  </div>
                  <p>Pending Claims</p>
                  <strong>{loadingClaims ? '...' : formatCount(pendingClaimsCount)}</strong>
                </article>

                <article className="stat-card resolution-card">
                  <div className="resolution-title">
                    <span>Resolution Rate</span>
                    <span className="tiny-chart-icon" aria-hidden="true"></span>
                  </div>
                  <div className="bar-chart" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="resolution-footer">
                    <strong>94.2%</strong>
                    <span>Weekly Avg</span>
                  </div>
                </article>
              </section>

              <section className="activity-panel">
                <div className="panel-heading">
                  <h2>Recent Claims Activity</h2>
                  <button type="button" onClick={() => navigate('/admin/manage-claims')}>View All</button>
                </div>
                <div className="activity-table">
                  <div className="activity-row table-head">
                    <span>Item Details</span>
                    <span>Claimant</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>
                  {loadingClaims ? (
                    <div className="activity-empty">Loading claims...</div>
                  ) : recentActivities.length === 0 ? (
                    <div className="activity-empty">No claims found.</div>
                  ) : (
                    recentActivities.map((activity) => (
                      <div className="activity-row" key={`${activity.item}-${activity.claimant}-${activity.date}`}>
                        <div className="item-cell">
                          <span className={`item-icon ${activity.icon}`} aria-hidden="true"></span>
                          <div>
                            <strong>{activity.item}</strong>
                            <small>{activity.detail}</small>
                          </div>
                        </div>
                        <span>{activity.claimant}</span>
                        <span>
                          <span className={`status-pill ${activity.statusTone}`}>{activity.status}</span>
                        </span>
                        <span className="muted-cell">{activity.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <aside className="admin-right">
              <section className="integrity-card">
                <h3>Asset Integrity</h3>
                <div className="progress-line">
                  <div>
                    <span>Data Accuracy</span>
                    <strong>98%</strong>
                  </div>
                  <span className="progress-track"><span style={{ width: '98%' }}></span></span>
                </div>
                <div className="progress-line">
                  <div>
                    <span>Claim Velocity</span>
                    <strong>High</strong>
                  </div>
                  <span className="progress-track"><span style={{ width: '72%' }}></span></span>
                </div>
              </section>

              <section className="insight-card">
                <div className="sparkle" aria-hidden="true"></div>
                <span>AI Insight</span>
                <p>"Matching efficiency has increased by 14% since the new verification workflow was implemented. 82% of pending claims match existing database entries."</p>
                <button type="button">Review Suggestion</button>
              </section>

              <section className="map-card">
                <h3>Quick Map View</h3>
                <div className="map-preview" aria-hidden="true">
                  <span></span>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
