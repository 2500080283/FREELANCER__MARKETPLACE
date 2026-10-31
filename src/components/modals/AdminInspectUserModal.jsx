import React, { useState } from 'react';

export function AdminInspectUserModal({
  user,
  isOpen,
  onClose,
  projects = [],
  applications = [],
  onUpdateUserStatus,
  onResetPassword
}) {
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  if (!isOpen || !user) return null;

  const isSuperAdmin = user.username === 'prudhvi';
  const isSuspended = user.status === 'Suspended';

  // Projects posted by this user
  const userProjects = projects.filter(
    p => p.client?.email === user.email || p.client?.name === user.name
  );

  // Applications / proposals submitted by this user
  const userProposals = applications.filter(
    a => a.freelancerEmail === user.email || a.freelancerName === user.name
  );

  // Total volume
  const totalClientSpend = userProjects
    .filter(p => p.status === 'in_progress' || p.status === 'completed')
    .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  const totalFreelancerEarnings = userProposals
    .filter(a => a.status === 'accepted' || a.escrowState === 'Released to Freelancer')
    .reduce((sum, a) => sum + (Number(a.bid) || 0), 0);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    onResetPassword(user.id, newPassword.trim());
    setNewPassword('');
    setShowPasswordInput(false);
  };

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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
        color: 'var(--text-primary)',
        padding: '28px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
              alt={user.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.name}
                {isSuperAdmin && (
                  <span style={{ fontSize: '11px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', padding: '2px 8px', borderRadius: '12px' }}>
                    Super Admin
                  </span>
                )}
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                @{user.username || 'user'} • {user.email}
              </div>
            </div>
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

        {/* User Stats & Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
          padding: '14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Role</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary-light)', marginTop: '2px' }}>{user.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
            <div style={{
              fontWeight: 700,
              fontSize: '13px',
              color: isSuspended ? 'var(--accent-rose)' : 'var(--accent-emerald)',
              marginTop: '2px'
            }}>
              {user.status || 'Active'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined Date</div>
            <div style={{ fontWeight: 600, fontSize: '13px', marginTop: '2px' }}>{user.joinedDate || '2026-01-01'}</div>
          </div>
          {user.role === 'Client' && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Spend</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                ₹{totalClientSpend.toLocaleString()}
              </div>
            </div>
          )}
          {user.role === 'Freelancer' && (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Earned / Escrow</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                ₹{totalFreelancerEarnings.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Bio & Skills */}
        {user.bio && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Biography</div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{user.bio}</p>
          </div>
        )}

        {user.skills && user.skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Skills & Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user.skills.map((skill, idx) => (
                <span key={idx} style={{
                  fontSize: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--badge-text)',
                  padding: '3px 9px',
                  borderRadius: '12px'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab: Projects or Proposals */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
            Activity Record ({user.role === 'Client' ? `Posted Projects: ${userProjects.length}` : `Submitted Proposals: ${userProposals.length}`})
          </h4>

          {user.role === 'Client' ? (
            userProjects.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No projects posted by this client yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {userProjects.map(p => (
                  <div key={p.id} style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.category} • ₹{p.budget?.toLocaleString()}</div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      background: p.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: p.status === 'approved' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                    }}>
                      {p.status || 'approved'}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            userProposals.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No proposals submitted by this freelancer yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {userProposals.map(a => (
                  <div key={a.id} style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.projectTitle}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bid: ₹{a.bid?.toLocaleString()} • {a.timeline}</div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      background: a.status === 'accepted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: a.status === 'accepted' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                    }}>
                      {a.status === 'accepted' ? 'Accepted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Administrative Quick Actions */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {!isSuperAdmin && (
              <button
                className={`btn btn-sm ${isSuspended ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onUpdateUserStatus(user.id, isSuspended ? 'Active' : 'Suspended')}
              >
                {isSuspended ? '✓ Reactivate Account' : '⚠️ Suspend Account'}
              </button>
            )}

            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowPasswordInput(!showPasswordInput)}
            >
              🔑 {showPasswordInput ? 'Cancel Reset' : 'Reset Password'}
            </button>
          </div>

          {showPasswordInput && (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                placeholder="Enter new temporary password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-highlight)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Save Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminInspectUserModal;

