// ─── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeSoft?: boolean;
  section?: string;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export type TrendDirection = 'up' | 'down' | 'neutral';
export type IconVariant = 'orange' | 'green' | 'blue' | 'red' | 'purple';

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  trend: string;
  trendDir: TrendDirection;
  subText: string;
  iconVariant: IconVariant;
  chartType: 'bar' | 'donut' | 'none';
}

// ─── Menu Items ────────────────────────────────────────────────────────────────
export type VegStatus = 'veg' | 'non-veg';
export type VisibilityStatus = 'visible' | 'hidden';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  price: number;
  vegStatus: VegStatus;
  visibility: VisibilityStatus;
}

// ─── Categories ────────────────────────────────────────────────────────────────
export interface MenuCategory {
  id: string;
  label: string;
  count: number | string;
  isActive: boolean;
}

// ─── Stores ────────────────────────────────────────────────────────────────────
export type StoreStatus = 'open' | 'closed';

export interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  status: StoreStatus;
}

// ─── Activity ──────────────────────────────────────────────────────────────────
export type ActivityColor = 'orange' | 'green' | 'neutral' | 'purple' | 'blue';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  color: ActivityColor;
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────
export interface QuickAction {
  id: string;
  label: string;
  subLabel: string;
  iconPath: string;
}

// ─── Chart Data ────────────────────────────────────────────────────────────────
export interface WeeklyVisit {
  day: string;
  chennai: number;
  bangalore: number;
  total: number;
}

// ─── Users & Permissions ───────────────────────────────────────────────────────
export type RolePreset = 'Store Manager' | 'Content Editor' | 'Support Agent' | 'Custom';

export interface PermissionSet {
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModuleRow {
  name: string;
  perms: PermissionSet;
  viewOnly?: boolean;
}

/** Serialisable permission module — no React nodes. Used in API payloads & UserData. */
export interface ModulePerms {
  id: string;
  name: string;
  iconBg: string;
  rows: ModuleRow[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  rolePreset: RolePreset;
  avatarColor: string;
  initials: string;
  permissions: ModulePerms[];
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  isGoogle: boolean;
  active: boolean;
}
