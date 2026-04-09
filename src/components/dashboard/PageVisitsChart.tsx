import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RangeTabs } from '@/components/ui/RangeTabs';
import { analyticsApi, type PageVisitsResponse } from '@/services/api';

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const dataPoints = [
  { x: 0, y: 95, day: 'Mon', visits: 980 },
  { x: 85, y: 58, day: 'Tue', visits: 1340 },
  { x: 165, y: 62, day: 'Wed', visits: 1280 },
  { x: 255, y: 32, day: 'Thu', visits: 1560 },
  { x: 345, y: 42, day: 'Fri', visits: 1480 },
  { x: 400, y: 14, day: 'Sat', visits: 1704 },
];

export const PageVisitsChart: React.FC = () => {
  const [data, setData] = useState<PageVisitsResponse | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: typeof dataPoints[0] } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    analyticsApi.pageVisits().then(res => setData(res)).catch(console.error);
  }, []);

  const activeDataPoints = data?.series ? data.series.map((s, i) => {
    const spacing = 400 / (Math.max(data.series.length - 1, 1));
    const maxVisits = Math.max(...data.series.map(d => d.visits), 100);
    return {
      x: i * spacing,
      y: 130 - ((s.visits / maxVisits) * 100),
      day: s.day,
      visits: s.visits
    };
  }) : dataPoints;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 400;

    // Find closest data point
    let closest = activeDataPoints[0];
    let minDist = Infinity;
    for (const pt of activeDataPoints) {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = pt;
      }
    }

    setTooltip({
      x: (closest.x / 400) * rect.width,
      y: (closest.y / 130) * rect.height,
      data: closest,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

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
            <div className="font-display text-[26px] font-bold" style={{ color: 'var(--text-primary)' }}>{data?.total?.toLocaleString() ?? '8,342'}</div>
            <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Total visits · last 7 days</div>
          </div>
          <div className="text-[11px] font-bold" style={{ color: (data?.changePercent || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {(data?.changePercent || 0) > 0 ? '↑' : '↓'} Math.abs(data?.changePercent || 0)% vs prev period
          </div>
        </div>

        {/* Chart area */}
        <div
          className="rounded-lg px-[10px] pt-[10px] pb-1 mb-2 relative"
          style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
        >
          <svg
            ref={svgRef}
            width="100%"
            viewBox="0 0 400 130"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'crosshair' }}
          >
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
              d={`M0,130 ${activeDataPoints.map((pt, i) => i === 0 ? `L${pt.x},${pt.y}` : `L${pt.x},${pt.y}`).join(' ')} L400,130 Z`}
            />
            <path
              className="anim-line"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={`M${activeDataPoints.map(pt => `${pt.x},${pt.y}`).join(' L')}`}
            />

            {/* Data point circles */}
            {activeDataPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={tooltip?.data === pt ? 5 : 3}
                fill={tooltip?.data === pt ? '#fff' : 'var(--orange)'}
                stroke={tooltip?.data === pt ? 'var(--orange)' : 'none'}
                strokeWidth={2}
                style={{ transition: 'r 0.15s ease, fill 0.15s ease' }}
              />
            ))}

            {/* Vertical hover line */}
            {tooltip && (
              <line
                x1={tooltip.data.x}
                y1="0"
                x2={tooltip.data.x}
                y2="130"
                stroke="var(--orange)"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
            )}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="chart-tooltip"
              style={{
                left: tooltip.x,
                top: tooltip.y - 8,
              }}
            >
              <div className="chart-tooltip-label">{tooltip.data.day}</div>
              <div className="chart-tooltip-row">
                <span className="chart-tooltip-dot" style={{ background: 'var(--orange)' }} />
                <span className="chart-tooltip-key">Visits</span>
                <span className="chart-tooltip-val">{tooltip.data.visits.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between px-[2px] pt-1">
            {activeDataPoints.map(d => (
              <span key={d.day} className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d.day}</span>
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
