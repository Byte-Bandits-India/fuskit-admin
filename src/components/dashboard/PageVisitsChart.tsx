import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RangeTabs } from '@/components/ui/RangeTabs';

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const PageVisitsChart: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title={<><ChartIcon /> Page visits</>}
        right={<RangeTabs tabs={['7d', '30d', '90d']} />}
      />
      <CardBody>
        {/* Summary */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="font-display text-[26px] font-bold" style={{ color: 'var(--text-primary)' }}>8,342</div>
            <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Total visits · last 7 days</div>
          </div>
          <div className="text-[11px] font-bold" style={{ color: 'var(--green)' }}>↑ 18% vs prev period</div>
        </div>

        {/* Chart area */}
        <div
          className="rounded-lg px-[10px] pt-[10px] pb-1 mb-2"
          style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
        >
          <svg width="100%" viewBox="0 0 400 130" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4722A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#D4722A" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            <line x1="0" y1="32" x2="400" y2="32" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />
            <line x1="0" y1="64" x2="400" y2="64" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />
            <line x1="0" y1="96" x2="400" y2="96" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />
            <path
              className="anim-fade"
              fill="url(#areaGradLight)"
              opacity={0.8}
              d="M0,95 C35,88 55,72 85,58 C110,44 130,78 165,62 C200,46 220,26 255,32 C290,38 310,56 345,42 C368,32 388,18 400,14 L400,120 L0,120 Z"
            />
            <path
              className="anim-line"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M0,95 C35,88 55,72 85,58 C110,44 130,78 165,62 C200,46 220,26 255,32 C290,38 310,56 345,42 C368,32 388,18 400,14"
            />
            {[
              [0, 95], [85, 58], [165, 62],
              [255, 32], [345, 42],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={3} fill="var(--orange)" />
            ))}
            <circle cx={400} cy={14} r={4} fill="#fff" stroke="var(--orange)" strokeWidth="2" />
          </svg>
          <div className="flex justify-between px-[2px] pt-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <span key={d} className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-[5px] text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <div className="rounded-sm" style={{ width: 16, height: 2, background: 'var(--orange)' }} />
              Page visits
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
