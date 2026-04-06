import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RangeTabs } from '@/components/ui/RangeTabs';

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" style={{ fill: 'var(--orange)' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const chennaiData = [88, 72, 98, 80, 94, 104, 90];
const bangaloreData = [68, 56, 78, 62, 72, 82, 76];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const barGroupXPositions = [10, 64, 118, 172, 226, 280, 334]; // Chennai bar x positions

export const StoreVisitsChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 380;

    // Find which bar group is closest
    let closestIdx = 0;
    let minDist = Infinity;
    barGroupXPositions.forEach((bx, i) => {
      const groupCenter = bx + 23; // center of the bar group (two bars of 22px each, gap ~2px)
      const dist = Math.abs(groupCenter - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    const groupCenter = barGroupXPositions[closestIdx] + 23;
    const pxX = (groupCenter / 380) * rect.width;
    const maxBarVal = Math.max(chennaiData[closestIdx], bangaloreData[closestIdx]);
    const pxY = ((130 - maxBarVal) / 130) * rect.height;

    setHoveredIdx(closestIdx);
    setTooltipPos({ x: pxX, y: pxY - 8 });
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    setTooltipPos(null);
  };

  return (
    <Card>
      <CardHeader
        title={<><StoreIcon /> Store visits</>}
        right={<RangeTabs tabs={['Week', 'Month']} />}
      />
      <CardBody>
        {/* Summary numbers */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div className="font-display text-[20px] font-bold" style={{ color: 'var(--orange)' }}>4,891</div>
            <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Chennai · this week</div>
          </div>
          <div className="self-stretch" style={{ width: 1, background: 'var(--border)' }} />
          <div>
            <div className="font-display text-[20px] font-bold" style={{ color: 'var(--blue)' }}>3,451</div>
            <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Bangalore · this week</div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-lg px-[10px] pt-[10px] pb-1 mb-2 relative"
          style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
        >
          <svg
            ref={svgRef}
            width="100%"
            viewBox="0 0 380 130"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'crosshair' }}
          >
            <line x1="0" y1="32" x2="380" y2="32" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />
            <line x1="0" y1="64" x2="380" y2="64" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />
            <line x1="0" y1="96" x2="380" y2="96" stroke="rgba(44,26,14,0.05)" strokeWidth="1" />

            {/* Chennai bars (orange) */}
            {[10, 64, 118, 172, 226, 280, 334].map((x, i) => (
              <rect
                key={`c-${i}`}
                className="bar-anim"
                x={x} y={130 - chennaiData[i]}
                width={22} height={chennaiData[i]}
                rx={4} fill="#D4722A"
                opacity={hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  transition: 'opacity 0.2s ease',
                }}
              />
            ))}
            {/* Bangalore bars (blue) */}
            {[34, 88, 142, 196, 250, 304, 358].map((x, i) => (
              <rect
                key={`b-${i}`}
                className="bar-anim"
                x={x} y={130 - bangaloreData[i]}
                width={22} height={bangaloreData[i]}
                rx={4} fill="#2D72B8"
                opacity={hoveredIdx !== null && hoveredIdx !== i ? 0.35 : 1}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  transition: 'opacity 0.2s ease',
                }}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && tooltipPos && (
            <div
              className="chart-tooltip"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
              }}
            >
              <div className="chart-tooltip-label">{days[hoveredIdx]}</div>
              <div className="chart-tooltip-row">
                <span className="chart-tooltip-dot" style={{ background: '#D4722A' }} />
                <span className="chart-tooltip-key">Chennai</span>
                <span className="chart-tooltip-val">{chennaiData[hoveredIdx]}</span>
              </div>
              <div className="chart-tooltip-row">
                <span className="chart-tooltip-dot" style={{ background: '#2D72B8' }} />
                <span className="chart-tooltip-key">Bangalore</span>
                <span className="chart-tooltip-val">{bangaloreData[hoveredIdx]}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between px-[2px] pt-1">
            {days.map(d => (
              <span key={d} className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[14px]">
            <div className="flex items-center gap-[5px] text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--orange)' }} />
              Chennai
            </div>
            <div className="flex items-center gap-[5px] text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)' }} />
              Bangalore
            </div>
            <div className="flex items-center gap-[5px] text-[9px] italic" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              + future stores auto-appear
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
