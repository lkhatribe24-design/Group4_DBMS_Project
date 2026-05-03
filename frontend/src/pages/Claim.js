import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const formatDateTime = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Claim = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!state || !state.match) {
    return (
      <div className="claim-page">
        <div className="claim-empty">
          <h1>Confirm Claim Request</h1>
          <p>Please select a match from the matches page.</p>
          <button type="button" onClick={() => navigate('/user/matches')}>Browse Matches</button>
        </div>
      </div>
    );
  }

  const { match } = state;

  const handleSubmit = async () => {
    setError(''); setMsg('');
    setSubmitting(true);
    try {
      const res = await api.submitClaim({
        lost_item_id: match.lostitem_id,
        found_item_id: match.founditem_id
      });
      
      if (res.error) {
        setError(res.error);
      } else {
        setMsg('Claim successfully submitted to the Admin!');
        setTimeout(() => navigate('/user/matches'), 2000);
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="claim-page">
      <header className="claim-hero">
        <h1>Confirm Claim Request</h1>
        <p>Please review the item details below to ensure this belongs to you.</p>
        <p>Institutional trust and accuracy are our top priorities.</p>
      </header>

      {error && <div className="error-msg">{error}</div>}
      {msg && <div className="success-msg">{msg}</div>}

      <div className="claim-layout">
        <main className="claim-main">
          <section className="claim-item-card">
            <div className="claim-item-visual" aria-hidden="true">
              <span>{(match.found_item || match.lost_item || 'I').charAt(0).toUpperCase()}</span>
            </div>
            <div className="claim-item-details">
              <span className="claim-category">Potential Match</span>
              <h2>{match.found_item}</h2>
              <dl>
                <div>
                  <dt>Lost Item</dt>
                  <dd>{match.lost_item}</dd>
                </div>
                <div>
                  <dt>Lost Date</dt>
                  <dd>{formatDateTime(match.lost_date)}</dd>
                </div>
                <div>
                  <dt>Found Date</dt>
                  <dd>{formatDateTime(match.found_date)}</dd>
                </div>
                <div>
                  <dt>Finder Contact</dt>
                  <dd>{match.finder_name} ({match.finder_contact})</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="ownership-card">
            <h2>Proof of Ownership</h2>
            <p>
              Review the match carefully before submitting. Your claim will be sent to an admin for verification using the existing system workflow.
            </p>
            <div className="ownership-note">
              <strong>Current claim payload</strong>
              <span>Lost item ID: {match.lostitem_id || 'Not available'}</span>
              <span>Found item ID: {match.founditem_id || 'Not available'}</span>
            </div>
          </section>
        </main>

        <aside className="claim-summary-card">
          <h2>Claim Summary</h2>
          <div className="summary-list">
            <div>
              <span>Service Fee</span>
              <strong>$0.00</strong>
            </div>
            <div>
              <span>Storage Duration</span>
              <strong>3 Days</strong>
            </div>
            <div>
              <span>Verification Time</span>
              <strong>24-48 Hours</strong>
            </div>
          </div>

          <div className="claim-legal-note">
            <span aria-hidden="true">i</span>
            <p>By submitting this claim, you attest that the information provided is true and accurate. Fraudulent claims may be subject to legal action.</p>
          </div>

          <button className="submit-claim-btn" type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Claim Request'}
          </button>
          <button className="cancel-claim-btn" type="button" onClick={() => navigate('/user/matches')}>
            Cancel and Return
          </button>

          <div className="location-reference">
            <span>Match Reference</span>
            <div aria-hidden="true">
              <strong>{match.lostitem_id || '-'}</strong>
              <strong>{match.founditem_id || '-'}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Claim;
