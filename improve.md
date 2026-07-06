# Code Improvement Report

> Generated from analysis of `app/(dashboard)/` pages, `app/api/` routes, `components/`, `lib/`, `types/`, `services/`, and `hooks/`.

---

## 1. Type Safety & Consistency

### 1.1 Mixed `.tsx` / `.jsx` conventions
| File | Extension |
|------|-----------|
| `admin/page.tsx` | `.tsx` |
| `dashboard/page.jsx` | `.jsx` |
| `orders/page.jsx` | `.jsx` |
| `products/page.jsx` | `.jsx` |
| `users/page.jsx` | `.jsx` |

**Fix:** Convert all dashboard pages to `.tsx` for type safety. Types already exist in `types/` — `User`, `AuthUser`, `Order`, `Product`, `ApiResponse`.

### 1.2 Un-typed state
All dashboard `.jsx` files use `useState([])` which infers `never[]`. This allows accessing `order.user.name` without checking if `user` exists.

### 1.3 Unsafe property access (will crash at runtime)
- `orders/page.jsx:147` — `order.id.slice(-8)` crashes if `id` is undefined
- `orders/page.jsx:150` — `order.user.name` crashes if `user` is null
- `orders/page.jsx:151` — `order.user.email` crashes if `user` is null
- `orders/page.jsx:178` — `new Date(order.createdAt)` crashes if `createdAt` is undefined
- `dashboard/page.jsx:462` — `order.id.slice(-8)` same issue
- `dashboard/page.jsx:465` — `order.user.name` same issue
- `products/page.jsx:279` — `product.images[0]` crashes if `images` is empty array
- `products/page.jsx:292` — `product.category?.name` is safe but inconsistent with other patterns

---

## 2. API Error Handling

### 2.1 No HTTP status checks
All pages call `res.json()` without checking `res.ok`. A 401/403/500 response still gets parsed as success:

```js
// Current — dangerous
const res = await fetch("/api/orders?all=true");
const data = await res.json();
// If res.status >= 400, data.success could be undefined

// Better
const res = await fetch("/api/orders?all=true");
if (!res.ok) {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.message || `HTTP ${res.status}`);
}
const data = await res.json();
```

### 2.2 `Promise.all` fails all-or-nothing
`admin/page.tsx:15-19` uses `Promise.all` for 4 independent API calls. If one fails (e.g. `/api/users` returns 403 for non-admin), all 4 responses are lost.

**Fix:** Use `Promise.allSettled` or individual try/catch per fetch.

### 2.3 Silent error swallowing
`admin/page.tsx:33-34` — `catch (err) { console.error(err); }` — the user never sees the error. The page renders with `admin: null` and `stats: {0,0,0}` looking like everything is fine.

### 2.4 Inconsistent success checking
- `dashboard/page.jsx` checks `usersData.success` and `ordersData.success`
- `orders/page.jsx` checks `data.success`
- `products/page.jsx` checks `productsData.success`
- `users/page.jsx` checks `data.success`

Some API routes return `{ success: true, ... }`, others don't. Check `auth/me/route.js:15` returns `{ success: true, user }` without wrapping.

---

## 3. Duplicated Code Across Dashboard Pages

### 3.1 Page header pattern (4x duplicated)
Every dashboard page starts with the exact same structure:
```jsx
<p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">Aristocraft</p>
<h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">...</h1>
<p className="mt-2 font-sans text-sm text-neutral-500">...</p>
```

**Fix:** Create a shared `<PageHeader title subtitle />` component.

### 3.2 Loading skeleton (4x duplicated)
Every page has an almost identical pulse-animation skeleton. Extract a `<SkeletonTable rows={5} />`.

### 3.3 Error alert (4x duplicated)
The error banner markup is identical across all pages. Extract a shared `<ErrorAlert message={error} />`.

### 3.4 Empty state (3x duplicated)
"No orders yet" / "No products yet" / "No registered users yet" — same card layout repeated. Extract `<EmptyState message="..." />`.

### 3.5 Table header styling (4x duplicated)
```jsx
<thead className="border-b border-[#004b47]/10 bg-[#FAF6EF]/60">
  <tr>
    <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">...</th>
  </tr>
</thead>
```

Extract a `<TableHead>` component.

### 3.6 Card/border/shadow pattern (20+ duplicates)
```jsx
rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]
```

Add to Tailwind config as a utility class, e.g.:
```js
// tailwind.config
theme: {
  extend: {
    boxShadow: {
      'card': '0 2px 20px -4px rgba(0,75,71,0.06)',
    }
  }
}
```

---

## 4. Repeated Tailwind Color Values

Used **30+ times** across dashboard pages with no variables:

| Color | Usage Count |
|-------|-------------|
| `#004b47` | ~40 |
| `#FAF6EF` | ~12 |
| `#C76F4D` | ~10 |
| `#1a1a1a` | ~15 |
| `#004b47/10` | ~12 |

**Fix:** Define in `tailwind.config.ts`:
```js
colors: {
  brand: {
    DEFAULT: '#004b47',
    light: '#FAF6EF',
    accent: '#C76F4D',
    dark: '#1a1a1a',
  }
}
```

