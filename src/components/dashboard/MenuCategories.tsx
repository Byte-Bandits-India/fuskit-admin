import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { categoriesApi, type CategoryDTO } from '@/services/api';

const ListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const MenuCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi.list()
      .then(res => setCategories(res.data))
      .catch(() => {/* silently fail — dashboard widget */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader
        title={<><ListIcon /> Menu Categories</>}
        action="View all"
        onActionClick={() => { window.location.hash = 'menu-items'; }}
      />
      <CardBody>
        {loading ? (
          <div className="flex flex-wrap gap-[6px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[20px]"
                style={{ height: 28, width: 80 + (i % 3) * 20, background: 'var(--bg-hover)' }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-[6px]">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center gap-[6px] pl-2 pr-[10px] py-[5px] rounded-[20px] cursor-pointer transition-all"
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
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
                  style={{ background: cat.visible ? 'var(--green)' : '#C0B0A0' }}
                />
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {cat.itemCount}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
