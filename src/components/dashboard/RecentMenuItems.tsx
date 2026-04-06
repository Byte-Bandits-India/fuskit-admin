import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';
import { recentMenuItems } from '@/services/mockData';

const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const EyeOnIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--orange)' }}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

export const RecentMenuItems: React.FC = () => (
  <Card>
    <CardHeader title={<><MenuIcon /> Recent menu items</>} action="Manage all" />
    <CardBody>
      <div>
        {recentMenuItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-[10px] py-2 transition-colors"
            style={{
              borderBottom: item.id !== recentMenuItems[recentMenuItems.length - 1].id
                ? '1px solid var(--border)' : 'none',
            }}
          >
            {/* Emoji thumb */}
            <div
              className="flex items-center justify-center rounded-lg text-base flex-shrink-0"
              style={{
                width: 36, height: 36,
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
              }}
            >
              {item.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </div>
              <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                {item.category}
              </div>
            </div>

            {/* Veg/non-veg dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: item.vegStatus === 'veg' ? 'var(--green)' : 'var(--red)',
                boxShadow: item.vegStatus === 'veg'
                  ? '0 0 0 2px rgba(45,134,83,.15)'
                  : '0 0 0 2px rgba(201,64,64,.15)',
              }}
            />

            {/* Price */}
            <div className="text-[13px] font-bold min-w-[40px] text-right" style={{ color: 'var(--orange)' }}>
              ₹{item.price}
            </div>

            {/* Status pill */}
            <StatusPill variant={item.visibility} />

            {/* Row actions */}
            <div className="flex gap-1">
              <RowBtn><EditIcon /></RowBtn>
              <RowBtn>{item.visibility === 'visible' ? <EyeOnIcon /> : <EyeOffIcon />}</RowBtn>
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const RowBtn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="flex items-center justify-center rounded-[6px] cursor-pointer transition-all"
    style={{
      width: 26, height: 26,
      background: 'var(--bg-card2)',
      border: '1px solid var(--border)',
      color: 'var(--text-secondary)',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'var(--bg-hover)';
      el.style.borderColor = 'var(--border-strong)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'var(--bg-card2)';
      el.style.borderColor = 'var(--border)';
    }}
  >
    {children}
  </div>
);
