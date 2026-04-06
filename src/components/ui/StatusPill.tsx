import React from 'react';

type PillVariant = 'visible' | 'hidden';

interface StatusPillProps {
  variant: PillVariant;
}

export const StatusPill: React.FC<StatusPillProps> = ({ variant }) => (
  <span
    className="text-[9px] px-2 py-[3px] rounded-[20px] font-bold flex-shrink-0"
    style={
      variant === 'visible'
        ? { background: 'var(--green-bg)', color: 'var(--green)' }
        : { background: 'var(--bg-card2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
    }
  >
    {variant === 'visible' ? 'Visible' : 'Hidden'}
  </span>
);
