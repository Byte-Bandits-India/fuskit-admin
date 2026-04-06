import React from 'react';

/* ─── Illustration SVGs ──────────────────────────────── */

const CategoriesIllustration = () => (
  <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
    {/* Bun/bread */}
    <ellipse cx="40" cy="55" rx="22" ry="16" fill="#2D8653" opacity="0.85" />
    <ellipse cx="40" cy="50" rx="20" ry="12" fill="#3DA868" />
    <ellipse cx="40" cy="48" rx="18" ry="10" fill="#4BC07A" />
    <circle cx="33" cy="46" r="2" fill="#2D8653" opacity="0.4" />
    <circle cx="44" cy="44" r="1.5" fill="#2D8653" opacity="0.3" />
    {/* Drink cup */}
    <rect x="68" y="30" width="18" height="35" rx="3" fill="#D4722A" opacity="0.8" />
    <rect x="70" y="33" width="14" height="8" rx="2" fill="#E8934D" />
    <rect x="74" y="25" width="6" height="8" rx="3" fill="#D4722A" opacity="0.6" />
    {/* Steam */}
    <path d="M76 22 Q78 18 76 14" stroke="#D4722A" strokeWidth="1.5" opacity="0.3" fill="none" strokeLinecap="round" />
    <path d="M80 20 Q82 16 80 12" stroke="#D4722A" strokeWidth="1.5" opacity="0.25" fill="none" strokeLinecap="round" />
    {/* Small pastry */}
    <circle cx="100" cy="58" r="10" fill="#E8934D" opacity="0.7" />
    <circle cx="100" cy="55" r="8" fill="#F0A96E" />
    <circle cx="97" cy="53" r="1.5" fill="#D4722A" opacity="0.3" />
  </svg>
);

const MenuItemsIllustration = () => (
  <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
    {/* Burger bun top */}
    <path d="M15 50 Q15 30 40 28 Q65 26 65 50 Z" fill="#D4722A" opacity="0.85" />
    <path d="M18 48 Q18 32 40 30 Q62 28 62 48 Z" fill="#E8934D" />
    <circle cx="30" cy="38" r="1.5" fill="#D4722A" opacity="0.3" />
    <circle cx="45" cy="35" r="1" fill="#D4722A" opacity="0.25" />
    {/* Burger filling */}
    <rect x="14" y="48" width="52" height="5" rx="2" fill="#2D8653" />
    <rect x="16" y="52" width="48" height="4" rx="2" fill="#C94040" opacity="0.7" />
    <rect x="14" y="55" width="52" height="8" rx="2" fill="#E8934D" />
    {/* Fries */}
    <rect x="75" y="35" width="5" height="25" rx="2" fill="#F0A96E" transform="rotate(-5 77 47)" />
    <rect x="82" y="32" width="5" height="28" rx="2" fill="#E8934D" transform="rotate(3 84 46)" />
    <rect x="89" y="34" width="5" height="26" rx="2" fill="#F0A96E" transform="rotate(-2 91 47)" />
    <rect x="96" y="36" width="5" height="24" rx="2" fill="#D4722A" opacity="0.7" transform="rotate(4 98 48)" />
    {/* Fries container */}
    <path d="M72 58 L74 70 L104 70 L106 58 Z" fill="#C94040" opacity="0.8" />
    <path d="M72 58 L106 58" stroke="#C94040" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ActiveStoresIllustration = () => (
  <svg viewBox="0 0 120 90" className="w-full h-full" fill="none">
    {/* Building 1 */}
    <rect x="10" y="30" width="30" height="40" rx="3" fill="#1B7A6D" opacity="0.85" />
    <rect x="14" y="35" width="8" height="8" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="28" y="35" width="8" height="8" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="14" y="48" width="8" height="8" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="28" y="48" width="8" height="8" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="20" y="58" width="10" height="12" rx="2" fill="#2EC4B6" opacity="0.7" />
    {/* Building 2 */}
    <rect x="48" y="22" width="28" height="48" rx="3" fill="#1B7A6D" />
    <rect x="52" y="27" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="65" y="27" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="52" y="39" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="65" y="39" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="52" y="51" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="65" y="51" width="7" height="7" rx="1" fill="#2EC4B6" opacity="0.5" />
    <rect x="57" y="60" width="10" height="10" rx="2" fill="#2EC4B6" opacity="0.7" />
    {/* Flag */}
    <rect x="84" y="15" width="2" height="55" fill="#D4722A" opacity="0.6" />
    <path d="M86 15 L102 22 L86 29 Z" fill="#D4722A" opacity="0.7" />
    {/* Trees */}
    <circle cx="98" cy="55" r="8" fill="#2D8653" opacity="0.6" />
    <rect x="97" y="58" width="2" height="12" fill="#6B3F1E" opacity="0.5" />
  </svg>
);

/* ─── Mini Charts ──────────────────────────────────────── */

const MiniBarChart: React.FC<{ color: string }> = ({ color }) => {
  const bars = [
    { x: 0, h: 26 }, { x: 10, h: 34 }, { x: 20, h: 22 },
    { x: 30, h: 38 }, { x: 40, h: 30 }, { x: 50, h: 40 },
    { x: 60, h: 34 }, { x: 70, h: 42 },
  ];
  const opacities = [0.25, 0.35, 0.28, 0.45, 0.38, 0.55, 0.48, 0.7];
  return (
    <svg className="w-full" style={{ height: 44 }} viewBox="0 0 84 44" preserveAspectRatio="none">
      {bars.map((b, i) => (
        <rect
          key={i}
          className="mini-bar-anim"
          x={b.x} y={44 - b.h} width={9} height={b.h}
          rx={2}
          fill={color}
          opacity={opacities[i]}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </svg>
  );
};

const DonutChart: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex items-center gap-[10px]">
    <svg width="64" height="64" viewBox="0 0 64 64" className="flex-shrink-0">
      <circle cx="32" cy="32" r="24" fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="32" cy="32" r="24"
        fill="none"
        stroke="var(--orange)"
        strokeWidth="6"
        strokeDasharray="113 38"
        strokeDashoffset="25"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--text-primary)" fontFamily="Montserrat, sans-serif">{value}</text>
      <text x="32" y="42" textAnchor="middle" fontSize="7" fill="var(--text-muted)" fontFamily="Open Sans, sans-serif">{label}</text>
    </svg>
  </div>
);

/* ─── Card Components ──────────────────────────────────── */

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-sm)',
};