---

## 5. Specific Component Issues

### 5.1 `dashboard/page.jsx` — Duplicate React key warning
Dev log shows: `"Encountered two children with the same key '/dashboard'"`
Caused by layout.tsx mapping `NAV_ITEMS` which contains `/dashboard` appearing twice in the breadcrumb/sidebar context. Check for duplicate rendering of nav items.

### 5.2 `dashboard/page.jsx` — `order.user.name` (line 465)
Will throw `TypeError: Cannot read properties of null (reading 'name')` if order has no user (guest checkout). The API supports guest checkout (`guestEmail` in `orders/route.js`).

**Fix:** `order.user?.name ?? "Guest"`

### 5.3 `products/page.jsx` — `product.images[0]` (line 279)
Will crash if `images` is undefined or empty. The inline check `product.images[0] && (...)` guards rendering but the optional chain inside `<img>` is missing.

**Fix:** `product.images?.[0]?.url`

### 5.4 `admin/page.tsx` — No redirect if not admin
If a non-admin user somehow navigates to `/admin`, the page fetches APIs that return 403, but the page still renders with empty data — no feedback or redirect.

**Fix:** Check `me.role === "ADMIN"` and redirect or show "Access denied."

### 5.5 `orders/page.jsx` — Stale data after update
After `updateStatus`, the local state is patched but `data.order.status` is assumed to exist. If the API returns `{ success: true }` without `order`, `data.order.status` is `undefined`, making the select jump to empty.

---

## 6. Performance

### 6.1 Unnecessary re-renders
- `products/page.jsx:157` — Calls `loadData()` after save, refetching everything. Could optimistically update local state.
- `admin/page.tsx:15-19` — 4 concurrent fetches, but all are parsed regardless of need.

### 6.2 No data caching
Every page navigation re-fetches all data. Consider:
- **React Query / TanStack Query** for caching, deduplication, and background refetching
- Or a simple Zustand-based cache with TTL

### 6.3 `useEffect` without cleanup
None of the effects have cleanup functions. If a component unmounts mid-request, `setState` calls cause React warnings:
```
Warning: Can't perform a React state update on an unmounted component.
```

**Fix:** Use an `aborted` flag or `AbortController`.

---

## 7. Accessibility

### 7.1 Missing form labels in modal
`products/page.jsx` form modal has labels, but some inputs lack proper `htmlFor`/`id` associations (e.g., checkboxes at line 632-681 use `name`, not `id`).

### 7.2 Interactive elements missing focus styles
All dashboard pages use custom styling that removes or overrides browser default focus rings. Add `focus-visible:` outlines.

### 7.3 Status `<select>` has low contrast
`orders/page.jsx:165` — The dropdown attaches `statusColors` classes which may have poor contrast when mixed with native select styling.

---

## 8. API Route Issues

### 8.1 Inconsistent response shapes
| Route | Success shape |
|-------|--------------|
| `auth/me` | `{ success: true, user }` |
| `orders` | `{ success: true, orders }` |
| `products` | `{ success: true, products }` |
| `users` | `{ success: true, users }` |
| `categories` | `{ success: true, categories }` |

Consistent — good. But `auth/me` also has `success: true` while login route returns `user` directly without wrapping. Some client code checks `data.success`, others assume the data exists.

### 8.2 Error handling gaps
- `orders/[id]/route.js:23` — `error.message` used without checking if `error` has a `message` property
- `users/route.js:23` — same pattern
- `products/route.js` — uses `error.message` in catch

---

## 9. Architectural Improvements

### 9.1 Use the existing service layer
`services/api-client.ts`, `auth.service.ts`, `order.service.ts`, `product.service.ts` exist but dashboard pages call `fetch()` directly. The services already handle error normalization, base URLs, etc.

### 9.2 Replace inline `confirm()` with a toast
`products/page.jsx:166` — `confirm("...")` blocks the JS thread. Use a proper confirmation dialog from the toast system (`useToast`).

### 9.3 Missing pagination on admin tables
Orders, products, and users tables load everything at once. With thousands of records, this will become slow. Add server-side pagination.

---

## Correctness Bugs (Will Crash)

| Priority | File | Line | Issue |
|----------|------|------|-------|
| **HIGH** | `dashboard/page.jsx` | 465 | `order.user.name` — guest checkout has no user |
| **HIGH** | `dashboard/page.jsx` | 462 | `order.id.slice(-8)` — undefined id |
| **HIGH** | `orders/page.jsx` | 147 | `order.id.slice(-8)` — undefined id |
| **HIGH** | `orders/page.jsx` | 150 | `order.user.name` — guest checkout |
| **MEDIUM**| `products/page.jsx` | 279 | `product.images[0]` — empty images array |
| **MEDIUM**| `orders/page.jsx` | 51 | `data.order.status` — API may not return `order` |
| **LOW** | `admin/page.tsx` | 15-19 | `Promise.all` — one failure kills all four fetches |
