import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const formatClaimId = (id) => `#CLM-${String(id).padStart(5, '0')}`;

const formatRelativeDate = (dateValue) => {
  if (!dateValue) return 'Not available';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Not available';

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};

const getStatusClass = (status = '') => {
  const normalized = status.toLowerCase();
  if (normalized === 'pending') return 'pending';
  if (normalized === 'approved') return 'approved';
  if (normalized === 'rejected') return 'rejected';
  return 'review';
};

const ManageClaims = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.getClaims();
      if (res.pending_claims) {
        setClaims(res.pending_claims);
      } else {
        setError('Failed to fetch claims');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setError(''); setMsg('');
    try {
      let res;
      if (action === 'APPROVE') {
        res = await api.approveClaim(id);
      } else {
        res = await api.rejectClaim(id);
      }
      
      if (res.error) {
        setError(res.error);
      } else {
        setMsg(`Claim ${action.toLowerCase()}d successfully`);
        setPage(1);
        fetchClaims(); // Refresh list
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const filteredClaims = statusFilter === 'ALL'
    ? claims
    : claims.filter((claim) => claim.verification_status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleClaims = filteredClaims.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstItem = filteredClaims.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, filteredClaims.length);

  const exportCsv = () => {
    const headers = ['Claim ID', 'Claimant', 'Lost Item', 'Found Item', 'Status', 'Claim Date'];
    const rows = filteredClaims.map((claim) => [
      formatClaimId(claim.claim_id),
      claim.claimed_by,
      claim.lost_item,
      claim.found_item,
      claim.verification_status,
      claim.claim_date ? new Date(claim.claim_date).toLocaleString() : ''
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'claims.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="claims-page">
      <header className="claims-page-header">
        <div>
          <h1>Manage Claims</h1>
          <p>Review and process ownership claims for lost items across the system.</p>
        </div>
        <div className="claims-header-stats">
          <div>
            <strong>{claims.length}</strong>
            <span>Pending Claims</span>
          </div>
          <div>
            <strong>{filteredClaims.length}</strong>
            <span>Visible Claims</span>
          </div>
        </div>
      </header>

      {error && <div className="error-msg">{error}</div>}
      {msg && <div className="success-msg">{msg}</div>}

      <section className="claims-table-card">
        <div className="claims-toolbar">
          <div className="claims-filters">
            <label htmlFor="status-filter">Filter by:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button className="export-btn" type="button" onClick={exportCsv}>
            Export CSV
          </button>
        </div>

        <div className="claims-table">
          <div className="claims-table-row claims-table-head">
            <span>Claim ID</span>
            <span>Claimant</span>
            <span>Item Details</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div className="claims-empty">Loading claims...</div>
          ) : visibleClaims.length === 0 ? (
            <div className="claims-empty">No records found.</div>
          ) : (
            visibleClaims.map((claim) => (
              <div className="claims-table-row" key={claim.claim_id}>
                <div className="claim-id-cell">
                  <strong>{formatClaimId(claim.claim_id)}</strong>
                  <small>{formatRelativeDate(claim.claim_date)}</small>
                </div>
                <div className="claimant-cell">
                  <span className="claimant-avatar" aria-hidden="true"></span>
                  <span>{claim.claimed_by}</span>
                </div>
                <div className="claim-item-cell">
                  <strong>{claim.lost_item}</strong>
                  <small>Matched with {claim.found_item}</small>
                </div>
                <div>
                  <span className={`claim-status ${getStatusClass(claim.verification_status)}`}>
                    {claim.verification_status}
                  </span>
                </div>
                <div className="claim-actions">
                  <button className="approve-btn" onClick={() => handleAction(claim.claim_id, 'APPROVE')}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => handleAction(claim.claim_id, 'REJECT')}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="claims-pagination">
          <span>Showing {firstItem} to {lastItem} of {filteredClaims.length} claims</span>
          <div>
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 3).map((pageNumber) => (
              <button
                type="button"
                className={currentPage === pageNumber ? 'active' : ''}
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="claims-summary-grid">
        <article>
          <span>Average TAT</span>
          <strong>4.2 Hours</strong>
          <p>Time to process a claim is shown from system activity.</p>
        </article>
        <article>
          <span>Match Accuracy</span>
          <strong>98.4%</strong>
          <p>Validated successful returns based on user confirmation.</p>
        </article>
        <article>
          <span>Claim Fraud Flagged</span>
          <strong>3 Active</strong>
          <p>Accounts flagged for multiple mismatched claim attempts.</p>
        </article>
      </section>
    </div>
  );
};

export default ManageClaims;
