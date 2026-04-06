# Fusk-it Admin Dashboard

A production-grade React + Vite + TypeScript admin dashboard for Fusk-it, converted from the original HTML design.

## Tech Stack

- **React 18** + **Vite 5** + **TypeScript 5**
- **Tailwind CSS** — utility-first styling with custom design tokens
- **shadcn/ui** — headless components (ready to wire in via `@/components/ui/chart`)
- **Ant Design (AntD)** — available for tables, forms, modals, etc.

---

## Folder Structure

```
src/
├── components/
│   ├── ui/                  # Reusable primitives
│   │   ├── Card.tsx         # Card, CardHeader, CardBody
│   │   ├── Toggle.tsx       # On/off toggle switch
│   │   ├── RangeTabs.tsx    # Week/Month tab switcher
│   │   └── StatusPill.tsx   # Visible/Hidden pill badge
│   ├── layout/              # Shell components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Topbar.tsx       # Header bar
│   │   └── DashboardLayout.tsx
│   └── dashboard/           # Page-level widget components
│       ├── AnnouncementBanner.tsx
│       ├── CustomerLoginNote.tsx
│       ├── StatCardsRow.tsx
│       ├── PageVisitsChart.tsx
│       ├── StoreVisitsChart.tsx
│       ├── RecentMenuItems.tsx
│       ├── QuickActions.tsx
│       ├── MenuCategories.tsx
│       ├── StoreStatus.tsx
│       └── RecentActivity.tsx
├── pages/
│   └── DashboardPage.tsx    # Composing the full dashboard
├── hooks/
│   ├── useActiveNav.ts      # Sidebar active state
│   └── useToggle.ts         # Boolean toggle
├── services/
│   └── mockData.ts          # All mock data
├── types/
│   └── index.ts             # TypeScript interfaces
└── utils/
    └── cn.ts                # Tailwind class merger (clsx + twMerge)
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Replacing SVG Charts with shadcn/ui Charts

The `PageVisitsChart` and `StoreVisitsChart` components use inline SVG charts as placeholders. Replace them with the real shadcn/ui chart components:

```bash
npx shadcn-ui@latest add chart
```

Then swap out the SVG in each component with:

```tsx
// PageVisitsChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// or use shadcn's <ChartContainer> wrapper
```

---

## Adding AntD Components

AntD is pre-installed. Example usage in a page:

```tsx
import { Table, Button, Modal, Form, Input } from 'antd';

// Use AntD Table for Menu Items list
// Use AntD Form + Modal for Add Item dialog
// Use AntD DatePicker for analytics date range
```

---

## Design Tokens (CSS Variables)

All colours are defined as CSS variables in `src/index.css`:

| Variable           | Value        | Usage             |
|--------------------|--------------|-------------------|
| `--orange`         | `#D4722A`    | Primary accent    |
| `--bg-sidebar`     | `#2C1A0E`    | Sidebar bg        |
| `--bg-page`        | `#F7F3EE`    | Page bg           |
| `--text-primary`   | `#1C0F05`    | Body text         |
| `--green`          | `#2D8653`    | Success / veg     |
| `--red`            | `#C94040`    | Error / non-veg   |
| `--blue`           | `#2D72B8`    | Info              |
| `--purple`         | `#7C4DB8`    | Accent            |

---

## Next Steps

- [ ] Wire up React Router for multi-page navigation
- [ ] Replace mock data with real API calls in `services/`
- [ ] Add AntD Table to Menu Items page
- [ ] Add AntD Form + Modal for Add/Edit item
- [ ] Integrate shadcn/ui AreaChart and BarChart
- [ ] Add dark mode toggle
