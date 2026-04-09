import type { UserData, ModulePerms } from '@/types';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('fuskit_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      `Cannot connect to the server (${BASE_URL}). ` +
      `Make sure the backend is running.`
    );
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(message);
  }

  // 204 No Content or empty body
  const contentLength = res.headers.get('content-length');
  if (res.status === 204 || contentLength === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /auth/login
   * Login with email + password. Returns accessToken.
   */
  login: (email: string, password: string) =>
    request<{ accessToken: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * POST /auth/google
   * Login with Google SSO. Returns accessToken.
   */
  googleLogin: (credential: string) =>
    request<{ accessToken: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  /**
   * GET /auth/me
   * Returns the currently authenticated user.
   */
  getMe: () => request<UserData>('/auth/me'),
};

// ─── Users API ────────────────────────────────────────────────────────────────
export interface InviteUserPayload {
  name: string;
  email: string;
  role: string;
  rolePreset: string;
  avatarColor: string;
  initials?: string;
  permissions?: ModulePerms[];
}

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
}

export const usersApi = {
  /**
   * GET /users
   * Returns list of UserData. Optional query params for filtering.
   */
  list: (params?: ListUsersParams) => {
    const entries = Object.entries(params ?? {}).filter(
      ([, v]) => v !== undefined
    ) as [string, string][];
    const qs = entries.length
      ? '?' + new URLSearchParams(entries).toString()
      : '';
    return request<UserData[]>(`/users${qs}`);
  },

  /**
   * GET /users/:id
   */
  get: (id: string) => request<UserData>(`/users/${id}`),

  /**
   * POST /users
   * Invites a new user — backend sends email invitation.
   */
  invite: (data: InviteUserPayload) =>
    request<UserData>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT /users/:id
   * Updates name, role, active status, or permissions matrix.
   */
  update: (id: string, data: Partial<Omit<UserData, 'id'>>) =>
    request<UserData>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE /users/:id
   */
  delete: (id: string) =>
    request<void>(`/users/${id}`, { method: 'DELETE' }),

  /**
   * POST /users/:id/resend-invite
   * Resends invite email to a pending user.
   */
  resendInvite: (id: string) =>
    request<void>(`/users/${id}/resend-invite`, { method: 'POST' }),
};

// ────────────────────────────────────────────────────────────────────────────
// Categories API
// ────────────────────────────────────────────────────────────────────────────

export interface CategoryDTO {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  itemCount: number;
  type: string;
  visible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryMeta {
  total: number;
  visible: number;
  hidden: number;
  totalItems: number;
}

export interface CategoryListResponse {
  data: CategoryDTO[];
  meta: CategoryMeta;
}

export interface CreateCategoryPayload {
  name: string;
  emoji: string;
  bgColor?: string;
  type?: string;
  visible?: boolean;
  displayOrder?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface ReorderItem {
  id: string;
  displayOrder: number;
}

export interface ListCategoriesParams {
  q?: string;
  visible?: boolean;
  sortBy?: 'order' | 'name' | 'items' | 'recent';
  page?: number;
  pageSize?: number;
}

function buildQS(params: any): string {
  const entries = Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== '');
  return entries.length ? '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString() : '';
}

export const categoriesApi = {
  /**
   * GET /categories — list with optional filters
   */
  list: (params?: ListCategoriesParams) =>
    request<CategoryListResponse>(`/categories${buildQS(params ?? {})}`) ,

  /**
   * POST /categories — create new category
   */
  create: (data: CreateCategoryPayload) =>
    request<{ data: CategoryDTO }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT /categories/:id — full or partial update (includes visibility toggle)
   */
  update: (id: string, data: UpdateCategoryPayload) =>
    request<{ data: CategoryDTO }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE /categories/:id — will 409 if category has items
   */
  delete: (id: string) =>
    request<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),

  /**
   * PATCH /categories/reorder — batch update displayOrder
   */
  reorder: (order: ReorderItem[]) =>
    request<{ message: string }>('/categories/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ order }),
    }),
};

// ────────────────────────────────────────────────────────────────────────────
// Menu Items API
// ────────────────────────────────────────────────────────────────────────────

