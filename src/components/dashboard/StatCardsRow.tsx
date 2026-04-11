import React, { useEffect, useState } from 'react';
import { dashboardApi, type DashboardStats } from '@/services/api';
import catImg from '@/assets/1.png';
import menuImg from '@/assets/2.png';
import storeImg from '@/assets/3.png';

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
  <div className="flex items-center justify-center w-full mt-1 mb-1">
    <svg width="86" height="86" viewBox="0 0 64 64" className="flex-shrink-0 drop-shadow-sm">
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle
        cx="32" cy="32" r="26"
        fill="none"
        stroke="var(--orange)"
        strokeWidth="5"
        strokeDasharray="113 50"
        strokeDashoffset="25"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="32" textAnchor="middle" fontSize="13" fontWeight="bold" fill="var(--text-primary)" fontFamily="Montserrat, sans-serif">{value}</text>
      <text x="32" y="44" textAnchor="middle" fontSize="6" fill="var(--text-muted)" fontFamily="System-ui, sans-serif" fontWeight="500" letterSpacing="0.5" style={{ textTransform: 'uppercase' }}>{label}</text>
    </svg>
  </div>
);

/* ─── Card Components ──────────────────────────────────── */

const cardBase = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
};

const cardHoverProps = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
    el.style.transform = 'translateY(-2px)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
    el.style.transform = '';
  }
};

const CategoriesCard: React.FC<{ data?: DashboardStats['categories'] }> = ({ data }) => (
  <div
    className="flex flex-col items-start rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 w-full min-h-[200px]"
    style={cardBase}
    {...cardHoverProps}
  >
    <img src={catImg} alt="" className="absolute -right-2 top-1/2 -translate-y-1/2 w-[45%] h-auto max-w-[140px] object-contain pointer-events-none opacity-90" style={{ transform: 'translate(10%, -20%)' }} />

    <div className="flex flex-col items-start relative z-10 w-full">
      <div className="text-[17px] font-bold" style={{ color: '#1B1512' }}>Categories</div>
      <div className="text-[13px] mt-[1px]" style={{ color: '#979797' }}>Last Week</div>
    </div>

    <div className="flex items-baseline gap-2 mt-[18px] mb-2 relative z-10">
      <span className="font-display text-[44px] font-bold leading-none tracking-tight" style={{ color: '#41735D' }}>{data?.total ?? '-'}</span>
      <span className="text-[18px] font-medium" style={{ color: '#41735D' }}>Items</span>
    </div>

    <div className="w-full mt-auto flex flex-col items-start gap-[8px] relative z-10">
      <span
        className="text-[11px] font-medium px-[24px] py-[4px] rounded-[14px] border border-[#41735D]"
        style={{ background: 'rgba(65, 115, 93, 0.05)', color: '#41735D' }}
      >
        {data?.hidden ?? 0} hidden
      </span>
      <span className="text-[12px] font-medium" style={{ color: '#979797' }}>
        {data?.change ? (data.change > 0 ? `+${data.change}` : data.change) : '0'} since last week
      </span>
    </div>
  </div>
);

const MenuItemsCard: React.FC<{ data?: DashboardStats['menuItems'] }> = ({ data }) => (
  <div
    className="flex flex-col items-start rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 w-full min-h-[200px]"
    style={cardBase}
    {...cardHoverProps}
  >
    <img src={menuImg} alt="" className="absolute right-[-10px] top-1/2 w-[45%] h-auto max-w-[150px] object-contain pointer-events-none opacity-90" style={{ transform: 'translate(10%, -20%)' }} />

    <div className="flex flex-col items-start relative z-10 w-full">
      <div className="text-[17px] font-bold" style={{ color: '#1B1512' }}>Menu Items</div>
      <div className="text-[13px] mt-[1px]" style={{ color: '#979797' }}>Last Week</div>
    </div>

    <div className="flex items-baseline gap-2 mt-[18px] mb-2 relative z-10">
      <span className="font-display text-[44px] font-bold leading-none tracking-tight" style={{ color: '#F56A27' }}>{data?.total ?? '-'}</span>
      <span className="text-[18px] font-medium" style={{ color: '#F56A27' }}>Items</span>
    </div>

    <div className="w-full mt-auto flex flex-col items-start gap-[8px] relative z-10">
      <span
        className="text-[11px] font-medium px-[24px] py-[4px] rounded-[14px] border border-[#F56A27]"
        style={{ background: 'rgba(245, 106, 39, 0.05)', color: '#F56A27' }}
      >
        {data?.hidden ?? 0} hidden
      </span>
      <span className="text-[12px] font-medium" style={{ color: '#979797' }}>
        {data?.change ? (data.change > 0 ? `+${data.change}` : data.change) : '0'} since last week
      </span>
    </div>
  </div>
);

