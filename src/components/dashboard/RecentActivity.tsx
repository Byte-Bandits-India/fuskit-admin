import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { recentActivity } from '@/services/mockData';
import type { ActivityColor } from '@/types';

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const colorMap: Record<ActivityColor, string> = {
  orange:  'var(--orange)',
  green:   'var(--green)',
  neutral: '#C0B0A0',
  purple:  'var(--purple)',
  blue:    'var(--blue)',
};

export const RecentActivity: React.FC = () => (
  <Card>
    <CardHeader title={<><ClockIcon /> Recent activity</>} />
    <CardBody>
      <div>
        {recentActivity.map((item, idx) => (
          <div
            key={item.id}
            className="flex gap-[10px] items-start py-2"
            style={{
              borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div
              className="rounded-full flex-shrink-0 mt-[5px]"
              style={{ width: 7, height: 7, background: colorMap[item.color] }}
            />
            <div className="flex-1 text-xs leading-[1.5]" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
              {' '}— {item.description}
            </div>
            <div className="text-[10px] whitespace-nowrap mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);
