import React from 'react';

export function ProfileModal({ freelancer, isOpen, onClose }) {
  if (!isOpen || !freelancer) return null;

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
          maxWidth: '560px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          padding: '24px'
        }}
      >
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Freelancer Specialist Profile
          </h3>
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

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid var(--primary-light)'
            }}
          />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {freelancer.name}
            </h2>
            <p style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
              {freelancer.title}
            </p>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>⭐ <strong>{freelancer.rating}</strong> ({freelancer.reviewsCount} reviews)</span>
              <span>💼 <strong>{freelancer.completedJobs}</strong> jobs</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{freelancer.hourlyRate}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            About
          </h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {freelancer.bio}
          </p>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Skills & Technologies
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {freelancer.skills?.map((skill, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary-light)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {freelancer.topReview && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Top Client Endorsement</div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {freelancer.topReview}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onClose}>Contact Freelancer</button>
        </div>
      </div>
    </div>
  );
}

