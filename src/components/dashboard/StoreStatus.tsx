import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { storesApi, type StoreDTO } from '@/services/api';

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" style={{ fill: 'var(--orange)' }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

export const StoreStatus: React.FC = () => {
  const [stores, setStores] = useState<StoreDTO[]>([]);

  useEffect(() => {
    storesApi.list().then(res => setStores(res.data)).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader
        title={<><MapPinIcon /> Store status</>}
        right={
          <span
            className="text-[11px] font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--red)' }}
            onClick={() => { window.location.hash = 'manage-stores'; }}
          >
            Edit →
          </span>
        }
      />
      <CardBody>
        <div className="flex flex-col gap-2">
        {stores.map(store => (
          <div
            key={store.id}
            className="flex items-start gap-[10px] px-[14px] py-3 rounded-[10px] transition-all cursor-pointer"
            style={{
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
              opacity: store.enabled ? 1 : 0.6
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border-strong)';
              el.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border)';
              el.style.boxShadow = 'none';
            }}
          >
            {/* Status dot */}
            <div
              className="rounded-full flex-shrink-0 mt-[5px]"
              style={{
                width: 9, height: 9,
                background: store.enabled ? 'var(--green)' : 'var(--red)',
                boxShadow: store.enabled
                  ? '0 0 0 3px rgba(45,134,83,.15)'
                  : '0 0 0 3px rgba(201,64,64,.15)',
              }}
            />
            <div className="flex-1">
              <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {store.name}
              </div>
              <div className="text-[11px] mt-[3px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
                {store.address} - {store.city}
              </div>
              <div className="text-[11px] mt-1 font-semibold" style={{ color: 'var(--orange)' }}>
                {store.enabled ? 'Open' : 'Closed'}
              </div>
              <div className="flex gap-[6px] mt-2">
                <span
                  className="text-[10px] px-2 py-[3px] rounded-[6px] font-semibold"
                  style={{ 
                    background: store.enabled ? 'var(--green-bg)' : 'rgba(201,64,64,0.1)', 
                    color: store.enabled ? 'var(--green)' : 'var(--red)' 
                  }}
                >
                  {store.enabled ? 'Open now' : 'Closed'}
                </span>
                <span
                  className="text-[10px] px-2 py-[3px] rounded-[6px] font-semibold cursor-pointer"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                  onClick={(e) => { 
                    e.stopPropagation();
                    window.location.hash = 'manage-stores'; 
                  }}
                >
                  Edit
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);
};
