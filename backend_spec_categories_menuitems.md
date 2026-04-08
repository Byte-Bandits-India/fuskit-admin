# FUSK IT Admin — Backend API Specification
## Modules: Categories & Menu Items

> **Derived from:** `CategoriesPage.tsx` & `MenuItemsPage.tsx` frontend source code  
> **Base URL:** `{{base_url}}` = `http://localhost:4000/api`  
> **Auth:** All endpoints require `Authorization: Bearer <token>` (JWT from `/auth/login`)  
> **Permission module IDs:** `categories` and `items` (as defined in the auth/roles spec)

---

## Table of Contents

1. [Category Data Model](#1-category-data-model)
2. [Category API Endpoints](#2-category-api-endpoints)
3. [Menu Item Data Model](#3-menu-item-data-model)
4. [Menu Item API Endpoints](#4-menu-item-api-endpoints)
5. [Shared Concepts](#5-shared-concepts)
6. [Database Schema (Prisma)](#6-database-schema-prisma)
7. [Business Rules & Validation](#7-business-rules--validation)
8. [Error Responses](#8-error-responses)
9. [Postman Collection Additions](#9-postman-collection-additions)

---

## 1. Category Data Model

Derived from the `Category` interface in `CategoriesPage.tsx`:

```typescript
// Frontend interface (source of truth)
interface Category {
  id: string;           // UUID / public ID
  name: string;         // Display name, e.g. "Buns"
  emoji: string;        // Single emoji char, e.g. "🥐"
  bgColor: string;      // Hex color for card background, e.g. "#FFF3E0"
  itemCount: number;    // Read-only: number of menu items in this category
  type: string;         // e.g. "Veg", "Veg + Non-veg", "Special collab"
  visible: boolean;     // Whether this category is shown on the customer site
}
```

### API Response Shape (`CategoryDTO`)

```json
{
  "id": "cat_abc123",
  "name": "Buns",
  "emoji": "🥐",
  "bgColor": "#FFF3E0",
  "itemCount": 14,
  "type": "Veg + Non-veg",
  "visible": true,
  "displayOrder": 1,
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-04-08T09:00:00Z"
}
```

> **Note:** `itemCount` is a **computed field** — it must be the COUNT of related `MenuItem` records (not stored directly). The frontend uses this for the stats strip.

### Category Types (Enumerable Values)

Based on the mock data in the frontend, the `type` field represents food classification:
- `"Veg"` — all vegetarian items
- `"Veg + Non-veg"` — mixed
- `"Special collab"` — limited-time collaboration categories

> Recommendation: Store as a free-text string in DB (not an enum) since collaborations have custom names.

---

## 2. Category API Endpoints

### 2.1 `GET /api/categories` — List All Categories

Used by `CategoriesPage` on mount to populate the category grid.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by name (case-insensitive, partial match) |
| `visible` | boolean | — | Filter: `true` = visible only, `false` = hidden only |
| `sortBy` | string | `"order"` | One of: `order`, `name`, `items`, `recent` |
| `page` | number | `1` | Page number (optional pagination) |
| `pageSize` | number | `50` | Items per page |

**Sort Behaviour (from frontend `useMemo`):**
- `order` → Sort by `displayOrder` ASC (default)
- `name` → Sort by `name` ASC (alphabetical)
- `items` → Sort by `itemCount` DESC
- `recent` → Sort by `createdAt` DESC

**Success Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "cat_abc123",
      "name": "Buns",
      "emoji": "🥐",
      "bgColor": "#FFF3E0",
      "itemCount": 14,
      "type": "Veg + Non-veg",
      "visible": true,
      "displayOrder": 1,
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-04-08T09:00:00Z"
    }
  ],
  "meta": {
    "total": 8,
    "visible": 7,
    "hidden": 1,
    "totalItems": 45
  }
}
```

> **`meta` object powers the Stats Strip in the frontend:**
> - `meta.total` → "Total categories"
> - `meta.visible` → "Visible on site"
> - `meta.hidden` → "Hidden"
> - `meta.totalItems` → "Total items across all" (sum of all `itemCount` values)

---

### 2.2 `POST /api/categories` — Create Category

Triggered when the user clicks **"Add Category"** and submits the `CategoryDrawer` form.

**Request Body:**
```json
{
  "name": "New Category",
  "emoji": "🍕",
  "bgColor": "#FFF3E0",
  "type": "Veg",
  "visible": true,
  "displayOrder": 9
}
```

| Field | Required | Validation |
|-------|----------|------------|
| `name` | ✅ Yes | Non-empty string, max 60 chars, unique (case-insensitive) |
| `emoji` | ✅ Yes | Single emoji character |
| `bgColor` | ❌ No | Valid hex color; backend can auto-assign from a palette if not provided |
| `type` | ❌ No | Defaults to `"Veg"` |
| `visible` | ❌ No | Defaults to `true` |
| `displayOrder` | ❌ No | If not provided, append to end (max displayOrder + 1) |

**Success Response `201 Created`:**
```json
{
  "data": {
    "id": "cat_xyz789",
    "name": "New Category",
    "emoji": "🍕",
    "bgColor": "#FFF3E0",
    "itemCount": 0,
    "type": "Veg",
    "visible": true,
    "displayOrder": 9,
    "createdAt": "2026-04-08T10:00:00Z",
    "updatedAt": "2026-04-08T10:00:00Z"
  }
}
```

---

### 2.3 `PUT /api/categories/:id` — Update Category

Triggered when the user edits a category in the drawer. Also used for **toggle visibility** (PATCH-like partial update).

**Request Body** (all fields optional — partial update):
```json
{
  "name": "Updated Name",
  "emoji": "🎯",
  "visible": false,
  "displayOrder": 3,
  "bgColor": "#FCE4EC",
  "type": "Veg + Non-veg"
}
```

> **Visibility Toggle:** The frontend's eye icon calls this endpoint with just `{ "visible": false/true }`. The backend must support partial updates.

**Success Response `200 OK`:**
```json
{
  "data": {
    "id": "cat_abc123",
    "name": "Updated Name",
    "emoji": "🎯",
    "bgColor": "#FCE4EC",
    "itemCount": 14,
    "type": "Veg + Non-veg",
    "visible": false,
    "displayOrder": 3,
    "createdAt": "2026-01-10T12:00:00Z",
    "updatedAt": "2026-04-08T10:05:00Z"
  }
}
```

---

### 2.4 `DELETE /api/categories/:id` — Delete Category

Triggered when user confirms deletion in the `DeleteModal`.

> **⚠️ Business Rule:** If the category has **associated menu items**, the backend should either:
> - **Option A (Recommended):** Reject the delete with a `409 Conflict` error, showing the item count.
> - **Option B:** Cascade-delete all menu items in the category (destructive, use with caution).

**Success Response `200 OK`:**
```json
{
  "message": "Category deleted successfully"
}
```

**Conflict Response `409 Conflict`** (if items exist):
```json
{
  "error": "Cannot delete category with existing items",
  "itemCount": 14
}
```

---

### 2.5 `PATCH /api/categories/reorder` — Reorder Categories

Triggered by the **"Reorder"** button (drag-and-drop UI). Batch-updates `displayOrder` for multiple categories.

**Request Body:**
```json
{
  "order": [
    { "id": "cat_abc123", "displayOrder": 1 },
    { "id": "cat_def456", "displayOrder": 2 },
    { "id": "cat_xyz789", "displayOrder": 3 }
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

## 3. Menu Item Data Model

Derived from the `Product` interface in `MenuItemsPage.tsx`:

```typescript
// Frontend interface (source of truth)
interface Product {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  category: string;        // Category NAME (string reference, not ID)
  price: number;           // Current price in ₹ (paise or rupees — confirm with team)
  oldPrice?: number;       // Strike-through original price (optional)
  discountPercent?: number; // e.g. 10 = 10% off (optional)
  isVeg: boolean;          // true = vegetarian
  visible: boolean;        // Shown on customer site?
  stores: string[];        // Array of store names, e.g. ["Chennai", "Bangalore"]
  storeSpecial?: string;   // Optional tag for store-exclusive label
  badges: string[];        // Array: 'bestseller' | 'new' | 'trending' | 'seasonal'
}
```

### API Response Shape (`MenuItemDTO`)

```json
{
  "id": "item_abc123",
  "name": "Bun Butter Jam",
  "description": "Classic butter bun with a generous spread of jam.",
  "emoji": "🥐",
  "bgColor": "#FFF3E0",
  "categoryId": "cat_abc123",
  "categoryName": "Buns",
  "price": 89,
  "oldPrice": null,
  "discountPercent": null,
  "isVeg": true,
  "visible": true,
  "stores": ["Chennai", "Bangalore"],
  "storeSpecial": null,
  "badges": ["bestseller"],
  "displayOrder": 1,
  "createdAt": "2026-01-10T12:00:00Z",
  "updatedAt": "2026-04-08T09:00:00Z"
}
```

> **Important:** The frontend uses `category` as a **name string** in filters and dropdowns. The backend should return both `categoryId` (for DB references) and `categoryName` (for display).

### Badge Values (Enum)

The `badges` array contains zero or more of these values:
- `"bestseller"` — Featured as best-seller
- `"new"` — Recently added item
- `"trending"` — Currently trending
- `"seasonal"` — Limited seasonal availability

### Store Names

Based on the frontend mock data and dropdown options:
- `"Chennai"`
- `"Bangalore"`

> These should either come from a `stores` table (recommended, for future extensibility) or be a configurable enum.

---

## 4. Menu Item API Endpoints

### 4.1 `GET /api/menu-items` — List All Menu Items

Used by `MenuItemsPage` on mount to populate the product grid.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by `name` or `description` (case-insensitive) |
| `category` | string | — | Filter by category name (e.g. `"Buns"`) or `categoryId` |
| `store` | string | — | Filter by store name (e.g. `"Chennai"`) |
| `visible` | boolean | — | `true` = visible only |
| `badge` | string | — | Filter by badge (`bestseller`, `new`, `trending`, `seasonal`) |
| `isVeg` | boolean | — | `true` = veg only |
| `sortBy` | string | `"default"` | One of: `default`, `price-low`, `price-high`, `name`, `recent` |
| `page` | number | `1` | Page number |
| `pageSize` | number | `50` | Items per page |

**Sort Behaviour (from frontend `useMemo`):**
- `default` → Sort by `displayOrder` ASC
- `price-low` → Sort by `price` ASC
- `price-high` → Sort by `price` DESC
- `name` → Sort by `name` ASC
- `recent` → Sort by `createdAt` DESC

**Frontend Filter Mapping:**
- `filter === 'visible'` → `?visible=true`
- `filter === 'bestseller'` → `?badge=bestseller`
- `filter === 'veg'` → `?isVeg=true`

**Success Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "item_abc123",
      "name": "Bun Butter Jam",
      "description": "Classic butter bun with a generous spread of jam.",
      "emoji": "🥐",
      "bgColor": "#FFF3E0",
      "categoryId": "cat_abc123",
      "categoryName": "Buns",
      "price": 89,
      "oldPrice": null,
      "discountPercent": null,
      "isVeg": true,
      "visible": true,
      "stores": ["Chennai", "Bangalore"],
      "storeSpecial": null,
      "badges": ["bestseller"],
      "displayOrder": 1,
      "createdAt": "2026-01-10T12:00:00Z",
      "updatedAt": "2026-04-08T09:00:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "visible": 10,
    "hidden": 2,
    "bestsellers": 4,
    "discounted": 3
  }
}
```

> **`meta` object powers the 5-card Stats Strip:**
> - `meta.total` → "Total products"
> - `meta.visible` → "Visible"
> - `meta.hidden` → "Hidden"
> - `meta.bestsellers` → "Bestsellers" (items where `badges` contains `"bestseller"`)
> - `meta.discounted` → "Discounted" (items where `discountPercent > 0`)

---

### 4.2 `POST /api/menu-items` — Create Menu Item

Triggered when the user submits the `ProductDrawer` in "add" mode.

**Request Body:**
```json
{
  "name": "New Burger",
  "description": "A tasty new burger.",
  "emoji": "🍔",
  "bgColor": "#FFF3E0",
  "categoryId": "cat_abc123",
  "price": 149,
  "oldPrice": 179,
  "discountPercent": 17,
  "isVeg": false,
  "visible": true,
  "stores": ["Chennai"],
  "storeSpecial": "Chennai Spl",
  "badges": ["new"],
  "displayOrder": 13
}
```

| Field | Required | Validation |
|-------|----------|------------|
| `name` | ✅ Yes | Non-empty, max 120 chars |
| `description` | ❌ No | Max 500 chars |
| `emoji` | ✅ Yes | Single emoji |
| `bgColor` | ❌ No | Valid hex; auto-assigned from palette if missing |
| `categoryId` | ✅ Yes | Must be a valid existing category ID |
| `price` | ✅ Yes | Positive number |
| `oldPrice` | ❌ No | Must be > `price` if provided |
| `discountPercent` | ❌ No | 0–100; should match `(oldPrice - price) / oldPrice * 100` |
| `isVeg` | ❌ No | Defaults to `true` |
| `visible` | ❌ No | Defaults to `true` |
| `stores` | ✅ Yes | Non-empty array of valid store names/IDs |
| `storeSpecial` | ❌ No | Free-text exclusive label |
| `badges` | ❌ No | Array of: `bestseller`, `new`, `trending`, `seasonal` |
| `displayOrder` | ❌ No | Appended to end if omitted |

**Success Response `201 Created`:**
```json
{
  "data": {
    "id": "item_xyz789",
    "name": "New Burger",
    ...
  }
}
```

---

### 4.3 `PUT /api/menu-items/:id` — Update Menu Item

Triggered when the user edits a product in the `ProductDrawer`. Also handles **visibility toggle** from the eye icon.

**Request Body** (all fields optional):
```json
{
  "name": "Updated Burger",
  "price": 159,
  "visible": false,
  "badges": ["bestseller", "new"]
}
```

**Success Response `200 OK`:** Returns full updated `MenuItemDTO`.

---

### 4.4 `DELETE /api/menu-items/:id` — Delete Menu Item

Triggered when user confirms deletion.

**Success Response `200 OK`:**
```json
{
  "message": "Menu item deleted successfully"
}
```

---

### 4.5 `GET /api/menu-items/export` — Export Menu Items *(for Export button)*

The frontend has an **"Export"** button in `MenuItemsPage`. This endpoint should return data suitable for download.

**Query Parameters:** Same filtering params as `GET /api/menu-items`.

**Success Response `200 OK`:**
- Content-Type: `text/csv` or `application/json`
- Returns all matching items (no pagination)

---

## 5. Shared Concepts

### 5.1 Stores

The frontend has a hard-coded `STORES = ['Chennai', 'Bangalore']` array. For future scalability, these should come from a **Stores table** in the DB, exposed via:

```
GET /api/stores  →  [{ "id": "store_1", "name": "Chennai" }, ...]
```

The frontend's category dropdown on `MenuItemsPage` should be populated from `GET /api/categories` (names list) rather than the hard-coded `CATEGORIES` constant.

### 5.2 Available Categories for MenuItems

`MenuItemsPage` uses a hard-coded `CATEGORIES` constant for its filter dropdown. In the connected version, this should come from:

```
GET /api/categories?fields=id,name
```

Returning a lightweight list for dropdowns.

---

## 6. Database Schema (Prisma)

```prisma
// ── Category ──────────────────────────────────────────────────────────────────
model Category {
  id           String     @id @default(cuid())
  name         String     @unique
  emoji        String
  bgColor      String     @default("#FFF3E0")
  type         String     @default("Veg")         // "Veg" | "Veg + Non-veg" | "Special collab"
  visible      Boolean    @default(true)
  displayOrder Int        @default(0)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  items        MenuItem[]

  @@map("categories")
}

// ── MenuItem ──────────────────────────────────────────────────────────────────
model MenuItem {
  id              String    @id @default(cuid())
  name            String
  description     String?
  emoji           String
  bgColor         String    @default("#FFF3E0")
  
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id])

  price           Int                             // Store in paise (smallest unit) for precision
  oldPrice        Int?
  discountPercent Float?

  isVeg           Boolean   @default(true)
  visible         Boolean   @default(true)
  displayOrder    Int       @default(0)

  storeSpecial    String?
  badges          String[]  @default([])          // PostgreSQL array  
  stores          String[]  @default([])          // e.g. ["Chennai", "Bangalore"]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("menu_items")
}
```

> **Price storage:** Store prices as **integers in paise** (₹89 = `8900`) to avoid floating-point issues. Divide by 100 when returning in API response, or return both `priceRaw` (int) and `price` (float).

---

## 7. Business Rules & Validation

### Categories
| Rule | Details |
|------|---------|
| Unique name | Category `name` must be unique (case-insensitive). Return `409` on conflict. |
| Non-empty emoji | `emoji` required; validate it's a valid emoji codepoint |
| Delete guard | Prevent delete if `itemCount > 0` (return `409` with item count) |
| Display order | Auto-assign `max(displayOrder) + 1` when creating without explicit order |
| Visibility toggle | `PUT /api/categories/:id` with `{ visible: boolean }` — the frontend calls this on eye icon click |

### Menu Items
| Rule | Details |
|------|---------|
| Valid category | `categoryId` must reference an existing category |
| Valid stores | `stores[]` must be non-empty, members must be valid store names/IDs |
| Price validation | `price > 0`; `oldPrice > price` if provided |
| Discount consistency | `discountPercent` should equal `Math.round((oldPrice - price) / oldPrice * 100)` — backend should calculate/validate this |
| Badge enum | Reject unknown badge values |
| Visibility toggle | Same as categories — `PUT` with `{ visible: boolean }` |
| `itemCount` sync | When a `MenuItem` is created/deleted, the category's `itemCount` (computed) must reflect this — use DB aggregation, not a stored counter |

---

## 8. Error Responses

All error responses follow the shape already established in the Users API:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "details": {}  // optional extra info
}
```

| HTTP Status | Code | When |
|-------------|------|------|
| `400` | `VALIDATION_ERROR` | Missing required fields or invalid values |
| `401` | `UNAUTHORIZED` | No or expired token |
| `403` | `FORBIDDEN` | Valid token but lacks `categories.create` / `items.edit` etc. permission |
| `404` | `NOT_FOUND` | Category or item ID not found |
| `409` | `CONFLICT` | Unique name conflict, or deleting category with items |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

### Permission Checks (from Auth/Roles spec)

The backend middleware must check:

| Endpoint | Required Permission |
|----------|---------------------|
| `GET /api/categories` | `categories.Categories.view` |
| `POST /api/categories` | `categories.Categories.create` |
| `PUT /api/categories/:id` | `categories.Categories.edit` |
| `DELETE /api/categories/:id` | `categories.Categories.delete` |
| `GET /api/menu-items` | `items.Products.view` |
| `POST /api/menu-items` | `items.Products.create` |
| `PUT /api/menu-items/:id` | `items.Products.edit` |
| `DELETE /api/menu-items/:id` | `items.Products.delete` |

---

## 9. Postman Collection Additions

Add these to the existing `FUSKIT_Admin_API.postman_collection.json`:

### Categories Folder

```json
{ "name": "List Categories",       "method": "GET",    "url": "{{base_url}}/categories" },
{ "name": "Create Category",       "method": "POST",   "url": "{{base_url}}/categories",
  "body": { "name": "Test Cat", "emoji": "🍕", "bgColor": "#FFF3E0", "type": "Veg", "visible": true } },
{ "name": "Update Category",       "method": "PUT",    "url": "{{base_url}}/categories/:id",
  "body": { "name": "Updated Cat", "visible": false } },
{ "name": "Toggle Visibility",     "method": "PUT",    "url": "{{base_url}}/categories/:id",
  "body": { "visible": false } },
{ "name": "Delete Category",       "method": "DELETE", "url": "{{base_url}}/categories/:id" },
{ "name": "Reorder Categories",    "method": "PATCH",  "url": "{{base_url}}/categories/reorder",
  "body": { "order": [{"id": "<id>", "displayOrder": 1}] } }
```

### Menu Items Folder

```json
{ "name": "List Menu Items",       "method": "GET",    "url": "{{base_url}}/menu-items" },
{ "name": "List by Category",      "method": "GET",    "url": "{{base_url}}/menu-items?category=Buns" },
{ "name": "List Bestsellers",      "method": "GET",    "url": "{{base_url}}/menu-items?badge=bestseller" },
{ "name": "Create Menu Item",      "method": "POST",   "url": "{{base_url}}/menu-items",
  "body": { "name": "New Item", "emoji": "🍔", "categoryId": "<paste_category_id>", "price": 149, "isVeg": true, "visible": true, "stores": ["Chennai", "Bangalore"], "badges": [] } },
{ "name": "Update Menu Item",      "method": "PUT",    "url": "{{base_url}}/menu-items/:id",
  "body": { "price": 159, "visible": false } },
{ "name": "Toggle Item Visibility","method": "PUT",    "url": "{{base_url}}/menu-items/:id",
  "body": { "visible": false } },
{ "name": "Delete Menu Item",      "method": "DELETE", "url": "{{base_url}}/menu-items/:id" },
{ "name": "Export Menu Items",     "method": "GET",    "url": "{{base_url}}/menu-items/export" }
```

---

## Summary: What the Frontend Needs from the Backend

| Need | Detail |
|------|--------|
| `GET /api/categories` returns `meta` stats | Powers the 4-card stats strip (total, visible, hidden, totalItems) |
| `GET /api/menu-items` returns `meta` stats | Powers the 5-card stats strip (total, visible, hidden, bestsellers, discounted) |
| Category `itemCount` is computed | Frontend displays this in each category card |
| Partial `PUT` for visibility toggle | Eye-icon toggle sends only `{ visible: bool }` |
| `categoryName` in `MenuItemDTO` | Needed for the category filter dropdown on the items page |
| Clean `badges[]` array | e.g. `["bestseller", "new"]` — frontend reads `.includes('bestseller')` |
| Reorder endpoint | The "Reorder" button will submit new `displayOrder` for all categories |
| Export endpoint | The "Export" button on the Menu Items page |

---

## 10. Implementation Status

> **Status: ✅ Fully Implemented** — `2026-04-08`

### What Was Built

| Component | Files Created/Modified |
|-----------|----------------------|
| **Database Migration** | `prisma/schema.prisma` + migration `20260408101820_add_categories_menuitems_stores` |
| **Category Controller** | `src/controllers/category.controller.ts` |
| **Menu Item Controller** | `src/controllers/menuitem.controller.ts` |
| **Store Controller** | `src/controllers/store.controller.ts` |
| **Category Routes** | `src/routes/category.routes.ts` |
| **Menu Item Routes** | `src/routes/menuitem.routes.ts` |
| **Store Routes** | `src/routes/store.routes.ts` |
| **Category Validator** | `src/validators/category.validator.ts` |
| **Menu Item Validator** | `src/validators/menuitem.validator.ts` |
| **App Registration** | `src/app.ts` — 3 new route groups |

### Database Tables Created (MySQL)

```sql
-- categories table
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL UNIQUE,
    `emoji` VARCHAR(191) NOT NULL,
    `bgColor` VARCHAR(191) NOT NULL DEFAULT '#FFF3E0',
    `type` VARCHAR(191) NOT NULL DEFAULT 'Veg',
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
);

-- menu_items table
CREATE TABLE `menu_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `bgColor` VARCHAR(191) NOT NULL DEFAULT '#FFF3E0',
    `categoryId` VARCHAR(191) NOT NULL,   -- FK → categories.id
    `price` INTEGER NOT NULL,             -- stored in rupees (integer)
    `oldPrice` INTEGER NULL,
    `discountPercent` DOUBLE NULL,
    `isVeg` BOOLEAN NOT NULL DEFAULT true,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `storeSpecial` VARCHAR(191) NULL,
    `badges` JSON NOT NULL,               -- e.g. ["bestseller","new"]
    `stores` JSON NOT NULL,               -- e.g. ["Chennai","Bangalore"]
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
);

-- stores table
CREATE TABLE `stores` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL UNIQUE,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
);
```

### Implementation Deviations & Notes

| Spec Says | What Was Implemented | Reason |
|-----------|---------------------|--------|
| `badges String[]` (PostgreSQL array) | `badges Json` (MySQL JSON column) | Project uses MySQL, not PostgreSQL. API returns proper array. |
| `stores String[]` (PostgreSQL array) | `stores Json` (MySQL JSON column) | Same as above. |
| Price stored in paise | Price stored as integer rupees | Simplified — frontend sends rupee values (e.g. `89`). No conversion needed. |
| `store_names` from a `stores` table | `stores` field in `menu_items` is a JSON string array | Both a `Store` table and the inline JSON array are supported. |

### All Endpoints Live

#### Categories — Permission module: `categories`
| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| `GET` | `/api/categories` | `categories.view` | List with filters, sort, pagination + meta stats |
| `POST` | `/api/categories` | `categories.create` | Create (auto displayOrder, auto bgColor) |
| `PUT` | `/api/categories/:id` | `categories.edit` | Full or partial update (incl. visibility toggle) |
| `DELETE` | `/api/categories/:id` | `categories.delete` | Delete (409 if items exist) |
| `PATCH` | `/api/categories/reorder` | `categories.edit` | Batch reorder by displayOrder |

#### Menu Items — Permission module: `items`
| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| `GET` | `/api/menu-items` | `items.view` | List with multi-filter + meta stats |
| `POST` | `/api/menu-items` | `items.create` | Create with validation |
| `PUT` | `/api/menu-items/:id` | `items.edit` | Partial update (visibility toggle + full edit) |
| `DELETE` | `/api/menu-items/:id` | `items.delete` | Delete |
| `GET` | `/api/menu-items/export` | `items.view` | Export as CSV (respects same filters) |

#### Stores — Permission module: `stores`
| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| `GET` | `/api/stores` | `stores.view` | List all stores |

### Postman Collection
All endpoints have been added to `FUSKIT_Admin_API.postman_collection.json` in three new folders:
- **Categories** (6 requests)
- **Menu Items** (9 requests)
- **Stores** (1 request)

Collection uses `{{base_url}}` (default: `http://localhost:4000/api`) and `{{token}}` (auto-set by Login request).

