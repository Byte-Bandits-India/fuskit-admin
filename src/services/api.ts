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
