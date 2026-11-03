import React from 'react';
import { ProjectStatus, EscrowState, AccountStatus, UserRole } from '../../types';

interface StatusPillProps {
  status: ProjectStatus | EscrowState | AccountStatus | UserRole | string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  const s = (status || '').toLowerCase();

  let bg = 'rgba(255, 255, 255, 0.08)';
  let color = 'var(--text-secondary)';

  if (s === 'approved' || s === 'active' || s === 'released to freelancer' || s === 'accepted') {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = 'var(--accent-emerald)';
  } else if (s === 'pending' || s === 'pending escrow' || s === 'pending approval') {
    bg = 'rgba(245, 158, 11, 0.15)';
    color = 'var(--accent-amber)';
  } else if (s === 'held in escrow' || s === 'in_progress') {
    bg = 'rgba(6, 182, 212, 0.15)';
    color = 'var(--secondary)';
  } else if (s === 'rejected' || s === 'suspended' || s === 'under dispute' || s === 'cancelled') {
    bg = 'rgba(244, 63, 94, 0.15)';
    color = 'var(--accent-rose)';
  } else if (s === 'completed' || s === 'admin') {
    bg = 'rgba(192, 132, 252, 0.15)';
    color = '#c084fc';
  } else if (s === 'client') {
    bg = 'rgba(99, 102, 241, 0.15)';
    color = 'var(--primary-light)';
  }

  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? '11.5px' : '13px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        borderRadius: '999px',
        fontSize,
        fontWeight: 700,
        background: bg,
        color: color,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap'
      }}
    >
      {status}
    </span>
  );
};

export default StatusPill;

