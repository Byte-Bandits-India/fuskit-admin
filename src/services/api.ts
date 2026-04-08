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
    request<{ accessToken: string }>('/auth/login', {
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
// Stores API
// ────────────────────────────────────────────────────────────────────────────

export interface StoreDTO {
  id: string;
  name: string;
}

export const storesApi = {
  /**
   * GET /stores — list all stores
   */
  list: () => request<{ data: StoreDTO[] }>('/stores'),
};