export interface MenuItemDTO {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  categoryId: string;
  categoryName: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number | null;
  isVeg: boolean;
  visible: boolean;
  stores: string[];
  storeSpecial: string | null;
  badges: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemMeta {
  total: number;
  visible: number;
  hidden: number;
  bestsellers: number;
  discounted: number;
}

export interface MenuItemListResponse {
  data: MenuItemDTO[];
  meta: MenuItemMeta;
}

export interface CreateMenuItemPayload {
  name: string;
  description?: string;
  emoji: string;
  bgColor?: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isVeg?: boolean;
  visible?: boolean;
  stores: string[];
  storeSpecial?: string;
  badges?: string[];
  displayOrder?: number;
}

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>;

export interface ListMenuItemsParams {
  q?: string;
  category?: string;
  store?: string;
  visible?: boolean;
  badge?: string;
  isVeg?: boolean;
  sortBy?: 'default' | 'price-low' | 'price-high' | 'name' | 'recent';
  page?: number;
  pageSize?: number;
}

export const menuItemsApi = {
  /**
   * GET /menu-items — list with optional filters
   */
  list: (params?: ListMenuItemsParams) =>
    request<MenuItemListResponse>(`/menu-items${buildQS(params ?? {})}`),

  /**
   * POST /menu-items — create a new menu item
   */
  create: (data: CreateMenuItemPayload) =>
    request<{ data: MenuItemDTO }>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT /menu-items/:id — full or partial update (includes visibility toggle)
   */
  update: (id: string, data: UpdateMenuItemPayload) =>
    request<{ data: MenuItemDTO }>(`/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE /menu-items/:id
   */
  delete: (id: string) =>
    request<{ message: string }>(`/menu-items/${id}`, { method: 'DELETE' }),

  /**
   * GET /menu-items/export — triggers a CSV file download in the browser
   */
  export: async (params?: ListMenuItemsParams) => {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${BASE_URL}/menu-items/export${buildQS(params ?? {})}`, { headers });
    if (!res.ok) throw new Error(`Export failed (${res.status})`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cd = res.headers.get('content-disposition');
    a.download = cd?.match(/filename="?([^"]+)"?/)?.[1] ?? 'menu-items.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
};

// ────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// Stores API
// ────────────────────────────────────────────────────────────────────────────

export interface StoreExclusiveItemDTO {
  emoji: string;
  name: string;
  price: string;
}

export interface StoreHoursDTO {
  open: string;
  close: string;
  closed: boolean;
}

export interface StoreDTO {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  mapsLink: string;
  mapsEmbed?: string;
  managerName?: string;
  managerPhone?: string;
  hours: Record<string, StoreHoursDTO>;
  enabled: boolean;
  temporarilyClosed: boolean;
  exclusiveItems: StoreExclusiveItemDTO[];
  gallery: string[];
  rating?: number;
  reviewCount?: number;
  menuItemCount?: number;
  exclusiveItemCount?: number;
  foundedYear?: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreMeta {
  total: number;
  open: number;
  closed: number;
  totalMenuItems: number;
  totalExclusiveItems: number;
}

export interface StoreListResponse {
  data: StoreDTO[];
  meta: StoreMeta;
}

export interface CreateStorePayload {
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  mapsLink: string;
  mapsEmbed?: string;
  managerName?: string;
  managerPhone?: string;
  hours: Record<string, StoreHoursDTO>;
  enabled?: boolean;
  exclusiveItems?: StoreExclusiveItemDTO[];
  gallery?: string[];
  rating?: number | null;
  reviewCount?: number;
  foundedYear?: number | null;
  displayOrder?: number;
}

export type UpdateStorePayload = Partial<CreateStorePayload> & { temporarilyClosed?: boolean };

export interface ListStoresParams {
  q?: string;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
}

export const storesApi = {
  list: (params?: ListStoresParams) => 
    request<StoreListResponse>(`/stores${buildQS(params ?? {})}`),
  
  get: (id: string) => 
    request<{ data: StoreDTO }>(`/stores/${id}`),

  create: (data: CreateStorePayload) => 
    request<{ data: StoreDTO }>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateStorePayload) => 
    request<{ data: StoreDTO }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) => 
    request<{ message: string }>(`/stores/${id}`, { method: 'DELETE' }),

