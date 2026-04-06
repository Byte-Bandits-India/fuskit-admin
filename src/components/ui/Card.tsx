import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={cn('rounded-xl overflow-hidden', className)}
    style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  right?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, action, right }) => (
  <div
    className="flex items-center justify-between gap-3 px-4 py-[13px]"
    style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)',
    }}
  >
    <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
      {title}
    </div>
    {action && (
      <div
        className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer hover:underline"
        style={{ color: 'var(--orange)' }}
      >
        {action}
        <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    )}
    {right && <div>{right}</div>}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-4', className)}>{children}</div>
);