const CategoriesCard: React.FC = () => (
  <div
    className="flex flex-col rounded-2xl p-4 pb-3 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
    style={cardBase}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = '';
    }}
  >
    <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Categories</div>
    <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Week</div>
    <div className="flex items-end justify-between mt-1">
      <div>
        <span className="font-display text-[28px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>4</span>
        <span className="text-[14px] font-semibold ml-[5px]" style={{ color: 'var(--orange)' }}>Items</span>
      </div>
      <div style={{ width: 90, height: 65 }}>
        <CategoriesIllustration />
      </div>
    </div>
    <div className="flex items-center justify-between mt-1">
      <span
        className="text-[10px] font-bold px-[8px] py-[3px] rounded-[20px]"
        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
      >
        0 hidden
      </span>
    </div>
    <div className="text-[10px] mt-[6px]" style={{ color: 'var(--text-muted)' }}>
      0 since last week
    </div>
  </div>
);

const MenuItemsCard: React.FC = () => (
  <div
    className="flex flex-col rounded-2xl p-4 pb-3 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
    style={cardBase}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = '';
    }}
  >
    <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Menu Items</div>
    <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Week</div>
    <div className="flex items-end justify-between mt-1">
      <div>
        <span className="font-display text-[28px] font-bold leading-none" style={{ color: 'var(--green)' }}>48</span>
        <span className="text-[14px] font-semibold ml-[5px]" style={{ color: 'var(--green)' }}>Items</span>
      </div>
      <div style={{ width: 95, height: 65 }}>
        <MenuItemsIllustration />
      </div>
    </div>
    <div className="flex items-center justify-between mt-1">
      <span
        className="text-[10px] font-bold px-[8px] py-[3px] rounded-[20px]"
        style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
      >
        6 hidden
      </span>
    </div>
    <div className="text-[10px] mt-[6px]" style={{ color: 'var(--text-muted)' }}>
      +3 since last week
    </div>
  </div>
);

const ActiveStoresCard: React.FC = () => (
  <div
    className="flex flex-col rounded-2xl p-4 pb-3 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
    style={cardBase}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = '';
    }}
  >
    <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Active Stores</div>
    <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Week</div>
    <div className="flex items-end justify-between mt-1">
      <div>
        <span className="font-display text-[28px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>2</span>
        <span className="text-[14px] font-semibold ml-[5px]" style={{ color: '#1B7A6D' }}>stores</span>
      </div>
      <div style={{ width: 90, height: 65 }}>
        <ActiveStoresIllustration />
      </div>
    </div>
    <div className="flex items-center gap-[6px] mt-2">
      <span
        className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px]"
        style={{ background: '#E8F5F2', color: '#1B7A6D', border: '1px solid rgba(27,122,109,0.15)' }}
      >
        Chennai
      </span>
      <span
        className="text-[10px] font-semibold px-[8px] py-[3px] rounded-[6px]"
        style={{ background: '#E8F5F2', color: '#1B7A6D', border: '1px solid rgba(27,122,109,0.15)' }}
      >
        Bangalore
      </span>
    </div>
  </div>
);

const RegisteredUsersCard: React.FC = () => (
  <div
    className="flex flex-col rounded-2xl p-4 pb-3 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
    style={cardBase}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = '';
    }}
  >
    <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Registered Users</div>
    <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Week</div>
    <div className="flex items-center gap-4 mt-2">
      <div className="font-display text-[28px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>624K</div>
      <span
        className="text-[11px] font-bold px-[7px] py-[3px] rounded-[20px]"
        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
      >
        +12.6%
      </span>
    </div>
    <div className="w-full mt-auto pt-2">
      <MiniBarChart color="var(--green)" />
    </div>
  </div>
);

const PageVisitsCard: React.FC = () => (
  <div
    className="flex flex-col rounded-2xl p-4 pb-3 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
    style={cardBase}
    onMouseEnter={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = '';
    }}
  >
    <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Page Visits</div>
    <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Month</div>
    <div className="flex items-center gap-3 mt-2 flex-1">
      <DonutChart value={500} label="Visitors" />
      <div className="flex flex-col gap-[2px]">
        <div className="font-display text-[18px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>32K</div>
        <span
          className="text-[10px] font-bold"
          style={{ color: 'var(--green)' }}
        >
          +12%
        </span>
      </div>
    </div>
  </div>
);

/* ─── Row Export ──────────────────────────────────────── */

export const StatCardsRow: React.FC = () => (
  <div className="grid gap-3 md:gap-[14px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
    <CategoriesCard />
    <MenuItemsCard />
    <ActiveStoresCard />
    <RegisteredUsersCard />
    <PageVisitsCard />
  </div>
);
