import React from 'react';

export function AdminInspectProjectModal({
  project,
  isOpen,
  onClose,
  onUpdateProjectStatus,
  onToggleFeatureProject,
  onDeleteProject
}) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="modal-card" style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-highlight)',
        borderRadius: '16px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
        color: 'var(--text-primary)',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--badge-text)'
              }}>
                {project.category}
              </span>
              {project.isFeatured && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: 'var(--accent-amber)'
                }}>
                  ★ Featured
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Client & Budget Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          padding: '14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fixed Budget</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
              ₹{project.budget?.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client</div>
            <div style={{ fontWeight: 600, fontSize: '13px', marginTop: '2px' }}>{project.client?.name || 'Verified Client'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Status</div>
            <div style={{
              fontWeight: 700,
              fontSize: '13px',
              color: project.status === 'approved' ? 'var(--accent-emerald)' : (project.status === 'rejected' ? 'var(--accent-rose)' : 'var(--accent-amber)'),
              marginTop: '2px'
            }}>
              {(project.status || 'approved').toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Proposals Count</div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>
              {project.proposalsCount || 0} Bids
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Project Scope & Requirements</div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Required Technical Competencies</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.skills.map((s, idx) => (
                <span key={idx} style={{
                  fontSize: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  color: 'var(--text-primary)'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.status !== 'approved' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onUpdateProjectStatus(project.id, 'approved');
                  onClose();
                }}
              >
                ✓ Approve Project
              </button>
            )}

            {project.status !== 'rejected' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onUpdateProjectStatus(project.id, 'rejected');
                  onClose();
                }}
              >
                ✕ Reject Project
              </button>
            )}

            <button
              className="btn btn-outline btn-sm"
              onClick={() => onToggleFeatureProject(project.id)}
            >
              {project.isFeatured ? 'Remove Feature Star' : '★ Feature on Home'}
            </button>
          </div>

          <button
            className="btn btn-sm"
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete "${project.title}"?`)) {
                onDeleteProject(project.id);
                onClose();
              }
            }}
            style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', border: 'none' }}
          >
            🗑️ Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminInspectProjectModal;

