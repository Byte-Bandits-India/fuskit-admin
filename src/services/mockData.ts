import type {
  StatCard, MenuItem, MenuCategory, Store,
  ActivityItem, QuickAction, WeeklyVisit
} from '@/types';

// ─── Stats ─────────────────────────────────────────────────────────────────────
export const statsData: StatCard[] = [
  {
    id: 'menu-items',
    label: 'Menu items',
    value: '38',
    trend: '+3',
    trendDir: 'up',
    subText: '3 added this month',
    iconVariant: 'orange',
    chartType: 'bar',
  },
  {
    id: 'categories',
    label: 'Categories',
    value: '8',
    trend: 'stable',
    trendDir: 'neutral',
    subText: '1 hidden category',
    iconVariant: 'green',
    chartType: 'donut',
  },
  {
    id: 'customers',
    label: 'Customers',
    value: '142',
    trend: '+12',
    trendDir: 'up',
    subText: '12 new this week',
    iconVariant: 'blue',
    chartType: 'bar',
  },
  {
    id: 'gallery',
    label: 'Gallery photos',
    value: '24',
    trend: '+3',
    trendDir: 'up',
    subText: 'Last upload: today',
    iconVariant: 'purple',
    chartType: 'none',
  },
  {
    id: 'stores',
    label: 'Stores',
    value: '2',
    trend: 'stable',
    trendDir: 'neutral',
    subText: 'All stores open',
    iconVariant: 'red',
    chartType: 'none',
  },
];

// ─── Menu Items ────────────────────────────────────────────────────────────────
export const recentMenuItems: MenuItem[] = [
  { id: '1', name: 'Gulabjamun Butter Bun', category: 'Buns',          emoji: '🥐', price: 89,  vegStatus: 'veg',     visibility: 'visible' },
  { id: '2', name: 'OG Malaysian Milo',     category: 'Drinks',        emoji: '🥤', price: 199, vegStatus: 'veg',     visibility: 'visible' },
  { id: '3', name: 'Kozhi Butter Bun',      category: 'Buns — Non veg',emoji: '🍗', price: 199, vegStatus: 'non-veg', visibility: 'visible' },
  { id: '4', name: 'Chocolate Bhajji',      category: 'VJ Siddhu Spl', emoji: '🍫', price: 89,  vegStatus: 'veg',     visibility: 'hidden'  },
  { id: '5', name: 'Fusk Spl Fries',        category: 'Fusk Fries',    emoji: '🍟', price: 199, vegStatus: 'veg',     visibility: 'visible' },
];

// ─── Categories ────────────────────────────────────────────────────────────────
export const menuCategories: MenuCategory[] = [
  { id: '1', label: 'Buns',           count: 14,       isActive: true  },
  { id: '2', label: 'Drinks',         count: 8,        isActive: true  },
  { id: '3', label: 'Bread Omelette', count: 6,        isActive: true  },
  { id: '4', label: 'Signatures',     count: 6,        isActive: true  },
  { id: '5', label: 'Maggi',          count: 4,        isActive: true  },
  { id: '6', label: 'Fusk Fries',     count: 4,        isActive: true  },
  { id: '7', label: 'Fuscorns',       count: 1,        isActive: true  },
  { id: '8', label: 'VJ Siddhu Spl',  count: 'hidden', isActive: false },
];

// ─── Stores ────────────────────────────────────────────────────────────────────
export const storesData: Store[] = [
  {
    id: '1',
    name: 'Chennai — ECR, Akkarai',
    address: 'Sea Cliff Conclave, East Coast Road',
    hours: 'Open · 10am – 12am',
    status: 'open',
  },
  {
    id: '2',
    name: 'Bangalore',
    address: 'Address from admin panel',
    hours: 'Open · Hours from admin',
    status: 'open',
  },
];

// ─── Activity ──────────────────────────────────────────────────────────────────
export const recentActivity: ActivityItem[] = [
  { id: '1', title: 'New item added',   description: '"Rasagulla Butter Bun"',    time: '2h ago',   color: 'orange'  },
  { id: '2', title: 'Gallery updated',  description: '3 photos uploaded',          time: 'Yesterday', color: 'green'   },
  { id: '3', title: 'Category hidden',  description: 'VJ Siddhu Spl',             time: '2d ago',    color: 'neutral' },
  { id: '4', title: 'New customer',     description: 'User #142 registered',       time: '2d ago',    color: 'purple'  },
  { id: '5', title: 'Store updated',    description: 'Bangalore hours changed',    time: '3d ago',    color: 'blue'    },
];

// ─── Quick Actions ─────────────────────────────────────────────────────────────
export const quickActions: QuickAction[] = [
  {
    id: '1', label: 'Add item', subLabel: 'New menu item',
    iconPath: 'M12 5v14M5 12h14',
  },
  {
    id: '2', label: 'Add category', subLabel: 'New section',
    iconPath: 'M12 5v14M5 12h14',
  },
  {
    id: '3', label: 'Upload photo', subLabel: 'To gallery',
    iconPath: 'M3 3h18v18H3zM3 9h18M9 21V9',
  },
  {
    id: '4', label: 'Edit store', subLabel: 'Hours & address',
    iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
  },
  {
    id: '5', label: 'Customers', subLabel: 'View all users',
    iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  },
  {
    id: '6', label: 'Site settings', subLabel: 'Logo, links, SEO',
    iconPath: 'M12 1v4M12 19v4',
  },
];

// ─── Weekly Visits Data ────────────────────────────────────────────────────────
export const weeklyVisitsData: WeeklyVisit[] = [
  { day: 'Mon', chennai: 680, bangalore: 520, total: 1200 },
  { day: 'Tue', chennai: 750, bangalore: 580, total: 1330 },
  { day: 'Wed', chennai: 820, bangalore: 640, total: 1460 },
  { day: 'Thu', chennai: 710, bangalore: 555, total: 1265 },
  { day: 'Fri', chennai: 900, bangalore: 700, total: 1600 },
  { day: 'Sat', chennai: 980, bangalore: 790, total: 1770 },
  { day: 'Sun', chennai: 851, bangalore: 666, total: 1517 },
];
