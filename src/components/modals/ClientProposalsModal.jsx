import React from 'react';
import { useToast } from '../../context/ToastContext';

export function ClientProposalsModal({
  project,
  proposals = [],
  isOpen,
  onClose,
  onAcceptProposal
}) {
  const { showToast } = useToast();

  if (!isOpen || !project) return null;

  const projectProposals = proposals.filter(p => p.projectId === project.id);

  const handleAccept = (proposal) => {
    onAcceptProposal(proposal);
    showToast(`Proposal accepted! ₹${proposal.bid.toLocaleString()} placed in Escrow for ${proposal.freelancerName}.`, 'success');
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
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Project Proposals & Applicant Bids
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Project: <strong style={{ color: 'var(--text-primary)' }}>{project.title}</strong>
            </p>
            <p style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '2px' }}>
              Budget: ₹{project.budget.toLocaleString()} • {projectProposals.length} Applicant(s)
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

        {/* Proposals List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
          {projectProposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '15px' }}>No proposals received yet for this project.</p>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Freelancers will appear here once they submit bids.</p>
            </div>
          ) : (
            projectProposals.map(proposal => {
              const isAccepted = proposal.status === 'accepted';

              return (
                <div
                  key={proposal.id}
                  style={{
                    background: isAccepted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                    border: isAccepted ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {proposal.freelancerName}
                      </h4>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {proposal.freelancerEmail}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        ₹{proposal.bid.toLocaleString()}
                      </span>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Est. Timeline: {proposal.timeline}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '12px', marginBottom: '2px', textTransform: 'uppercase' }}>
                      Cover Letter:
                    </strong>
                    {proposal.coverLetter}
                  </div>

                  {proposal.portfolioLink && (
                    <div style={{ marginTop: '8px', fontSize: '12.5px' }}>
                      <a href={proposal.portfolioLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>
                        🔗 View Portfolio / GitHub
                      </a>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      {isAccepted ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: 'var(--accent-emerald)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          ✓ Proposal Accepted • Funds in Escrow
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: 'var(--accent-amber)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          ⏳ Pending Client Review
                        </span>
                      )}
                    </div>

                    {!isAccepted && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccept(proposal)}
                        style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '6px' }}
                      >
                        Accept Proposal & Escrow Funds
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

