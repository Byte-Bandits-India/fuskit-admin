import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { RangeTabs } from '@/components/ui/RangeTabs';
import { analyticsApi, type StoreVisitsResponse } from '@/services/api';

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" style={{ fill: 'var(--orange)' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

export const StoreVisitsChart: React.FC = () => {
  const [data, setData] = useState<StoreVisitsResponse | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    analyticsApi.storeVisits().then(res => setData(res)).catch(console.error);
  }, []);

  const activeDays = data?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const colors = ['#D4722A', '#2D72B8', '#41735D', '#A855F7', '#EF4444'];
  const stores = data?.stores || [
    { name: 'Chennai', total: 4891, series: [88, 72, 98, 80, 94, 104, 90] },
    { name: 'Bangalore', total: 3451, series: [68, 56, 78, 62, 72, 82, 76] }
  ];

  const maxVal = Math.max(...stores.flatMap(s => s.series), 100);
  
  // Calculate dynamic bar group positions based on number of days and stores
  const chartWidth = 380;
  const numDays = activeDays.length;
  const numStores = stores.length;
  const barWidth = Math.min(22, (chartWidth / numDays) / (numStores + 0.5));
  const groupSpacing = chartWidth / numDays;
  const barGroupXPositions = Array.from({ length: numDays }).map((_, i) => i * groupSpacing + 10);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 380;

    // Find which bar group is closest
    let closestIdx = 0;
    let minDist = Infinity;
    barGroupXPositions.forEach((bx, i) => {
      const groupCenter = bx + (numStores * barWidth) / 2;
      const dist = Math.abs(groupCenter - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    const groupCenter = barGroupXPositions[closestIdx] + (numStores * barWidth) / 2;
    const pxX = (groupCenter / 380) * rect.width;
    const maxBarVal = Math.max(...stores.map(s => s.series[closestIdx] || 0));
    const pxY = ((130 - (maxBarVal / maxVal) * 130) / 130) * rect.height;

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
        <div className="flex items-center gap-4 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {stores.map((store, i) => (
            <React.Fragment key={store.name}>
              <div>
                <div className="font-display text-[20px] font-bold" style={{ color: colors[i % colors.length] }}>
                  {store.total.toLocaleString()}
                </div>
                <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{store.name} · this week</div>
              </div>
              {i < stores.length - 1 && (
                <div className="self-stretch" style={{ width: 1, background: 'var(--border)' }} />
              )}
            </React.Fragment>
          ))}
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

            {/* Dynamic store bars */}
            {stores.map((store, sIdx) => (
              <React.Fragment key={`s-${sIdx}`}>
                {barGroupXPositions.map((groupX, dIdx) => {
                  const val = store.series[dIdx] || 0;
                  const h = Math.max((val / maxVal) * 100, 2); // min height of 2px
                  const xPos = groupX + (sIdx * (barWidth + 2)); // 2px gap between bars
                  return (
                    <rect
                      key={`r-${sIdx}-${dIdx}`}
                      className="bar-anim"
                      x={xPos} y={130 - h}
                      width={barWidth} height={h}
                      rx={4} fill={colors[sIdx % colors.length]}
                      opacity={hoveredIdx !== null && hoveredIdx !== dIdx ? 0.35 : 1}
                      style={{
                        animationDelay: `${dIdx * 0.05}s`,
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                  );
                })}
              </React.Fragment>
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
              <div className="chart-tooltip-label">{activeDays[hoveredIdx]}</div>
              {stores.map((store, sIdx) => (
                <div key={store.name} className="chart-tooltip-row">
                  <span className="chart-tooltip-dot" style={{ background: colors[sIdx % colors.length] }} />
                  <span className="chart-tooltip-key">{store.name}</span>
                  <span className="chart-tooltip-val">{store.series[hoveredIdx] || 0}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between px-[2px] pt-1">
            {activeDays.map(d => (
              <span key={d} className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[14px]">
            {stores.map((store, sIdx) => (
              <div key={store.name} className="flex items-center gap-[5px] text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: colors[sIdx % colors.length] }} />
                {store.name}
              </div>
            ))}
            <div className="flex items-center gap-[5px] text-[9px] italic" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              + future stores auto-appear
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
