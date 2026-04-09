# FUSK IT Admin — Backend API Specification
## Modules: Manage Stores & Banner Settings

> [!NOTE]
> **Implementation Status: ✅ FULLY IMPLEMENTED**
> These specifications have been successfully implemented in the backend application:
> - `Store` and `Banner` schema models are populated and migrated.
> - Full CRUD APIs with cascade rules and specific JSON/array sub-resource functions exist.
> - Image uploads via Multer + Sharp exist for both Stores and Banners.
> - All APIs are secured behind module-based permission checks (`stores`, `banners`).

> **Derived from:** `ManageStoresPage.tsx`, `StoreDrawer.tsx`, `BannerSettingsPage.tsx`, `BannerDrawer.tsx` frontend source code  
> **Base URL:** `{{base_url}}` = `http://localhost:4000/api`  
> **Auth:** All endpoints require `Authorization: Bearer <token>` (JWT from `/auth/login`)  
> **Permission module IDs:** `stores` and `banners` (as defined in the auth/roles spec)  
> **Follows conventions from:** `backend_spec_categories_menuitems.md`

---

## Table of Contents

1. [Store Data Model](#1-store-data-model)
2. [Store API Endpoints](#2-store-api-endpoints)
3. [Banner Data Model](#3-banner-data-model)
4. [Banner API Endpoints](#4-banner-api-endpoints)
5. [Image Upload Strategy](#5-image-upload-strategy)
6. [Database Schema (Prisma)](#6-database-schema-prisma)
7. [Business Rules & Validation](#7-business-rules--validation)
8. [Error Responses](#8-error-responses)
9. [Postman Collection Additions](#9-postman-collection-additions)
10. [Summary: What the Frontend Needs from the Backend](#10-summary-what-the-frontend-needs-from-the-backend)

---

## 1. Store Data Model

Derived from the `Store` interface in `StoreDrawer.tsx` and data usage in `ManageStoresPage.tsx`:

### Frontend Interface (Source of Truth)

```typescript
// From StoreDrawer.tsx
interface ExclusiveItem {
  emoji: string;       // Single emoji, e.g. "🍗"
  name: string;        // Item display name, e.g. "Kozhi Butter Bun"
  price: string;       // Price string with ₹ symbol, e.g. "₹199"
}

interface Store {
  id: string;                 // Unique ID, e.g. "chennai"
  name: string;               // Display name, e.g. "Chennai — ECR"
  city: string;               // City name, e.g. "Chennai"
  state: string;              // State/country, e.g. "Tamil Nadu, India"
  address: string;            // Full address text
  phone: string;              // Primary phone, e.g. "+91 98765 43210"
  whatsapp?: string;          // WhatsApp number (optional)
  email?: string;             // Store email (optional)
  mapsLink: string;           // Google Maps share URL
  mapsEmbed?: string;         // Google Maps iframe embed code (optional)
  managerName?: string;       // Store manager name
  managerPhone?: string;      // Store manager phone
  hours: Record<string, {     // Operating hours keyed by day abbreviation
    open: string;             // e.g. "10am"
    close: string;            // e.g. "12am"
    closed: boolean;          // true = closed that day
  }>;
  enabled: boolean;           // Whether store is visible on the website
  exclusiveItems: ExclusiveItem[];  // Store-exclusive menu items
  gallery: string[];          // Store photos (currently emojis in mock, will be image URLs)
}
```

### Additional Frontend State (from ManageStoresPage.tsx)

The frontend also manages these data points that need backend support:

| Data Point | Source | Backend Need |
|-----------|--------|-------------|
| `tempClosed` | Local state toggle | A `temporarilyClosed` boolean field on the store |
| `VISIT_DATA` | Hard-coded mock | A `GET /api/stores/:id/analytics` endpoint or a `visits` field |
| Stats strip values | Computed from stores | `meta` object in list response |
| Quick stats (Rating, Reviews, Menu items, Exclusives, Founded) | Hard-coded in hero card | Additional store fields |

### API Response Shape (`StoreDTO`)

```json
{
  "id": "store_abc123",
  "name": "Chennai — ECR",
  "city": "Chennai",
  "state": "Tamil Nadu, India",
  "address": "Sea Cliff Conclave, Akkarai, Panaiyur, Chennai — East Coast Road, Tamil Nadu 600119",
  "phone": "+91 98765 43210",
  "whatsapp": "+91 98765 43210",
  "email": "chennai@fusk-it.com",
  "mapsLink": "https://maps.google.com/fusk-it-chennai",
  "mapsEmbed": null,
  "managerName": "Sheriff Ahmed",
  "managerPhone": "+91 98765 43210",
  "hours": {
    "Mon": { "open": "10am", "close": "12am", "closed": false },
    "Tue": { "open": "10am", "close": "12am", "closed": false },
    "Wed": { "open": "10am", "close": "12am", "closed": false },
    "Thu": { "open": "10am", "close": "12am", "closed": false },
    "Fri": { "open": "10am", "close": "12am", "closed": false },
    "Sat": { "open": "10am", "close": "1am", "closed": false },
    "Sun": { "open": "10am", "close": "1am", "closed": false }
  },
  "enabled": true,
  "temporarilyClosed": false,
  "exclusiveItems": [
    { "emoji": "🍗", "name": "Kozhi Butter Bun", "price": "₹199" },
    { "emoji": "🌶️", "name": "Spicy Mutta Bun", "price": "₹169" }
  ],
  "gallery": [
    "https://storage.fusk-it.com/stores/chennai/photo-1.webp",
    "https://storage.fusk-it.com/stores/chennai/photo-2.webp"
  ],
  "rating": 4.3,
  "reviewCount": 488,
  "menuItemCount": 36,
  "exclusiveItemCount": 2,
  "foundedYear": 2004,
  "displayOrder": 1,
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-04-08T09:00:00Z"
}
```

> [!IMPORTANT]
> **`menuItemCount`** is a **computed field** — it is the COUNT of `MenuItem` records where `stores` JSON array contains this store's `name`. Do NOT store this as a column.

> [!IMPORTANT]
> **`exclusiveItemCount`** is the LENGTH of the `exclusiveItems` JSON array — computed on read.

### Hours Format

The `hours` object uses **3-letter day abbreviations** as keys (`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`) with the following value shape:

```typescript
{
  open: string;    // e.g. "10am", "11am", "12pm" — human-readable time string
  close: string;   // e.g. "12am", "11pm", "1am"  — can span midnight
  closed: boolean; // true = this day is closed
}
```

> **Note:** The frontend renders these strings directly. The backend should store and return them as-is (not as 24-hour timestamps). Validation should ensure valid time format (e.g. regex for `\d{1,2}(am|pm)`).

---

## 2. Store API Endpoints

> [!NOTE]
> The existing backend has a **minimal** `GET /api/stores` endpoint that returns `[{ id, name }]`. This needs to be **expanded** into a full CRUD API with the rich `StoreDTO` shape.

### 2.1 `GET /api/stores` — List All Stores

Used by `ManageStoresPage` on mount to populate the store tabs and detail view.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by name or city (case-insensitive, partial match) |
| `enabled` | boolean | — | Filter: `true` = open only, `false` = hidden only |
| `page` | number | `1` | Page number (optional pagination) |
| `pageSize` | number | `50` | Items per page |

**Success Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "store_abc123",
      "name": "Chennai — ECR",
      "city": "Chennai",
      "state": "Tamil Nadu, India",
      "address": "Sea Cliff Conclave, Akkarai...",
      "phone": "+91 98765 43210",
      "whatsapp": "+91 98765 43210",
      "email": "chennai@fusk-it.com",
      "mapsLink": "https://maps.google.com/fusk-it-chennai",
      "mapsEmbed": null,
      "managerName": "Sheriff Ahmed",
      "managerPhone": "+91 98765 43210",
      "hours": { ... },
      "enabled": true,
      "temporarilyClosed": false,
      "exclusiveItems": [ ... ],
      "gallery": [ ... ],
      "rating": 4.3,
      "reviewCount": 488,
      "menuItemCount": 36,
      "exclusiveItemCount": 2,
      "foundedYear": 2004,
      "displayOrder": 1,
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-04-08T09:00:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "open": 2,
    "closed": 0,
    "totalMenuItems": 38,
    "totalExclusiveItems": 4
  }
}
```

> **`meta` object powers the Stats Strip in the frontend:**
> - `meta.total` → "Total stores" stat card
> - `meta.open` → "Open now" stat card (stores where `enabled === true`)
> - `meta.totalMenuItems` → "Total menu items" stat card
> - `meta.totalExclusiveItems` → "Exclusive items total" stat card

---

### 2.2 `GET /api/stores/:id` — Get Single Store

Used when the frontend needs to fetch/refresh a single store's full data (e.g. after an edit).

**Success Response `200 OK`:**

```json
{
  "data": {
    "id": "store_abc123",
    "name": "Chennai — ECR",
    ...full StoreDTO...
  }
}
```

**Error `404 Not Found`:**
```json
{
  "error": "Store not found",
  "code": "NOT_FOUND"
}
```

---

### 2.3 `POST /api/stores` — Create Store

Triggered when the user clicks **"Add Store"** / **"Add New Store"** and submits the `StoreDrawer` form.

**Request Body:**

```json
{
  "name": "Hyderabad — Jubilee Hills",
  "city": "Hyderabad",
  "state": "Telangana, India",
  "address": "456 Jubilee Hills Road #5, Hyderabad, Telangana 500033",
  "phone": "+91 98765 43212",
  "whatsapp": "+91 98765 43212",
  "email": "hyderabad@fusk-it.com",
  "mapsLink": "https://maps.google.com/fusk-it-hyderabad",
  "mapsEmbed": "<iframe src='...'></iframe>",
  "managerName": "Raj Patel",
  "managerPhone": "+91 98765 43212",
  "hours": {
    "Mon": { "open": "10am", "close": "11pm", "closed": false },
    "Tue": { "open": "10am", "close": "11pm", "closed": false },
    "Wed": { "open": "10am", "close": "11pm", "closed": false },
    "Thu": { "open": "10am", "close": "11pm", "closed": false },
    "Fri": { "open": "10am", "close": "12am", "closed": false },
    "Sat": { "open": "10am", "close": "12am", "closed": false },
    "Sun": { "open": "10am", "close": "11pm", "closed": false }
  },
  "enabled": true,
  "exclusiveItems": [],
  "gallery": [],
  "rating": null,
  "reviewCount": 0,
  "foundedYear": 2026
}
```

**Field Validation:**

| Field | Required | Validation |
|-------|----------|------------|
| `name` | ✅ Yes | Non-empty, max 120 chars, **unique** (case-insensitive) |
| `city` | ✅ Yes | Non-empty, max 60 chars |
| `state` | ✅ Yes | Non-empty, max 100 chars |
| `address` | ✅ Yes | Non-empty, max 500 chars |
| `phone` | ✅ Yes | Non-empty, valid phone pattern (starts with `+`) |
| `whatsapp` | ❌ No | Valid phone pattern if provided |
| `email` | ❌ No | Valid email format if provided |
| `mapsLink` | ✅ Yes | Valid URL (must start with `http(s)://`) |
| `mapsEmbed` | ❌ No | Free-text string (iframe HTML) |
| `managerName` | ❌ No | Max 120 chars |
| `managerPhone` | ❌ No | Valid phone pattern if provided |
| `hours` | ✅ Yes | Valid JSON object with all 7 day keys (`Mon`–`Sun`), each having `open`, `close`, `closed` |
| `enabled` | ❌ No | Defaults to `true` |
| `exclusiveItems` | ❌ No | Array of `{ emoji, name, price }` objects; defaults to `[]` |
| `gallery` | ❌ No | Array of URL strings; defaults to `[]` |
| `rating` | ❌ No | Number 0–5 or `null` |
| `reviewCount` | ❌ No | Non-negative integer; defaults to `0` |
| `foundedYear` | ❌ No | 4-digit year integer or `null` |
| `displayOrder` | ❌ No | If not provided, auto-assign `max(displayOrder) + 1` |

**Success Response `201 Created`:**

```json
{
  "data": {
    "id": "store_xyz789",
    "name": "Hyderabad — Jubilee Hills",
    ...full StoreDTO...
  }
}
```

---

### 2.4 `PUT /api/stores/:id` — Update Store

Triggered when the user edits a store from the drawer (via "Edit store" button) or toggles a status control.

**Request Body** (all fields optional — partial update):

```json
{
  "name": "Chennai — ECR, Akkarai",
  "enabled": false,
  "temporarilyClosed": true,
  "hours": { ... },
  "managerName": "New Manager"
}
```

> [!IMPORTANT]
> **Key partial update scenarios the frontend uses:**
> - **"Show on website" toggle:** `{ "enabled": false }`
> - **"Mark as temporarily closed" toggle:** `{ "temporarilyClosed": true }`
> - **Full edit from drawer:** sends all changed fields

**Success Response `200 OK`:**

```json
{
  "data": {
    "id": "store_abc123",
    ...full updated StoreDTO...
  }
}
```

---

### 2.5 `DELETE /api/stores/:id` — Delete Store

Triggered from the "Danger zone → Delete this store" button + `DeleteModal` confirmation.

> [!WARNING]
> **Business Rule:** If menu items reference this store in their `stores[]` array, the backend should:
> - **Option A (Recommended):** Remove the store name from all `MenuItem.stores[]` arrays, then delete the store.
> - **Option B:** Reject with `409 Conflict` if menu items reference this store.

**Success Response `200 OK`:**

```json
{
  "message": "Store deleted successfully"
}
```

---

### 2.6 `POST /api/stores/:id/exclusive-items` — Add Exclusive Item

Triggered when the user clicks "Add exclusive" in the exclusive items section.

**Request Body:**

```json
{
  "emoji": "🍔",
  "name": "Spicy Wrap",
  "price": "₹149"
}
```

| Field | Required | Validation |
|-------|----------|------------|
| `emoji` | ✅ Yes | Single emoji character |
| `name` | ✅ Yes | Non-empty, max 120 chars |
| `price` | ✅ Yes | Non-empty string (frontend sends formatted, e.g. "₹149") |

**Success Response `201 Created`:**

```json
{
  "data": {
    ...full updated StoreDTO with new item in exclusiveItems array...
  }
}
```

> **Alternative design:** Exclusive items could be managed purely through `PUT /api/stores/:id` by sending the full updated `exclusiveItems` array. This is simpler but less RESTful.

---

### 2.7 `DELETE /api/stores/:id/exclusive-items/:index` — Remove Exclusive Item

Triggered when the user clicks the `✕` button on an exclusive item card.

**Success Response `200 OK`:**

```json
{
  "data": {
    ...full updated StoreDTO with item removed from exclusiveItems array...
  }
}
```

> **Alternative:** Use `PUT /api/stores/:id` with the exclusiveItems array minus the removed item.

---

### 2.8 `POST /api/stores/:id/gallery` — Add Gallery Photo

Triggered when the user clicks "Add" in the gallery section. The frontend currently uses emojis as placeholders; in production this will be an **image upload**.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `image` | File | Image file (PNG, JPG, WebP) — Max 5MB |

**Success Response `201 Created`:**

```json
{
  "data": {
    "url": "https://storage.fusk-it.com/stores/chennai/photo-3.webp",
    "store": { ...full updated StoreDTO... }
  }
}
```

---

### 2.9 `DELETE /api/stores/:id/gallery/:index` — Remove Gallery Photo

Triggered when the user clicks `✕` on a gallery photo.

**Success Response `200 OK`:**

```json
{
  "data": {
    ...full updated StoreDTO with photo removed from gallery array...
  }
}
```

---

### 2.10 `GET /api/stores/:id/analytics` — Store Page Visits *(Optional / Phase 2)*

Used by the "Store page visits" card in the right column of `ManageStoresPage`.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | `"week"` | `"week"`, `"month"`, `"year"` |

**Success Response `200 OK`:**

```json
{
  "data": {
    "total": "4,891",
    "change": "+12%",
    "changePeriod": "vs last week",
    "bars": [55, 65, 80, 60, 90, 100, 85],
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  }
}
```

> [!NOTE]
> This endpoint is optional for initial implementation. The frontend currently has hard-coded data. Implement when analytics tracking is set up.

---

## 3. Banner Data Model

Derived from the `Banner` interface in `BannerSettingsPage.tsx` and form fields in `BannerDrawer.tsx`:

### Frontend Interface (Source of Truth)

```typescript
// From BannerSettingsPage.tsx
type BannerType = 'hero' | 'menu' | 'announcement' | 'popup';
type BannerStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

interface Banner {
  id: string;            // Unique ID
  name: string;          // Internal name (admin-only), e.g. "Homepage Hero — Buns Season"
  type: BannerType;      // One of: hero, menu, announcement, popup
  status: BannerStatus;  // Computed from schedule + enabled state
  emoji: string;         // Thumbnail emoji for admin list
  thumbBg: string;       // Thumbnail background (CSS gradient or color)
  title: string;         // Public-facing headline text
  subtitle?: string;     // Public-facing subtitle text (optional)
  ctaLabel?: string;     // CTA button label, e.g. "Explore Menu →"
  ctaLink?: string;      // CTA button URL, e.g. "/menu/buns"
  schedule: string;      // Human-readable schedule text (computed by backend)
  enabled: boolean;      // Master on/off toggle
  order: number;         // Display order (lower = shown first)
  altText?: string;      // Image alt text for SEO
}
```

### Additional Fields from BannerDrawer.tsx

The drawer form collects these additional fields NOT in the list interface:

```typescript
// Schedule fields from BannerDrawer
{
  scheduleEnabled: boolean;  // Whether scheduling is active
  startDate: string;         // ISO date string, e.g. "2026-06-01"
  startTime: string;         // Time string, e.g. "00:00"
  endDate: string;           // ISO date string (optional, no end = runs forever)
  endTime: string;           // Time string, e.g. "23:59"
}

// Image fields from BannerDrawer
{
  desktopImage: File;        // Desktop banner image (1920×600px recommended)
  mobileImage: File;         // Mobile banner image (768×500px, optional)
}
```

### API Response Shape (`BannerDTO`)

```json
{
  "id": "banner_abc123",
  "name": "Homepage Hero — Buns Season",
  "type": "hero",
  "status": "active",
  "emoji": "🥐",
  "thumbBg": "linear-gradient(135deg,#1C0F05,#3B2010)",
  "title": "Fusk boring desserts.",
  "subtitle": "Bold buns, signature drinks & indulgent treats.",
  "ctaLabel": "Explore Menu →",
  "ctaLink": "/menu/buns",
  "desktopImageUrl": "https://storage.fusk-it.com/banners/hero-buns-desktop.webp",
  "mobileImageUrl": "https://storage.fusk-it.com/banners/hero-buns-mobile.webp",
  "schedule": "Live now · No end date",
  "scheduleEnabled": true,
  "startDate": null,
  "startTime": null,
  "endDate": null,
  "endTime": null,
  "enabled": true,
  "order": 1,
  "altText": "Fusk-it homepage hero — bold bun desserts Chennai",
  "displayOrder": 1,
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-04-08T09:00:00Z"
}
```

> [!IMPORTANT]
> **`status` is a COMPUTED field** — the backend must derive it from `enabled`, `startDate`, `endDate`, and the current timestamp:
> 
> | Condition | Status |
> |-----------|--------|
> | `enabled === false` | `"inactive"` |
> | `enabled === true` AND `startDate` is in the future | `"scheduled"` |
> | `enabled === true` AND `endDate` is in the past | `"expired"` |
> | `enabled === true` AND within the schedule window (or no schedule) | `"active"` |

> [!IMPORTANT]
> **`schedule` is a COMPUTED string** — the backend should generate a human-readable schedule string:
> 
> | Scenario | Example Output |
> |----------|---------------|
> | No schedule dates set | `"Live now · No end date"` |
> | Start date in the future, no end date | `"Starts 1 Jun 2026"` |
> | Start date in the future, has end date | `"Starts 1 Jun · Ends 30 Jun 2026"` |
> | Currently active, has end date | `"Live · Ends 30 Jun 2026"` |
> | End date is in the past | `"Ended 1 Apr 2026"` |
> | Expired | `"Expired 1 Mar 2026"` |

### Banner Types (Enum)

| Type | Description | Frontend Preview |
|------|-------------|-----------------|
| `"hero"` | Full-width homepage banner with gradient background | Dark gradient with title, subtitle, CTA button |
| `"menu"` | Banner inside menu/category sections | Card style with emoji, title, subtitle, CTA |
| `"announcement"` | Top bar text strip | Orange bar with bold text |
| `"popup"` | Modal overlay on page load | White card with emoji, title, subtitle, CTA, dismiss option |

---

## 4. Banner API Endpoints

### 4.1 `GET /api/banners` — List All Banners

Used by `BannerSettingsPage` on mount to populate the banner list and stats.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by `name` (case-insensitive, partial match) |
| `status` | string | — | Filter by status: `active`, `inactive`, `scheduled`, `expired` |
| `type` | string | — | Filter by type: `hero`, `menu`, `announcement`, `popup` |
| `sortBy` | string | `"order"` | One of: `order`, `name`, `recent` |
| `page` | number | `1` | Page number |
| `pageSize` | number | `50` | Items per page |

**Success Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "banner_abc123",
      "name": "Homepage Hero — Buns Season",
      "type": "hero",
      "status": "active",
      "emoji": "🥐",
      "thumbBg": "linear-gradient(135deg,#1C0F05,#3B2010)",
      "title": "Fusk boring desserts.",
      "subtitle": "Bold buns, signature drinks & indulgent treats.",
      "ctaLabel": "Explore Menu →",
      "ctaLink": "/menu/buns",
      "desktopImageUrl": "https://storage.fusk-it.com/banners/hero-buns-desktop.webp",
      "mobileImageUrl": null,
      "schedule": "Live now · No end date",
      "scheduleEnabled": false,
      "startDate": null,
      "startTime": null,
      "endDate": null,
      "endTime": null,
      "enabled": true,
      "order": 1,
      "altText": "Fusk-it homepage hero — bold bun desserts",
      "displayOrder": 1,
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-04-08T09:00:00Z"
    }
  ],
  "meta": {
    "total": 9,
    "active": 5,
    "scheduled": 2,
    "inactive": 2,
    "types": 4
  }
}
```

> **`meta` object powers the Stats Strip in `BannerSettingsPage`:**
> - `meta.total` → "Total banners" stat card (🖼️)
> - `meta.active` → "Active now" stat card (✅)
> - `meta.scheduled` → "Scheduled" stat card (⏰)
> - `meta.inactive` → "Inactive / Expired" stat card (🚫) — sum of `status=inactive` + `status=expired`
> - `meta.types` → "Banner types" stat card (📊) — count of distinct `type` values in use

---

### 4.2 `GET /api/banners/:id` — Get Single Banner

Used for fetching full banner details for the preview panel and edit drawer.

**Success Response `200 OK`:**

```json
{
  "data": {
    "id": "banner_abc123",
    ...full BannerDTO...
  }
}
```

---

### 4.3 `POST /api/banners` — Create Banner

Triggered when the user clicks **"Add Banner"** and submits the `BannerDrawer` form.

**Request:** `multipart/form-data` (because of image uploads)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Internal admin name, max 200 chars |
| `type` | string | ✅ Yes | One of: `hero`, `menu`, `announcement`, `popup` |
| `title` | string | ✅ Yes | Headline text, max 300 chars |
| `subtitle` | string | ❌ No | Subtitle text, max 500 chars |
| `emoji` | string | ❌ No | Single emoji for admin thumbnail; defaults to type-based default |
| `thumbBg` | string | ❌ No | CSS background for admin thumbnail; auto-assigned if not provided |
| `ctaLabel` | string | ❌ No | CTA button label, max 100 chars |
| `ctaLink` | string | ❌ No | CTA button URL/path, max 500 chars |
| `altText` | string | ❌ No | Image alt text for SEO, max 300 chars |
| `enabled` | boolean | ❌ No | Defaults to `true` |
| `order` | number | ❌ No | Display order; auto-assign `max + 1` if not provided |
| `scheduleEnabled` | boolean | ❌ No | Defaults to `false` (no schedule = live immediately) |
| `startDate` | string | ❌ No | ISO date string, e.g. `"2026-06-01"` |
| `startTime` | string | ❌ No | Time string, e.g. `"00:00"` |
| `endDate` | string | ❌ No | ISO date string (optional) |
| `endTime` | string | ❌ No | Time string, e.g. `"23:59"` |
| `desktopImage` | File | ❌ No | Desktop banner image (PNG, JPG, WebP) — Max 5MB |
| `mobileImage` | File | ❌ No | Mobile banner image (PNG, JPG, WebP) — Max 3MB |

**Success Response `201 Created`:**

```json
{
  "data": {
    "id": "banner_xyz789",
    "name": "Summer Special Offer",
    "type": "popup",
    "status": "scheduled",
    ...full BannerDTO...
  }
}
```

---

### 4.4 `PUT /api/banners/:id` — Update Banner

Triggered when the user edits a banner from the drawer or toggles the enable/disable switch.

**Request:** `multipart/form-data` (to support image updates)

All fields are optional — partial update supported.

> [!IMPORTANT]
> **Key partial update scenarios:**
> - **Enable/disable toggle:** `{ "enabled": false }` — the frontend's `Toggle` component on each banner card calls this
> - **Full edit from drawer:** sends all changed text fields + optionally new images

**Success Response `200 OK`:**

```json
{
  "data": {
    "id": "banner_abc123",
    ...full updated BannerDTO...
  }
}
```

---

### 4.5 `DELETE /api/banners/:id` — Delete Banner

Triggered when user confirms deletion in the `DeleteModal`.

**Success Response `200 OK`:**

```json
{
  "message": "Banner deleted successfully"
}
```

---

### 4.6 `PATCH /api/banners/reorder` — Reorder Banners *(Optional — for drag-and-drop)*

Batch-updates `displayOrder` for multiple banners.

**Request Body:**

```json
{
  "order": [
    { "id": "banner_abc123", "displayOrder": 1 },
    { "id": "banner_def456", "displayOrder": 2 },
    { "id": "banner_xyz789", "displayOrder": 3 }
  ]
}
```

**Success Response `200 OK`:**

```json
{
  "message": "Order updated successfully"
}
```

---

## 5. Image Upload Strategy

### Banner Images

| Image Type | Recommended Size | Max File Size | Formats |
|-----------|-----------------|---------------|---------|
| Desktop image | 1920×600px | 5MB | PNG, JPG, WebP |
| Mobile image | 768×500px | 3MB | PNG, JPG, WebP |

### Store Gallery Images

| Image Type | Recommended Size | Max File Size | Formats | Max Count |
|-----------|-----------------|---------------|---------|-----------|
| Store photo | 800×600px | 5MB | PNG, JPG, WebP | 8 per store |

### Storage Options

| Option | Recommendation |
|--------|---------------|
| **Local filesystem** | Good for development — store in `uploads/` directory |
| **Cloud storage (S3/GCS/Cloudflare R2)** | Recommended for production |
| **Database BLOB** | ❌ Not recommended |

### Upload Flow

```
1. Frontend sends multipart/form-data with file(s)
2. Backend validates file type + size
3. Backend generates unique filename (e.g. UUID + original extension)
4. Backend stores file to disk/cloud
5. Backend saves the URL in the database record
6. Backend returns the full URL in the response DTO
```

### URL Pattern

```
/uploads/banners/{banner_id}/{desktop|mobile}-{uuid}.webp
/uploads/stores/{store_id}/gallery/{uuid}.webp
/uploads/stores/{store_id}/gallery/{uuid}.webp
```

> [!TIP]
> Consider converting all uploads to WebP on the server side for consistent format and smaller file sizes.

---

## 6. Database Schema (Prisma)

```prisma
// ── Store (EXPANDED from the existing minimal store model) ──────────────────
model Store {
  id                String    @id @default(cuid())
  name              String    @unique
  city              String
  state             String
  address           String    @db.Text
  phone             String
  whatsapp          String?
  email             String?
  mapsLink          String    @db.Text
  mapsEmbed         String?   @db.Text
  managerName       String?
  managerPhone      String?
  hours             Json                          // { Mon: { open, close, closed }, ... }
  enabled           Boolean   @default(true)
  temporarilyClosed Boolean   @default(false)
  exclusiveItems    Json      @default("[]")      // [{ emoji, name, price }]
  gallery           Json      @default("[]")      // ["url1", "url2", ...]
  rating            Float?
  reviewCount       Int       @default(0)
  foundedYear       Int?
  displayOrder      Int       @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@map("stores")
}

// ── Banner ──────────────────────────────────────────────────────────────────
model Banner {
  id               String    @id @default(cuid())
  name             String                          // Internal admin name
  type             String                          // "hero" | "menu" | "announcement" | "popup"
  emoji            String    @default("🖼️")
  thumbBg          String    @default("#FFF3E0")    // CSS background for admin thumbnail
  title            String    @db.Text               // Headline text
  subtitle         String?   @db.Text
  ctaLabel         String?
  ctaLink          String?
  desktopImageUrl  String?   @db.Text
  mobileImageUrl   String?   @db.Text
  altText          String?   @db.Text               // SEO alt text
  enabled          Boolean   @default(true)
  scheduleEnabled  Boolean   @default(false)
  startDate        DateTime?                        // Schedule start
  startTime        String?                          // e.g. "00:00"
  endDate          DateTime?                        // Schedule end (null = no end)
  endTime          String?                          // e.g. "23:59"
  displayOrder     Int       @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@map("banners")
}
```

### Migration SQL (MySQL)

```sql
-- ── Expand existing stores table (or recreate) ────────────────────────────
ALTER TABLE `stores` ADD COLUMN `city` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `stores` ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `stores` ADD COLUMN `address` TEXT NOT NULL;
ALTER TABLE `stores` ADD COLUMN `phone` VARCHAR(50) NOT NULL DEFAULT '';
ALTER TABLE `stores` ADD COLUMN `whatsapp` VARCHAR(50) NULL;
ALTER TABLE `stores` ADD COLUMN `email` VARCHAR(191) NULL;
ALTER TABLE `stores` ADD COLUMN `mapsLink` TEXT NOT NULL;
ALTER TABLE `stores` ADD COLUMN `mapsEmbed` TEXT NULL;
ALTER TABLE `stores` ADD COLUMN `managerName` VARCHAR(191) NULL;
ALTER TABLE `stores` ADD COLUMN `managerPhone` VARCHAR(50) NULL;
ALTER TABLE `stores` ADD COLUMN `hours` JSON NOT NULL;
ALTER TABLE `stores` ADD COLUMN `enabled` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `stores` ADD COLUMN `temporarilyClosed` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `stores` ADD COLUMN `exclusiveItems` JSON NOT NULL DEFAULT ('[]');
ALTER TABLE `stores` ADD COLUMN `gallery` JSON NOT NULL DEFAULT ('[]');
ALTER TABLE `stores` ADD COLUMN `rating` DOUBLE NULL;
ALTER TABLE `stores` ADD COLUMN `reviewCount` INT NOT NULL DEFAULT 0;
ALTER TABLE `stores` ADD COLUMN `foundedYear` INT NULL;
ALTER TABLE `stores` ADD COLUMN `displayOrder` INT NOT NULL DEFAULT 0;
ALTER TABLE `stores` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- ── Create banners table ────────────────────────────────────────────────────
CREATE TABLE `banners` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(500) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `emoji` VARCHAR(50) NOT NULL DEFAULT '🖼️',
    `thumbBg` VARCHAR(191) NOT NULL DEFAULT '#FFF3E0',
    `title` TEXT NOT NULL,
    `subtitle` TEXT NULL,
    `ctaLabel` VARCHAR(191) NULL,
    `ctaLink` VARCHAR(500) NULL,
    `desktopImageUrl` TEXT NULL,
    `mobileImageUrl` TEXT NULL,
    `altText` TEXT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `scheduleEnabled` BOOLEAN NOT NULL DEFAULT false,
    `startDate` DATETIME(3) NULL,
    `startTime` VARCHAR(10) NULL,
    `endDate` DATETIME(3) NULL,
    `endTime` VARCHAR(10) NULL,
    `displayOrder` INT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
);
```

---

## 7. Business Rules & Validation

### Stores

| Rule | Details |
|------|---------|
| Unique name | Store `name` must be unique (case-insensitive). Return `409` on conflict. |
| Valid hours | All 7 days (`Mon`–`Sun`) must be present with `open`, `close`, `closed` fields |
| Phone format | Must match pattern: starts with `+`, digits and spaces only |
| Email format | Standard email regex validation |
| Maps link | Must be a valid URL starting with `http://` or `https://` |
| Gallery limit | Maximum 8 photos per store |
| Exclusive items limit | Recommended max 10 per store |
| Delete cascading | When deleting a store, remove its name from all `MenuItem.stores[]` arrays |
| Display order auto | Auto-assign `max(displayOrder) + 1` when creating without explicit order |
| `menuItemCount` computed | COUNT of menu items where stores JSON contains this store's name |

### Banners

| Rule | Details |
|------|---------|
| Valid type | Must be one of: `hero`, `menu`, `announcement`, `popup` |
| Status computed | Derive from `enabled`, `scheduleEnabled`, `startDate`, `endDate`, current time |
| Schedule consistency | If `scheduleEnabled === true`, at least `startDate` should be provided |
| End after start | `endDate` must be after `startDate` if both are provided |
| Image validation | Desktop: max 5MB, PNG/JPG/WebP. Mobile: max 3MB, PNG/JPG/WebP |
| Display order auto | Auto-assign `max(displayOrder) + 1` when creating without explicit order |
| Emoji default | If not provided, auto-assign based on type: hero=🖼️, menu=🍽️, announcement=📢, popup=💬 |
| ThumbBg default | If not provided, auto-assign based on type: hero=gradient, menu=#E3F2FD, announcement=#E8F5E9, popup=purple |
| `schedule` string computed | Backend generates the human-readable schedule text on every read |
| Toggle support | `PUT /api/banners/:id` with just `{ enabled: boolean }` must work (partial update) |

---

## 8. Error Responses

All error responses follow the established shape:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "details": {}
}
```

| HTTP Status | Code | When |
|-------------|------|------|
| `400` | `VALIDATION_ERROR` | Missing required fields, invalid type enum, bad image format/size |
| `401` | `UNAUTHORIZED` | No or expired token |
| `403` | `FORBIDDEN` | Valid token but lacks required permission |
| `404` | `NOT_FOUND` | Store or banner ID not found |
| `409` | `CONFLICT` | Unique name conflict |
| `413` | `PAYLOAD_TOO_LARGE` | Image exceeds max file size |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

### Permission Checks

| Endpoint | Required Permission |
|----------|---------------------|
| `GET /api/stores` | `stores.Stores.view` |
| `GET /api/stores/:id` | `stores.Stores.view` |
| `POST /api/stores` | `stores.Stores.create` |
| `PUT /api/stores/:id` | `stores.Stores.edit` |
| `DELETE /api/stores/:id` | `stores.Stores.delete` |
| `POST /api/stores/:id/exclusive-items` | `stores.Stores.edit` |
| `DELETE /api/stores/:id/exclusive-items/:index` | `stores.Stores.edit` |
| `POST /api/stores/:id/gallery` | `stores.Stores.edit` |
| `DELETE /api/stores/:id/gallery/:index` | `stores.Stores.edit` |
| `GET /api/banners` | `banners.Banners.view` |
| `GET /api/banners/:id` | `banners.Banners.view` |
| `POST /api/banners` | `banners.Banners.create` |
| `PUT /api/banners/:id` | `banners.Banners.edit` |
| `DELETE /api/banners/:id` | `banners.Banners.delete` |
| `PATCH /api/banners/reorder` | `banners.Banners.edit` |

---

## 9. Postman Collection Additions

Add these to the existing `FUSKIT_Admin_API.postman_collection.json`:

### Stores Folder (Expand Existing)

```json
{ "name": "List Stores (Full)",       "method": "GET",    "url": "{{base_url}}/stores" },
{ "name": "Get Store by ID",          "method": "GET",    "url": "{{base_url}}/stores/:id" },
{ "name": "Create Store",             "method": "POST",   "url": "{{base_url}}/stores",
  "body": {
    "name": "New Store — Location",
    "city": "Chennai",
    "state": "Tamil Nadu, India",
    "address": "123 Main Street, Chennai 600001",
    "phone": "+91 98765 43210",
    "mapsLink": "https://maps.google.com/example",
    "hours": {
      "Mon": { "open": "10am", "close": "11pm", "closed": false },
      "Tue": { "open": "10am", "close": "11pm", "closed": false },
      "Wed": { "open": "10am", "close": "11pm", "closed": false },
      "Thu": { "open": "10am", "close": "11pm", "closed": false },
      "Fri": { "open": "10am", "close": "12am", "closed": false },
      "Sat": { "open": "10am", "close": "12am", "closed": false },
      "Sun": { "open": "10am", "close": "11pm", "closed": false }
    },
    "enabled": true,
    "exclusiveItems": [],
    "gallery": []
  }
},
{ "name": "Update Store",             "method": "PUT",    "url": "{{base_url}}/stores/:id",
  "body": { "name": "Updated Name", "enabled": false } },
{ "name": "Toggle Store Visibility",  "method": "PUT",    "url": "{{base_url}}/stores/:id",
  "body": { "enabled": false } },
{ "name": "Toggle Temporarily Closed","method": "PUT",    "url": "{{base_url}}/stores/:id",
  "body": { "temporarilyClosed": true } },
{ "name": "Add Exclusive Item",       "method": "POST",   "url": "{{base_url}}/stores/:id/exclusive-items",
  "body": { "emoji": "🍔", "name": "Spicy Wrap", "price": "₹149" } },
{ "name": "Remove Exclusive Item",    "method": "DELETE", "url": "{{base_url}}/stores/:id/exclusive-items/0" },
{ "name": "Upload Gallery Photo",     "method": "POST",   "url": "{{base_url}}/stores/:id/gallery",
  "body_type": "form-data", "body": { "image": "<file>" } },
{ "name": "Remove Gallery Photo",     "method": "DELETE", "url": "{{base_url}}/stores/:id/gallery/0" },
{ "name": "Delete Store",             "method": "DELETE", "url": "{{base_url}}/stores/:id" }
```

### Banners Folder (New)

```json
{ "name": "List Banners",             "method": "GET",    "url": "{{base_url}}/banners" },
{ "name": "List Active Banners",      "method": "GET",    "url": "{{base_url}}/banners?status=active" },
{ "name": "List by Type",             "method": "GET",    "url": "{{base_url}}/banners?type=hero" },
{ "name": "Get Banner by ID",         "method": "GET",    "url": "{{base_url}}/banners/:id" },
{ "name": "Create Banner",            "method": "POST",   "url": "{{base_url}}/banners",
  "body_type": "form-data",
  "body": {
    "name": "Summer Special Popup",
    "type": "popup",
    "title": "Summer Special!",
    "subtitle": "Get 20% off on all drinks.",
    "emoji": "🎉",
    "ctaLabel": "Grab the deal →",
    "ctaLink": "/menu",
    "enabled": true,
    "scheduleEnabled": true,
    "startDate": "2026-06-01",
    "startTime": "00:00",
    "endDate": "2026-06-30",
    "endTime": "23:59",
    "desktopImage": "<file>"
  }
},
{ "name": "Update Banner",            "method": "PUT",    "url": "{{base_url}}/banners/:id",
  "body": { "title": "Updated Title", "enabled": false } },
{ "name": "Toggle Banner Enabled",    "method": "PUT",    "url": "{{base_url}}/banners/:id",
  "body": { "enabled": false } },
{ "name": "Reorder Banners",          "method": "PATCH",  "url": "{{base_url}}/banners/reorder",
  "body": { "order": [{"id": "<id>", "displayOrder": 1}] } },
{ "name": "Delete Banner",            "method": "DELETE", "url": "{{base_url}}/banners/:id" }
```

---

## 10. Summary: What the Frontend Needs from the Backend

### Stores — Key Requirements

| Need | Detail |
|------|--------|
| `GET /api/stores` returns full `StoreDTO` | The existing minimal endpoint `{ id, name }` must be expanded to return all fields |
| `meta` stats in list response | Powers the 4-card stats strip (total stores, open, menu items, exclusives) |
| `menuItemCount` is computed | Count of menu items whose `stores[]` contains this store's name |
| `exclusiveItemCount` is computed | Length of the `exclusiveItems` JSON array |
| Partial `PUT` for status toggles | "Show on website" toggle sends `{ enabled: bool }`, "Temporarily closed" sends `{ temporarilyClosed: bool }` |
| CRUD for exclusive items | Add/remove items from the `exclusiveItems` array (via dedicated sub-resource or PUT) |
| Gallery image upload/delete | `multipart/form-data` upload for store photos + delete by index |
| `hours` returned as-is | Frontend renders the time strings ("10am", "12am") directly |
| Full delete with cascade | Remove store name from `MenuItem.stores[]` arrays on delete |

### Banners — Key Requirements

| Need | Detail |
|------|--------|
| `status` computed on read | Must derive from `enabled`, `scheduleEnabled`, `startDate`, `endDate`, current time |
| `schedule` string computed on read | Human-readable text like "Live now · No end date" or "Starts 1 Jun · Ends 30 Jun 2026" |
| `meta` stats in list response | Powers the 5-card stats strip (total, active, scheduled, inactive+expired, types) |
| Image upload support | `multipart/form-data` for desktop + mobile banner images |
| Partial `PUT` for enable toggle | The toggle on each banner card sends `{ enabled: bool }` |
| Type-based defaults | Auto-assign emoji and thumbBg based on banner type if not provided |
| Type counts for filter tabs | The `meta` should include count per type, OR the frontend computes from `data[]` |

### Files to Create/Modify on the Backend

| Component | Files |
|-----------|-------|
| **Database Migration** | `prisma/schema.prisma` — expand `Store` model + add `Banner` model |
| **Store Controller** | `src/controllers/store.controller.ts` — expand from minimal to full CRUD |
| **Banner Controller** | `src/controllers/banner.controller.ts` — new file |
| **Store Routes** | `src/routes/store.routes.ts` — expand with all new endpoints |
| **Banner Routes** | `src/routes/banner.routes.ts` — new file |
| **Store Validator** | `src/validators/store.validator.ts` — new file |
| **Banner Validator** | `src/validators/banner.validator.ts` — new file |
| **Upload Middleware** | `src/middleware/upload.ts` — new file for multer/image processing |
| **App Registration** | `src/app.ts` — register banner routes |

### Frontend API Service Additions (for reference)

The frontend `src/services/api.ts` currently has a minimal `storesApi` with just `list()`. It needs to be expanded with the full CRUD operations, and a new `bannersApi` needs to be added. This will be done when connecting the frontend.

---

> Collection uses `{{base_url}}` (default: `http://localhost:4000/api`) and `{{token}}` (auto-set by Login request).
