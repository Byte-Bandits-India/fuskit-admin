import React from 'react';
import { AnnouncementBanner } from '@/components/dashboard/AnnouncementBanner';
import { StatCardsRow } from '@/components/dashboard/StatCardsRow';
import { PageVisitsChart } from '@/components/dashboard/PageVisitsChart';
import { StoreVisitsChart } from '@/components/dashboard/StoreVisitsChart';
import { MenuCategories } from '@/components/dashboard/MenuCategories';
import { StoreStatus } from '@/components/dashboard/StoreStatus';
import { HomePageBanner } from '@/components/dashboard/HomePageBanner';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-[14px] p-3 md:p-5 md:px-6 rounded-xl bg-[#F7F3EE]">

      {/* Announcement bar */}
      <AnnouncementBanner />

      {/* Stat cards row */}
      <StatCardsRow />

      {/* Charts row — two equal columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-[14px]">
        <PageVisitsChart />
        <StoreVisitsChart />
      </div>

      {/* Menu Categories + Store Status — side by side on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_600px] gap-3 md:gap-[14px]">
        {/* Left column */}
        <div className="flex flex-col gap-3 md:gap-[14px]">
          <MenuCategories />
          <HomePageBanner />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3 md:gap-[14px]">
          <StoreStatus />
        </div>
      </div>

    </div>
  );
};
