import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { quickActions } from '@/services/mockData';

const FlashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" style={{ fill: 'var(--orange)' }}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const actionIcons: Record<string, React.ReactNode> = {
  '1': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  '2': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  '3': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  '4': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" style={{ fill: 'var(--orange)' }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </svg>
  ),
  '5': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  '6': (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
};

export const QuickActions: React.FC = () => (
  <Card>
    <CardHeader title={<><FlashIcon /> Quick actions</>} />
    <CardBody>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map(action => (
          <div
            key={action.id}
            className="flex items-center gap-[10px] px-3 py-[11px] rounded-[10px] cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-hover)';
              el.style.borderColor = 'var(--border-strong)';
              el.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-card2)';
              el.style.borderColor = 'var(--border)';
              el.style.boxShadow = 'none';
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 30, height: 30,
                background: 'var(--orange-light)',
                color: 'var(--orange)',
              }}
            >
              {actionIcons[action.id]}
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {action.label}
              </div>
              <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>
                {action.subLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);
