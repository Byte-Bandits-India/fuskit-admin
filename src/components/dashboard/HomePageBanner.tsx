import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

interface BannerItem {
  id: string;
  title: string;
  metaTitle: string;
  altText: string;
  enabled: boolean;
}

const banners: BannerItem[] = [
  {
    id: '1',
    title: 'Hero Section Banner',
    metaTitle: 'Meta Title : Coffee Hero Section',
    altText: 'Alt text: Home Page Custom Banner Image 1',
    enabled: true,
  },
  {
    id: '2',
    title: 'Spring Season Special',
    metaTitle: 'Meta Title : Spring Promo',
    altText: 'Alt text: Home Page Spring Banner Image',
    enabled: false,
  },
  {
    id: '3',
    title: 'New Store Launch',
    metaTitle: 'Meta Title : Bangalore Store Launch',
    altText: 'Alt text: Home Page Bangalore Banner Image',
    enabled: true,
  },
  {
    id: '4',
    title: 'Weekend Dessert Offers',
    metaTitle: 'Meta Title : Weekend Desserts',
    altText: 'Alt text: Home Page Dessert Offers Image',
    enabled: false,
  },
];

export const HomePageBanner: React.FC = () => (
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
              className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                width: 80, height: 60,
                background: 'linear-gradient(135deg, #3B2010 0%, #6B3F1E 50%, #D4722A 100%)',
              }}
            >
              <div className="text-center">
                <div className="text-[8px] italic" style={{ color: 'rgba(240,217,192,0.7)' }}>Enjoy Your</div>
                <div className="text-[9px] font-bold" style={{ color: '#F0D9C0' }}>Morning</div>
                <div className="text-[10px] font-bold" style={{ color: 'var(--orange)' }}>Coffee</div>
                <div className="flex gap-[2px] justify-center mt-[3px]">
                  <div className="w-[10px] h-[10px] rounded-[3px]" style={{ background: 'rgba(212,114,42,0.4)' }} />
                  <div className="w-[10px] h-[10px] rounded-[3px]" style={{ background: 'rgba(212,114,42,0.3)' }} />
                  <div className="w-[10px] h-[10px] rounded-[3px]" style={{ background: 'rgba(212,114,42,0.2)' }} />
                </div>
              </div>
            </div>

            {/* Banner info */}
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {banner.title}
              </div>
              <div className="text-[10px] mt-[3px]" style={{ color: 'var(--text-muted)' }}>
                {banner.metaTitle}
              </div>
              <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                {banner.altText}
              </div>
            </div>

            {/* Enable/Disable buttons */}
            <div className="flex flex-col gap-[5px] flex-shrink-0">
              <button
                className="text-[10px] font-semibold px-3 py-[4px] rounded-[6px] cursor-pointer border-none"
                style={{
                  background: 'var(--green-bg)',
                  color: 'var(--green)',
                  border: '1px solid rgba(45,134,83,0.2)',
                  fontFamily: 'Open Sans, sans-serif',
                }}
              >
                Enable
              </button>
              <button
                className="text-[10px] font-semibold px-3 py-[4px] rounded-[6px] cursor-pointer border-none"
                style={{
                  background: 'var(--red-bg)',
                  color: 'var(--red)',
                  border: '1px solid rgba(201,64,64,0.2)',
                  fontFamily: 'Open Sans, sans-serif',
                }}
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
