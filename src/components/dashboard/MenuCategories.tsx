import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { menuCategories } from '@/services/mockData';

const ListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const MenuCategories: React.FC = () => (
  <Card>
    <CardHeader
      title={<><ListIcon /> Menu Categories</>}
      action="View all"
      onActionClick={() => { window.location.hash = 'menu-items'; }}
    />
    <CardBody>
      <div className="flex flex-wrap gap-[6px]">
        {menuCategories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center gap-[6px] pl-2 pr-[10px] py-[5px] rounded-[20px] cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--orange)';
              el.style.background = 'var(--orange-bg)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border)';
              el.style.background = 'var(--bg-card2)';
            }}
          >
            <div
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ background: cat.isActive ? 'var(--green)' : '#C0B0A0' }}
            />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {cat.label}
            </span>
            <span
              className="text-[10px]"
              style={{ color: 'var(--text-muted)' }}
            >
              {cat.count}
            </span>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);