const ActiveStoresCard: React.FC<{ data?: DashboardStats['stores'] }> = ({ data }) => (
  <div
    className="flex flex-col items-start rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 w-full min-h-[200px]"
    style={cardBase}
    {...cardHoverProps}
  >
    <img src={storeImg} alt="" className="absolute -right-[15px] top-[40%] w-[42%] h-auto max-w-[130px] object-contain pointer-events-none opacity-90" />

    <div className="flex flex-col items-start relative z-10 w-full">
      <div className="text-[17px] font-bold" style={{ color: '#1B1512' }}>Active Stores</div>
      <div className="text-[13px] mt-[1px]" style={{ color: '#979797' }}>Last Week</div>
    </div>

    <div className="flex items-baseline gap-2 mt-[18px] mb-2 relative z-10">
      <span className="font-display text-[44px] font-bold leading-none tracking-tight" style={{ color: '#41735D' }}>{data?.total ?? '-'}</span>
      <span className="text-[18px] font-medium" style={{ color: '#41735D' }}>stores</span>
    </div>

    <div className="w-full mt-auto pt-1 flex flex-col items-start gap-[6px] relative z-10">
      <div
        className="flex flex-col items-start gap-[6px] w-full overflow-y-auto no-scrollbar"
        style={{ maxHeight: 60 }}
      >
        {(data?.names || []).map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-[8px] text-[11px] font-medium w-full max-w-[110px] py-[3px] px-[12px] rounded-[6px] border border-[#41735D] flex-shrink-0"
            style={{ background: 'rgba(65, 115, 93, 0.05)', color: '#41735D' }}
          >
            <span className="w-[4px] h-[4px] rounded-full flex-shrink-0" style={{ background: '#41735D', boxShadow: '0 0 2px #41735D' }} />
            {name.split(' - ')[0].split(' — ')[0]}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const RegisteredUsersCard: React.FC<{ data?: DashboardStats['users'] }> = ({ data }) => (
  <div
    className="flex flex-col items-start rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all duration-[180ms] h-full"
    style={cardBase}
    {...cardHoverProps}
  >
    <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mb-3" style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>

    <div className="flex flex-col items-start">
      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Registered Users</div>
      <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Week</div>
    </div>

    <div className="flex flex-col items-start mt-3 mb-2 flex-grow gap-[6px]">
      <div className="font-display text-[32px] font-bold leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {data ? formatNumber(data.total) : '-'}
      </div>
      <span
        className="text-[10px] font-bold px-[7px] py-[3px] rounded-[20px]"
        style={{
          background: (data?.changePercent || 0) >= 0 ? 'var(--green-bg)' : 'rgba(201,64,64,0.1)',
          color: (data?.changePercent || 0) >= 0 ? 'var(--green)' : 'var(--red)'
        }}
      >
        {(data?.changePercent || 0) > 0 ? '+' : ''}{data?.changePercent || 0}%
      </span>
    </div>

    <div className="w-full mt-auto pt-1">
      <MiniBarChart color={((data?.changePercent || 0) >= 0) ? 'var(--green)' : 'var(--red)'} />
    </div>
  </div>
);

const PageVisitsCard: React.FC<{ data?: DashboardStats['pageVisits'] }> = ({ data }) => (
  <div
    className="flex flex-col items-start rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all duration-[180ms] h-full"
    style={cardBase}
    {...cardHoverProps}
  >
    <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mb-3" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 9l-5 5-4-4-4 4" />
      </svg>
    </div>

    <div className="flex flex-col items-start">
      <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>Page Visits</div>
      <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Last Month</div>
    </div>

    <div className="flex flex-col items-start mt-3 flex-grow gap-2 w-full">
      <div className="flex items-center gap-2">
        <div className="font-display text-[32px] font-bold leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {data ? formatNumber(data.total) : '-'}
        </div>
        <span
          className="text-[10px] font-bold"
          style={{ color: (data?.changePercent || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}
        >
          {(data?.changePercent || 0) > 0 ? '+' : ''}{data?.changePercent || 0}%
        </span>
      </div>
      <DonutChart value={data?.total || 0} label="Visitors" />
    </div>
  </div>
);

/* ─── Row Export ──────────────────────────────────────── */

export const StatCardsRow: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    dashboardApi.stats().then(res => setStats(res)).catch(console.error);
  }, []);

  return (
    <div className="grid gap-3 md:gap-[14px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch">
      <CategoriesCard data={stats?.categories} />
      <MenuItemsCard data={stats?.menuItems} />
      <ActiveStoresCard data={stats?.stores} />
      <RegisteredUsersCard data={stats?.users} />
      <PageVisitsCard data={stats?.pageVisits} />
    </div>
  );
};
