import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export function AdminUserModal({ isOpen, onClose, onCreateUser }) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Freelancer');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const defaultAvatars = {
      Admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
      Client: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      Freelancer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80'
    };

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      username: name.trim().toLowerCase().replace(/\s+/g, ''),
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
      status: 'Active',
      avatar: defaultAvatars[role] || defaultAvatars.Freelancer,
      joinedDate: new Date().toISOString().split('T')[0],
      title: role === 'Client' ? 'Project Owner & Client' : (role === 'Admin' ? 'Platform Administrator' : 'Independent Specialist')
    };

    onCreateUser(newUser);
    showToast(`User "${newUser.name}" successfully created with role ${newUser.role}!`, 'success');
    setName('');
    setEmail('');
    setPassword('');
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
          maxWidth: '480px',
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
            Create New User Account (Admin)
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

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="adminNewUserName" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <input
              type="text"
              id="adminNewUserName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
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

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="adminNewUserEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <input
              type="email"
              id="adminNewUserEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya@example.com"
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

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="adminNewUserPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Initial Password
            </label>
            <input
              type="password"
              id="adminNewUserPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            <label htmlFor="adminNewUserRole" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Role Assignment
            </label>
            <select
              id="adminNewUserRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="Freelancer">Freelancer</option>
              <option value="Client">Client</option>
              <option value="Admin">Administrator</option>
            </select>
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
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

