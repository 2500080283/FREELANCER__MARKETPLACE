import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ApplyModal({ project, isOpen, onClose, onSubmitProposal }) {
  const { currentUser, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [bidAmount, setBidAmount] = useState(project ? project.budget : '');
  const [deliveryDays, setDeliveryDays] = useState('7 Days');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please sign in as a freelancer to submit a proposal.', 'warning');
      openAuthModal('signin');
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      showToast('Please enter a valid bid amount.', 'error');
      return;
    }

    if (!coverLetter.trim()) {
      showToast('Please write a cover letter explaining your qualifications.', 'error');
      return;
    }

    const application = {
      id: `app-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      freelancerName: currentUser.name,
      freelancerEmail: currentUser.email,
      bid: Number(bidAmount),
      timeline: deliveryDays,
      coverLetter: coverLetter.trim(),
      portfolioLink: portfolioLink.trim(),
      status: 'pending',
      escrowState: 'Pending Escrow',
      date: new Date().toISOString()
    };

    onSubmitProposal(application);
    showToast(`Proposal successfully submitted for "${project.title}"!`, 'success');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          padding: '24px'
        }}
      >
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '18px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Apply for Project
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {project.title}
            </p>
            <p style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>
              Client's Listed Budget: ₹{project.budget.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label htmlFor="applyBidAmount" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Your Bid (INR ₹)
              </label>
              <input
                type="number"
                id="applyBidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="e.g. 25000"
                min="500"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="applyDeliveryTimeline" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Delivery Timeline
              </label>
              <select
                id="applyDeliveryTimeline"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="3 Days">3 Days</option>
                <option value="7 Days">7 Days</option>
                <option value="14 Days">14 Days</option>
                <option value="30 Days">30 Days</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="applyCoverLetter" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Cover Letter & Approach
            </label>
            <textarea
              id="applyCoverLetter"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Describe your relevant experience, proposed milestones, and how you will execute this project..."
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="applyPortfolioLink" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Portfolio / GitHub Link (Optional)
            </label>
            <input
              type="url"
              id="applyPortfolioLink"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://github.com/yourhandle or portfolio URL"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