  addExclusiveItem: (id: string, item: StoreExclusiveItemDTO) => 
    request<{ data: StoreDTO }>(`/stores/${id}/exclusive-items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  removeExclusiveItem: (id: string, index: number) => 
    request<{ data: StoreDTO }>(`/stores/${id}/exclusive-items/${index}`, { method: 'DELETE' }),

  addGalleryPhoto: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(`${BASE_URL}/stores/${id}/gallery`, { method: 'POST', headers, body: formData })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to upload photo');
        return (await res.json()) as { data: { url: string, store: StoreDTO } };
      });
  },

  removeGalleryPhoto: (id: string, index: number) => 
    request<{ data: StoreDTO }>(`/stores/${id}/gallery/${index}`, { method: 'DELETE' }),

  getAnalytics: (id: string, period = 'week') => 
    request<{ data: any }>(`/stores/${id}/analytics?period=${period}`)
};

// ────────────────────────────────────────────────────────────────────────────
// Banners API
// ────────────────────────────────────────────────────────────────────────────

export interface BannerDTO {
  id: string;
  name: string;
  type: 'hero' | 'menu' | 'announcement' | 'popup';
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  emoji: string;
  thumbBg: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  schedule: string;
  scheduleEnabled: boolean;
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  enabled: boolean;
  order: number;
  altText?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerMeta {
  total: number;
  active: number;
  scheduled: number;
  inactive: number;
  types: number;
}

export interface BannerListResponse {
  data: BannerDTO[];
  meta: BannerMeta;
}

export interface ListBannersParams {
  q?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export const bannersApi = {
  list: (params?: ListBannersParams) => 
    request<BannerListResponse>(`/banners${buildQS(params ?? {})}`),

  get: (id: string) => 
    request<{ data: BannerDTO }>(`/banners/${id}`),

  create: (formData: FormData) => {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(`${BASE_URL}/banners`, { method: 'POST', headers, body: formData })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to create banner');
        return (await res.json()) as { data: BannerDTO };
      });
  },

  update: (id: string, formData: FormData) => {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(`${BASE_URL}/banners/${id}`, { method: 'PUT', headers, body: formData })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to update banner');
        return (await res.json()) as { data: BannerDTO };
      });
  },
  
  updatePartial: (id: string, data: Partial<BannerDTO>) => {
    // Backend PUT /banners/:id expects multipart/form-data (for image support).
    // For partial JSON-only updates (e.g. enable toggle) we wrap in FormData so
    // the backend can coerce boolean strings ("true"/"false") correctly.
    const token = getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    return fetch(`${BASE_URL}/banners/${id}`, { method: 'PUT', headers, body: fd })
      .then(async res => {
        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try { const b = await res.json() as any; msg = b.message ?? b.error ?? msg; } catch { /* ignore */ }
          throw new Error(msg);
        }
        return (await res.json()) as { data: BannerDTO };
      });
  },

  delete: (id: string) => 
    request<{ message: string }>(`/banners/${id}`, { method: 'DELETE' }),

  reorder: (order: ReorderItem[]) => 
    request<{ message: string }>('/banners/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ order }),
    }),
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────────
export interface DashboardStats {
  categories: { total: number; hidden: number; change: number };
  menuItems: { total: number; hidden: number; change: number };
  stores: { total: number; names: string[] };
  users: { total: number; changePercent: number };
  pageVisits: { total: number; changePercent: number };
}

export const dashboardApi = {
  stats: () => request<{ data: DashboardStats }>('/dashboard/stats').then(res => res.data),
};

// ─── Announcements ─────────────────────────────────────────────────────────────
export interface AnnouncementDTO {
  id: string;
  text: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const announcementsApi = {
  list: () => request<{ data: AnnouncementDTO[] }>('/announcements'),
  create: (data: { text: string; enabled?: boolean }) => 
    request<{ data: AnnouncementDTO }>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string, data: Partial<AnnouncementDTO>) => 
    request<{ data: AnnouncementDTO }>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
};

// ─── Analytics ─────────────────────────────────────────────────────────────
export interface PageVisitsResponse {
  total: number;
  changePercent: number;
  series: { day: string; visits: number }[];
}

export interface StoreVisitsResponse {
  stores: { name: string; total: number; series: number[] }[];
  days: string[];
}

export const analyticsApi = {
  pageVisits: (range?: string) => 
    request<PageVisitsResponse>(`/analytics/page-visits${range ? `?range=${range}` : ''}`),
  storeVisits: (range?: string) => 
    request<StoreVisitsResponse>(`/analytics/store-visits${range ? `?range=${range}` : ''}`)
};

// ─── Activity ─────────────────────────────────────────────────────────────
export interface ActivityItemDTO {
  id: string;
  title: string;
  description: string;
  time: string;
  color: 'orange' | 'green' | 'neutral' | 'purple' | 'blue';
}

export const activityApi = {
  list: () => request<{ data: ActivityItemDTO[] }>('/activity'),
};

// ─── Notifications ─────────────────────────────────────────────────────────────
export interface NotificationDTO {
  id: string;
  title: string;
  description: string;
  type: string;
  read: boolean;
  time: string; // From createdAt
}

export const notificationsApi = {
  list: () => request<{ data: NotificationDTO[] }>('/notifications'),
  unreadCount: () => request<{ count: number }>('/notifications/unread-count'),
  markRead: (id: string) => request<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request<{ message: string }>('/notifications/mark-all-read', { method: 'PATCH' })
};

