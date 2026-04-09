import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { bannersApi, type BannerDTO } from '@/services/api';

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export const HomePageBanner: React.FC = () => {
  const [banners, setBanners] = useState<BannerDTO[]>([]);

  useEffect(() => {
    bannersApi.list().then(res => setBanners(res.data)).catch(console.error);
  }, []);

  const handleStatusChange = async (banner: BannerDTO, enabled: boolean) => {
    try {
      await bannersApi.updatePartial(banner.id, { enabled });
      // update state optimistically or re-fetch. Since status is computed, a re-fetch is safer, but we can do a naive optimistic update
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, enabled, status: enabled ? 'active' : 'inactive' } : b));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader title={<><ImageIcon /> Home Page Banner</>} />
      <CardBody>
        <div
          className="flex flex-col gap-4 h-[60px] overflow-y-auto snap-y snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {banners.map(banner => (
            <div
              key={banner.id}
              className="flex items-start gap-3 snap-start shrink-0 h-[60px]"
            >
              {/* Banner thumbnail */}
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
                style={{
                  width: 80, height: 60,
                  backgroundImage: banner.desktopImageUrl ? `url(${banner.desktopImageUrl})` : 'linear-gradient(135deg, #3B2010 0%, #6B3F1E 50%, #D4722A 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!banner.desktopImageUrl && (
                  <div className="text-center">
                    <div className="text-[8px] italic" style={{ color: 'rgba(240,217,192,0.7)' }}>No Image</div>
                  </div>
                )}
              </div>

              {/* Banner info */}
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {banner.title}
                </div>
                <div className="text-[10px] mt-[3px]" style={{ color: 'var(--text-muted)' }}>
                  {banner.subtitle || 'No subtitle'}
                </div>
                <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                  {banner.type || 'No type'}
                </div>
              </div>

              {/* Enable/Disable buttons */}
              <div className="flex flex-col gap-[5px] flex-shrink-0 items-end">
                <button
                  className="text-[10px] font-semibold px-3 py-[4px] rounded-[6px] transition-all cursor-pointer border-none"
                  onClick={() => handleStatusChange(banner, true)}
                  style={{
                    background: banner.status === 'active' ? 'var(--green)' : 'var(--green-bg)',
                    color: banner.status === 'active' ? '#fff' : 'var(--green)',
                    border: '1px solid rgba(45,134,83,0.2)',
                    fontFamily: "'Open Sans', sans-serif",
                    opacity: banner.status === 'active' ? 1 : 0.7,
                    cursor: banner.status === 'active' ? 'default' : 'pointer',
                    boxShadow: banner.status === 'active' ? '0 2px 8px rgba(45,134,83,0.3)' : 'none',
                  }}
                  disabled={banner.status === 'active'}
                >
                  Enable
                </button>
                <button
                  className="text-[10px] font-semibold px-3 py-[4px] rounded-[6px] transition-all cursor-pointer border-none"
                  onClick={() => handleStatusChange(banner, false)}
                  style={{
                    background: banner.status === 'inactive' ? 'var(--red)' : 'var(--red-bg)',
                    color: banner.status === 'inactive' ? '#fff' : 'var(--red)',
                    border: '1px solid rgba(201,64,64,0.2)',
                    fontFamily: "'Open Sans', sans-serif",
                    opacity: banner.status === 'inactive' ? 1 : 0.7,
                    cursor: banner.status === 'inactive' ? 'default' : 'pointer',
                    boxShadow: banner.status === 'inactive' ? '0 2px 8px rgba(201,64,64,0.3)' : 'none',
                  }}
                  disabled={banner.status === 'inactive'}
                >
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
