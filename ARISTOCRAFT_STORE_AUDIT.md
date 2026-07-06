# ARISTOCRAFT STORE — COMPLETE AUDIT REPORT

> **Audited:** July 1, 2026
> **Project:** `aristocraft` — Luxury Furniture E-Commerce
> **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma + Neon (PostgreSQL), Zustand, Framer Motion
> **Auditor:** Antigravity AI Code Audit

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [UI/UX Audit](#2-uiux-audit)
3. [Visual Design Audit](#3-visual-design-audit)
4. [Conversion Rate Optimization (CRO)](#4-conversion-rate-optimization-cro)
5. [Accessibility Audit](#5-accessibility-audit)
6. [Performance Audit](#6-performance-audit)
7. [SEO Audit](#7-seo-audit)
8. [Code Quality Audit](#8-code-quality-audit)
9. [Missing Features](#9-missing-features)
10. [Detailed Improvement Recommendations](#10-detailed-improvement-recommendations)
11. [Action Plan](#11-action-plan)

---

## 1. Executive Summary

### Overall Assessment

Aristocraft is an **ambitious luxury furniture e-commerce store** with a genuinely distinctive visual identity. The hero section, product cards, navigation system, and auth screens all display creative effort and solid component thinking. However, the project is caught between two stages: *aesthetically crafted* but *functionally incomplete*. Several critical e-commerce flows are missing, the product data layer has a mismatch between the Prisma schema and the frontend types, and a number of brand/identity inconsistencies undermine the luxury positioning.

### Strengths

- Excellent hero section — rich background transitions, custom SVG decorators, Fraunces font, gold accent system
- Smooth animations — Framer Motion used well throughout (header, cart, product cards, auth)
- Floating pill header — elegant, scroll-aware, with a working cart dropdown/modal
- Persistent cart — Zustand + localStorage persist middleware implemented correctly
- Multi-step checkout — shipping to payment to confirmation flow with inline validation
- JWT auth + Prisma — solid backend with cookie-based sessions, bcrypt hashing, role-based access
- Admin dashboard — protected by middleware, role check enforced
- Responsive navigation — mobile slide-out drawer with accordion menus
- Loading skeletons — grid and rail skeletons for better perceived performance
- Keyboard shortcuts — Ctrl+K to focus search on shop page

### Weaknesses

- Brand name inconsistency — site title says "WY Furniture", login panel says "WY FURNITURE", footer says "Aristocraft"
- No wishlist UI — schema and model exist but the feature is entirely missing from the frontend
- No product reviews UI — Review model is in the schema but never surfaced to users
- Product detail fetches ALL products to find one by ID — a serious performance and scalability issue
- All products client-side — the shop page fetches all products at once with no pagination or infinite scroll
- Footer links are all `#` — Navigate section links go nowhere
- No generateMetadata — zero page-level SEO metadata on any shop page
- Root layout imports NavigationShell and Footer that are never rendered — dead code at root level
- Social login buttons are decorative — Google/Apple buttons exist in auth UI but perform no action
- No newsletter backend — subscribe form sets state locally; emails are never actually saved
- stockCount is hardcoded to 10 on the product detail page
- Cart not synced to DB — Prisma CartItem model exists but cart is localStorage-only
- No image gallery on product detail — only a single image shown
- No coupon/promo code system at checkout
- No real payment gateway integration — only card field UI with no actual payment processing

### Overall Score

| Category               | Score |
|------------------------|-------|
| UI/UX                  | 7/10  |
| Visual Design          | 8/10  |
| CRO                    | 4/10  |
| Accessibility          | 4/10  |
| Performance            | 5/10  |
| SEO                    | 3/10  |
| Code Quality           | 6/10  |
| Feature Completeness   | 4/10  |
| **Overall**            | **5.1/10** |

---

## 2. UI/UX Audit

### 2.1 Navigation

| Aspect | Status | Notes |
|--------|--------|-------|
| Desktop nav (pill header) | Good | Floating, scroll-aware, animated, elegant |
| Mobile slide-out drawer | Good | Backdrop blur, accordion sub-items, escape key closes |
| Mobile breakpoint for nav | Good | Hidden at lg, proper mobile toggle |
| Cart dropdown (desktop) | Good | Outside-click close, escape key, item management |
| Cart modal (mobile) | Good | Centered modal with backdrop |
| Active link indicator | Partial | Only exact-match active state; sub-routes do not highlight parent |
| User menu | Good | Shows name, role-based admin link, logout |
| Search in nav | Missing | No global search in navigation; only on shop page |
| Wishlist icon in nav | Missing | Model exists in DB but no UI entry point |
| "New to WY Furniture?" copy | Bug | Login panel says "WY Furniture" — brand mismatch with "Aristocraft" |

### 2.2 Homepage

| Aspect | Status | Notes |
|--------|--------|-------|
| Hero section | Excellent | Auto-advancing slideshow, colour transitions, decorative SVGs, Fraunces display font |
| Slide timing | Minor issue | 5.2s per slide — no pause on hover, no manual prev/next navigation |
| Hero slide dots/indicators | Missing | Users cannot see how many slides exist or navigate manually |
| Hero slide transition | Good | Smooth opacity + translate with AnimatePresence |
| Hero CTA | Good | "Discover Luxury" with sheen hover effect; links to /shop |
| Categories section | Present | Rendered below hero |
| Featured collection | Present | Horizontal scroll rail with skeleton |
| "Why Choose Us" section | Present | Animated feature cards |
| Testimonials / social proof | Missing | No reviews, no star ratings, no customer quotes on homepage |
| Promotional banner | Missing | No sale banners, no seasonal promotions, no countdown timers |
| Brand story teaser | Missing | No brand narrative section on homepage |
| Trust badges on homepage | Missing | No payment icons, security seals, shipping promise visible above fold |

### 2.3 Product Listing (Shop Page)

| Aspect | Status | Notes |
|--------|--------|-------|
| Search bar | Good | Live filter, result count, Ctrl+K shortcut |
| Category filter pills | Good | URL-synced |
| Sort dropdown | Good | Featured/price asc/price desc/name asc |
| Product grid | Good | 3-column responsive grid, view-entrance animations |
| Loading skeleton | Good | Grid skeleton displayed during fetch |
| Empty state | Good | Illustrated empty state with clear actions |
| Error state | Minimal | Text-only error, no retry button |
| Pagination | Missing | All products loaded at once — unscalable |
| Price range filter | Missing | No slider or range input |
| Rating filter | Missing | No filter by minimum rating |
| In-stock filter | Missing | No availability filter |
| Advanced filter panel | Missing | No sidebar filter drawer |
| Breadcrumb | Missing | No breadcrumb on shop or category pages |

### 2.4 Product Details

| Aspect | Status | Notes |
|--------|--------|-------|
| Single product image | Present | Full-width image with discount badge |
| Image gallery / carousel | Missing | Only one image shown; ProductImage model supports multiple |
| Breadcrumb nav | Good | Shop to Category to Product with correct links |
| Price display (discount) | Good | Shows discounted + original crossed out |
| Rating display | Present | Star icon + numeric rating only |
| Review count | Missing | No link to reviews |
| Stock status | Hardcoded | Always shows "In Stock" with hardcoded stockCount = 10 |
| Quantity selector | Good | Min/max bounded, aria-labels present |
| Add to Cart button | Good | Loading spinner, toast notification |
| Buy Now button | Missing | No direct-to-checkout path |
| Wishlist button | Missing | DB model exists, no UI |
| Product description | Present | Plain text, no formatting |
| Material / dimensions / weight | Missing | Schema has these fields; UI never shows them |
| Shipping info / returns | Hardcoded | Text is hardcoded strings in code, not dynamic from DB |
| Color selector | Missing | ProductColor model exists; only one color badge on card |
| Related products | Present | Same-category suggestions (max 3) |
| Customer reviews section | Missing | Review model exists; no UI to read or write reviews |

### 2.5 Cart

| Aspect | Status | Notes |
|--------|--------|-------|
| Cart panel location | Good | Dropdown on desktop, centered modal on mobile |
| Item list | Good | Image, title, brand, quantity, price |
| Quantity controls | Good | Plus/minus buttons with remove |
| Subtotal / discount / total | Good | Clearly shown |
| Checkout CTA | Good | Prominent green button |
| Empty cart state | Good | Illustrated with "Continue Shopping" link |
| Save cart to DB | Missing | Cart is localStorage only; lost across devices |
| Coupon code input | Missing |   |
| Estimated shipping in cart | Missing |   |

### 2.6 Checkout

| Aspect | Status | Notes |
|--------|--------|-------|
| Multi-step flow | Good | Shipping to Payment to Confirmation |
| Progress indicator | Present | Step numbers shown |
| Form validation | Good | Inline errors, field clearing on input |
| Card number formatting | Good | Auto-formats as grouped digits |
| Order summary sidebar | Present | Shows items, subtotal, discount, tax, shipping |
| Guest checkout | Missing | Unauthenticated users are redirected to login mid-checkout |
| Multiple payment methods | Missing | Only card form shown |
| Real payment gateway | Missing | No Stripe/Razorpay integration; form is cosmetic |
| Promo/coupon code | Missing |   |
| Order notes field | Missing | notes column exists in DB; no UI |
| Terms and conditions checkbox | Missing |   |

### 2.7 Footer

| Aspect | Status | Notes |
|--------|--------|-------|
| Brand wordmark | Good | "Aristocraft" with "Est. 2019" and tagline |
| Custom SVG illustration | Excellent | Handcrafted chaise longue illustration |
| Navigate links | Bug | All href="#" — none link to real routes |
| Contact info | Present | Real email, phone, location |
| Newsletter form | Broken | Toggles success state locally; no API call |
| Social icons | Present | Instagram, Facebook, Pinterest with aria-labels |
| Copyright year | Minor | Hardcoded "2025" but current year is 2026 |
| Legal links | Bug | Privacy Policy and Terms link to "#" |
| Payment method icons | Missing | No Visa/Mastercard/PayPal trust icons |

### 2.8 Mobile Experience

| Aspect | Status | Notes |
|--------|--------|-------|
| Mobile navigation | Good | Slide-out drawer, accordion menus |
| Touch targets | Partial | Some buttons are 32x32px (below 44x44 minimum recommended) |
| Mobile hero | Good | Stack layout, button adapts |
| Mobile product grid | Good | 1-column on mobile, 2-column on sm |
| Mobile cart | Good | Centered modal overlay |
| Mobile checkout | Good | Full-width forms |
| Horizontal scroll rail | Good | Featured collection uses hidden scrollbar |
| Swipe gestures | Missing | Hero slideshow has no swipe support |

---

## 3. Visual Design Audit

### 3.1 Color Palette

The project defines two colour systems that are **not aligned**.

**`globals.css` Tailwind theme tokens:**

| Token | Value | Usage |
|-------|-------|-------|
| --color-ink | #1c1c1c | Body text |
| --color-ivory | #f7f1e8 | Background |
| --color-orange | #fa843e | Brand accent |
| --color-emerald | #004b47 | Primary CTA |
| --color-burgundy | #4a0030 | Defined, never used |

**Hardcoded in components (not using theme tokens):**

| Value | Used For |
|-------|---------|
| #F5EFE6 (LINEN) | Hero background bottom panel |
| #C9A467 (GOLD) | Hero gold accent |
| #1A1714 | Footer background |
| #E8DDD0 | Footer text |
| #C4AA85 | Footer gold accent |
| #C76F4D | Login CTA button |
| #A8552F | Login CTA hover state |

**Key Problems:**
- The orange (#fa843e) is used for accents/badges everywhere, yet the login CTA uses #C76F4D (terracotta) — a completely different hue with no connection to the main palette
- --color-burgundy (#4a0030) is defined but never used anywhere in the codebase
- Footer uses a warm dark palette (#1A1714, #E8DDD0) that is disconnected from the main ivory/emerald/orange palette
- Two different gold values: hero uses #C9A467, footer uses #C4AA85
- 40+ instances of raw hex values via `style={{ backgroundColor: "#004B47" }}` instead of Tailwind CSS tokens

### 3.2 Typography

| Aspect | Status | Notes |
|--------|--------|-------|
| Display font (Fraunces) | Excellent | Loaded via style tag inside hero component |
| Body font | Generic | globals.css uses Arial, Helvetica, sans-serif — a basic system font |
| Font loading method | Suboptimal | Font imported inside component style tag, not via Next.js next/font |
| --font-display token | Wrong | Token is set to Georgia, but hero uses Fraunces — inconsistent |
| Type scale consistency | Inconsistent | Mix of Tailwind classes and custom pixel values (text-[0.85rem], text-[11px]) |
| Letter-spacing | Good | Luxury tracking used appropriately throughout |
| Line height | Partial | Some text blocks lack explicit leading utility |

### 3.3 Consistency Issues

| Issue | Severity |
|-------|---------|
| Brand name: "WY Furniture" vs "Aristocraft" across multiple pages | Critical |
| Login panel says "WY FURNITURE" on the illustrated left panel | Critical |
| CTA colour: #004B47 (emerald) everywhere except login which uses #C76F4D (terracotta) | Medium |
| Gold token: #C9A467 in hero vs #C4AA85 in footer — two separate values | Medium |
| HeroSection.jsx uses .jsx extension; all other components are .tsx | Medium |
| Mix of Tailwind className and inline style objects for the same visual properties | Medium |

### 3.4 Luxury Brand Feel Rating

| Page / Section | Rating | Notes |
|----------------|--------|-------|
| Hero section | 5/5 | Excellent — warm backgrounds, grain texture, Fraunces, gold accents |
| Navigation | 5/5 | Floating pill, elegant minimal design |
| Product cards | 4/5 | Clean with subtle hover scale; badges feel generic |
| Footer | 4/5 | Dark warm palette, custom chaise longue illustration |
| Login/Signup | 4/5 | Split-screen with animated room scene |
| Shop page | 3/5 | Functional but lacks editorial richness |
| Product detail | 3/5 | Single image, no gallery — feels incomplete for a luxury context |
| Checkout | 3/5 | Clean but minimal; no luxury feel signals present |

### 3.5 Component Inventory

| Component | Status | Notes |
|-----------|--------|-------|
| ProductCard | Reusable | Accepts rank, showNewBadge, showDiscountBadge props |
| FloatingHeader (in SidebarNav.tsx) | Good | Scroll-aware, animated entrance |
| Footer | Good | Rich dark footer with illustration |
| GridSkeleton | Good | Accessible animated loading state |
| SearchBar | Good | Controlled input with result count |
| CategoryPills | Good | URL-synced filter pills |
| SortDropdown | Good | Clean sort options dropdown |
| Toast | Good | Context-based provider with success/error variants |
| Button | Missing | No shared Button component — styles repeated inline across all files |
| Input / Form field | Missing | No shared form field component — repeated in checkout, login, auth |
| Modal | Missing | No generic modal primitive |
| Badge | Missing | Discount/New badges duplicated inline in multiple files |

---

## 4. Conversion Rate Optimization (CRO)

### 4.1 Trust Issues

| Issue | Impact |
|-------|--------|
| No payment gateway logos visible at checkout or on product pages | High — users hesitate before entering card details |
| No SSL or security badge visible in the checkout UI | High |
| No customer reviews on product pages | High — social proof is the #1 trust driver for furniture purchases |
| No brand story or craftsmanship narrative below the fold | Medium |
| "Est. 2019" claim in footer with no supporting content | Medium |
| Contact info is real (email, phone, city) | Positive trust signal |

### 4.2 CTA Improvements

| Current CTA | Problem | Recommended Fix |
|-------------|---------|-----------------|
| "View" button on product card | Ambiguous; too weak for a luxury store | Change to "View Details" |
| "Checkout" button in cart | Requires login; no warning shown | Show "Login to Checkout" or enable guest checkout |
| "Discover Luxury" on hero | Good, but only one CTA above fold | Add secondary: "View All Categories" |
| No "Buy Now" on product detail | Forces cart detour for impulse purchases | Add direct-to-checkout button |
| Newsletter "Subscribe" in tiny text | Hard to read and notice | Increase size, add value proposition |

### 4.3 Product Presentation Problems

| Issue | Impact |
|-------|--------|
| Product detail shows 1 image only | High — furniture buyers need multiple angles |
| No zoom or 360 view capability | High |
| Product description is a short paragraph with no formatting | Medium — bullet points aid conversion |
| Material, dimensions, weight exist in DB but not shown in UI | Medium — critical for furniture buying decisions |
| Rating shown as number only; no review count shown | Medium |
| Color swatches not clickable despite ProductColor model existing | Medium |

### 4.4 Checkout Friction Points

| Issue | Impact |
|-------|--------|
| Guest checkout not supported — users redirected to login | Critical — kills 20-30% of conversions |
| No real payment gateway — users cannot actually complete a purchase | Critical |
| No saved addresses for returning users | Medium |
| No promo/coupon code field | Medium |
| Tax rate hardcoded at 8% with no explanation shown | Medium |
| Free shipping threshold ($100) not communicated before cart | Medium |
| No Terms and Conditions acceptance checkbox | Low — legal risk |

### 4.5 Conversion Opportunities

| Opportunity | Estimated Impact |
|------------|-----------------|
| Add wishlist with "Save for Later" on product pages | High — drives return visits |
| Add email capture tied to wishlist (save without creating account) | High |
| Add "Recently Viewed" product rail at bottom of pages | Medium |
| Show "X people viewing this item" urgency cue | Medium |
| Add free shipping threshold progress bar in cart | Medium |
| Enable promo codes and first-order discounts | High |
| Add live chat or WhatsApp button | Medium |
| Post-checkout upsell / accessory suggestions | Medium |
| Abandoned cart email automation via Resend | High |

---

## 5. Accessibility Audit

### 5.1 WCAG Issues Summary

| WCAG Criterion | Status | Details |
|---------------|--------|---------|
| 1.1.1 Non-text Content (Alt text) | Partial | Product images use product title; hero slides use collection name; most decorative SVGs have aria-hidden |
| 1.3.1 Info and Relationships | Partial | Footer h2 used for brand name — semantically incorrect in a footer element |
| 1.4.3 Contrast Ratio | Fail | See section 5.2 for details |
| 2.1.1 Keyboard Navigation | Partial | See section 5.4 for details |
| 2.4.3 Focus Order | Partial | No focus trap implemented in modals |
| 4.1.2 Name, Role, Value | Good | Most interactive elements have aria-label, aria-expanded attributes |

### 5.2 Contrast Issues

| Element | Foreground | Background | Approx Ratio | WCAG AA Required | Status |
|---------|-----------|-----------|------|---------|--------|
| Footer nav links | #A89880 | #1A1714 | ~3.8:1 | 4.5:1 | FAIL |
| Footer copyright text | #3D3027 | #1A1714 | ~1.8:1 | 4.5:1 | FAIL |
| Footer label headings | #6B5D4F | #1A1714 | ~2.3:1 | 4.5:1 | FAIL |
| Brand label (orange) on white background | #fa843e | #FFFFFF | ~2.9:1 | 4.5:1 | FAIL |
| Strikethrough price (40% opacity) | rgba #1C1C1C at 40% | #FFFFFF | ~3.5:1 | 4.5:1 | FAIL |
| Hero text (LINEN) on dark background | #F5EFE6 | #3D2B1F | ~8.5:1 | 4.5:1 | PASS |
| Nav items (inactive state) | neutral-500 | #FFFFFF | ~4.6:1 | 4.5:1 | PASS (barely) |
| Checkout form inputs text | #1C1C1C | #FFFFFF | ~17:1 | 4.5:1 | PASS |

### 5.3 Focus States

| Element | Focus State | Status |
|---------|------------|--------|
| Desktop nav links | None visible | Missing |
| Hero CTA button | focus-visible outline in linen colour | Good |
| Product card "View" link | No visible focus ring | Missing |
| Cart quantity +/- buttons | No visible focus ring | Missing |
| Checkout inputs | Has focus shadow ring (emerald) | Good |
| Mobile drawer nav items | No visible focus ring | Missing |
| Footer links and form inputs | Likely missing | Not verified |

### 5.4 Keyboard Navigation

| Issue | Status |
|-------|--------|
| Mobile cart modal: focus is not trapped inside modal | Bug — keyboard users can tab to background elements |
| Mobile menu drawer: focus is not trapped | Bug |
| Cart dropdown: Escape key closes it correctly | Good |
| Hero slideshow: no keyboard prev/next controls | Missing |
| Sort dropdown: no role="listbox" semantic | Partial — not fully keyboard navigable |

### 5.5 Semantic HTML

| Issue | Details |
|-------|---------|
| Footer h2 used for brand wordmark "Aristocraft" | Should be p or span — not a section heading in a footer |
| main element wrapping | Used correctly in shop, product, checkout, and homepage pages |
| nav element | Used correctly for desktop navigation |
| form elements | Used with proper onSubmit handlers throughout |
| Cart modal role="dialog" and aria-modal="true" | Present and correct on mobile cart |
| footer element | Correct semantic element used |

### 5.6 Alt Text Audit

| Element | Alt Text Applied | Status |
|---------|---------|--------|
| Hero product images | Slide name + "collection" suffix | Descriptive |
| Product card images | product.title | Acceptable |
| Product detail image | product.title | Acceptable |
| Cart item images | item.title | Acceptable |
| User avatar in nav | First name only | Should be "Profile photo of {full name}" |
| Footer chaise longue illustration | aria-label="Chaise longue silhouette" | Good |
| Decorative SVGs in hero and sections | aria-hidden="true" | Correct |

---

## 6. Performance Audit

### 6.1 Images

| Issue | Details | Impact |
|-------|---------|--------|
| Hero images are 200-290 KB JPGs | 1.jpg through 5.jpg — no WebP or AVIF versions provided | Medium |
| All hero images loaded with priority conditional | Only current === 0 gets priority — correct implementation | Good |
| Only images.unsplash.com allowed in next.config | Will break if product images come from other hosts | Medium |
| No placeholder="blur" on product images | No low-quality image placeholder on load | Low |
| sizes attribute on ProductCard images | Correct — (max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw | Good |
| Product detail image uses priority correctly | Priority set for above-fold product image | Good |

### 6.2 Next.js Optimization

| Feature | Status | Notes |
|---------|--------|-------|
| App Router | Used | app/ directory with route groups correctly structured |
| React Compiler | Enabled | reactCompiler: true in next.config.ts — excellent choice |
| Turbopack | Enabled | Dev mode Turbopack configured |
| Server Components | Not leveraged | Nearly all components and pages are "use client" |
| generateMetadata | Missing | No dynamic metadata on any shop, product, or checkout page |
| Static generation with generateStaticParams | Missing | Product pages could be pre-rendered |
| Route prefetching | Implicit | Next.js Link prefetches by default |
| Streaming / Suspense | Missing | No Suspense boundaries; all data blocks rendering |
| Dynamic imports with dynamic() | Missing | Heavy components (hero, whyus) loaded synchronously |
| loading.tsx | Present | Root-level loading component exists |
| error.tsx | Present | Root-level error boundary exists |

### 6.3 Bundle Size Concerns

| Issue | Details |
|-------|---------|
| framer-motion v12 | Large animation library (~170KB) — requires tree-shaking |
| lenis v1 | Smooth scroll library listed as dependency but ZERO usage found in source code |
| jsonwebtoken | Both jose and jsonwebtoken are listed as dependencies — likely redundant |
| SidebarNav.tsx is 842 lines in a single file | Should be split into focused sub-components |
| No code splitting | No dynamic() lazy imports for heavy page sections |

### 6.4 Lazy Loading

| Component | Status | Notes |
|-----------|--------|-------|
| Hero decorations (large SVG elements) | Not lazy | Loaded synchronously on page mount |
| WhyChooseUsSection (16 KB file) | Not lazy | Could be deferred as it is well below the fold |
| FeaturedCollection | Not lazy | Data fetched synchronously on mount |
| ProductCard scroll animations | Good | Uses whileInView with viewport: { once: true } — correct |

### 6.5 Caching Strategy

| Issue | Details |
|-------|---------|
| /api/products fetch in client components | No cache option — defaults to no-store |
| Product data | All fetched client-side; no server-side caching |
| No revalidation strategy | No next: { revalidate } used anywhere in the codebase |
| Session cookie | session_token HttpOnly cookie — appropriate and secure |

### 6.6 Core Web Vitals (Estimated)

| Metric | Estimated Score | Root Cause |
|--------|-----------------|------------|
| LCP | Medium | Hero 1.jpg (240KB) loaded without preload; no format optimization |
| FID/INP | Good | React 19 + React Compiler likely improves interaction responsiveness |
| CLS | Potential issue | Header animates from opacity 0 to 1 on mount which can cause layout shift |
| TTFB | Good | Neon serverless + Next.js is edge-friendly |
| FCP | Medium | All pages are client components — no HTML streaming from server |

---

## 7. SEO Audit

### 7.1 Metadata Coverage

| Page | Title | Description | OG Image | Status |
|------|-------|-------------|----------|--------|
| Root layout | "WY Furniture" | Generic description | None | Wrong brand name; no page overrides |
| Shop page | Inherited | None | None | No generateMetadata |
| Product detail | Inherited | None | None | No generateMetadata |
| Checkout | Inherited | None | None | No generateMetadata |
| Login | Inherited | None | None | No generateMetadata |
| Homepage | Inherited | Inherited | None | Should have custom meta |

### 7.2 Heading Structure

| Page | H1 Present | Issue |
|------|-----------|----|
| Homepage | No | No visible h1 — hero text uses styled elements without semantic heading tag |
| Shop page | Yes | "Every piece, all in one place." — correct |
| Product detail | Yes | product.title — correct |
| Login | Yes | "Welcome back" — correct |
| Footer | Incorrect | h2 used for "Aristocraft" brand name — wrong semantic |

### 7.3 Structured Data (Schema.org)

| Schema Type | Status | Business Impact |
|-------------|--------|-----------------|
| Product schema on product detail pages | Missing | Critical — needed for Google rich results (price, rating, availability) |
| BreadcrumbList schema | Missing | Breadcrumbs shown in UI but not in structured data |
| Organization schema | Missing | Helps Google understand brand identity |
| WebSite schema with SearchAction | Missing | Enables sitelinks searchbox in SERP |

### 7.4 Internal Linking Issues

| Issue | Status |
|-------|--------|
| Footer "Navigate" links all point to "#" | Critical — broken links harm SEO crawl |
| "Best Sellers" nav child links to /shop/best-sellers | Route exists at /best-sellers — 404 likely |
| "New In" nav links to /shop/new-in | Route exists at /new-arrivals — mismatch |
| Footer Privacy Policy and Terms links to "#" | Broken internal links |
| Related products on product detail pages | Links correctly to /products/{id} |
| Homepage hero CTA | Links correctly to /shop |

### 7.5 Technical SEO

| Issue | Status |
|-------|--------|
| robots.txt | Missing |
| sitemap.xml | Missing |
| Canonical tags | Missing on all pages |
| Open Graph tags (og:title, og:description, og:image) | Missing on all pages |
| Twitter Card tags | Missing on all pages |
| lang="en" attribute on html element | Present in root layout — correct |
| Product URLs use numeric IDs (/products/123) | Slugs would be better for SEO and shareability |
| Image alt text on product pages | Present — acceptable |

---

## 8. Code Quality Audit

### 8.1 Architecture

| Aspect | Rating | Notes |
|--------|--------|-------|
| Next.js App Router structure | Good | Route groups (shop), (auth), (dashboard) cleanly separate concerns |
| Prisma + Neon setup | Good | Adapter pattern, serverless-compatible |
| Zustand state management | Good | Lightweight; persist middleware for cart |
| JWT auth via jose | Good | Secure secret-based verification in middleware |
| bcryptjs for passwords | Good | Industry-standard hashing |
| Middleware route protection | Partial | Admin routes protected; /account and /checkout unprotected server-side |
| Resend for email | Present | Not yet wired to any triggered events |

### 8.2 Folder Structure

```
aristocraft/
├── app/
│   ├── (auth)/           Login, forgot password, reset password
│   ├── (dashboard)/      Admin-only pages (protected by middleware)
│   ├── (shop)/           All customer-facing pages
│   └── api/              API routes: auth, products, orders, users, categories
├── components/
│   ├── home/             Homepage sections (Hero, Categories, Featured, WhyUs)
│   ├── layout/           Only a FloatingHeader re-export stub — unnecessary
│   ├── products/         Empty — product components exist in /ui instead
│   ├── shared/           Empty — no shared primitives created yet
│   └── ui/               Mix of primitives (SearchBar, Toast) + domain (ProductCard, footer)
├── hooks/store/           Zustand stores (cart, auth, product)
├── lib/                  Not reviewed
├── prisma/               schema.prisma + seed.ts
├── services/             Not reviewed
├── types/                product.ts, order.ts, user.ts, api.ts
└── tests/                Present but test content not reviewed
```

**Structural Problems:**
- components/layout/FloatingHeader.tsx is just a re-export stub — unnecessary indirection layer
- components/ui/ mixes UI primitives (SearchBar, Toast, GridSkeleton) with domain components (ProductCard, SidebarNav, footer) — should be split into /ui and /components
- components/shared/ exists but is completely empty
- components/products/ does not exist — product components are scattered in /ui

### 8.3 Reusable Component Assessment

| Component | Reusable | Notes |
|-----------|---------|-------|
| ProductCard | Yes | Accepts rank, showNewBadge, showDiscountBadge props |
| FloatingHeader | Yes | Used in shop layout correctly |
| Footer | Yes | Used in shop layout correctly |
| GridSkeleton | Yes | Used in shop page |
| SearchBar | Yes | Controlled input with result count |
| CategoryPills | Yes | URL-synced active state |
| SortDropdown | Yes | Clean, isolated component |
| Toast | Yes | Context-based provider pattern |
| Button | Missing | No shared Button component — green pill button styles repeated in 15+ places |
| Input | Missing | No shared Input component — form field styles repeated in checkout, login, signup |
| Badge | Missing | Discount/New badge markup duplicated in ProductCard and product detail page |

### 8.4 Tailwind CSS Usage Quality

| Issue | Details |
|-------|---------|
| Custom tokens defined but barely used in components | --color-orange, --color-emerald, etc. defined but components use raw hex style props |
| Mix of className and style objects | Some properties defined in both systems — reduces maintainability |
| @theme inline block | Correctly uses Tailwind v4 theme API format |
| No @apply abuse | Tailwind used as utility classes throughout — correct approach |
| scrollbar-none utility | Correct custom utility definition in globals.css |
| Hard-coded hex colors in JSX | 40+ instances of style={{ color: "#fa843e" }} instead of using className with tokens |

### 8.5 TypeScript Quality

| Issue | Status |
|-------|--------|
| Product type ID mismatch | types/product.ts defines id: number but Prisma schema defines id as String @id @default(cuid()) |
| HeroSection.jsx is not TypeScript | Only .jsx file in codebase — should be .tsx |
| catch blocks that swallow errors silently | catch { } with no logging used in several places |
| Unused err variable in catch blocks | catch (err) with err unused generates TypeScript warnings |
| CartItem type definition | Product & { quantity: number } — pragmatic and acceptable |
| Auth store User type | Correctly defined with all needed fields |
| General any usage | Not widespread throughout codebase — generally good |

### 8.6 Security Assessment

| Issue | Severity | Details |
|-------|---------|---------|
| Credit card fields collected without real payment gateway | Critical | Card data is collected via form but only "card" string is sent to API. Never collect or store raw card numbers — use Stripe tokenization instead. |
| JWT secret via environment variable | Good | process.env.JWT_SECRET — not hardcoded |
| bcrypt hashing for passwords | Good | Industry-standard implementation |
| Middleware protects only /dashboard | Medium | /account and /checkout are unprotected at the middleware level |
| No rate limiting on auth routes | Medium | Login and register endpoints can be brute-forced |
| .env file in project root | Check | Ensure .gitignore excludes it; 162-byte .env file detected |
| CSRF protection | Missing | No CSRF tokens on state-mutating POST forms |
| Prisma query parameterization | Good | Prisma parameterizes all queries by default — SQL injection protected |

### 8.7 Scalability Problems

| Issue | Impact |
|-------|--------|
| Product detail fetches ALL products to find one by ID | O(n) per page view — will fail with large catalogs |
| No pagination on /api/products | Returns entire product catalog in one response |
| No server-side search | All filtering and searching is done in-memory client-side |
| Cart is localStorage only | CartItem model in DB is unused; cart lost on new device |
| Zustand hasFetched flag prevents refresh | User data won't update in the same session without page reload |

---

## 9. Missing Features

The following features are **expected in a premium luxury furniture e-commerce store** but are currently absent.

### 9.1 Critical (Revenue Impact)

| Feature | DB Support | Frontend UI |
|---------|-----------|-------------|
| Real payment gateway (Stripe or Razorpay) | Partial schema | Missing |
| Guest checkout without forced login | Not needed | Missing |
| Product image gallery with multi-image carousel | ProductImage model exists | Missing |
| Customer reviews and ratings UI | Review model + relation exists | Missing |
| Wishlist / Favourites feature | Wishlist model + relation exists | Missing |
| Pagination or infinite scroll on shop page | Not needed | Missing |

### 9.2 High Priority

| Feature | DB Support | Frontend UI |
|---------|-----------|-------------|
| Color variant selector on product detail | ProductColor model exists | Missing |
| Product dimensions, material, weight display | Schema fields exist | Missing |
| Real-time stock count and out-of-stock state | stock field exists | Hardcoded |
| Order tracking status page | trackingNumber field exists | Missing |
| Email receipts and order confirmations | Resend dependency present | Missing |
| Abandoned cart email automation | Resend dependency present | Missing |
| Admin product CRUD management | DB schema complete | Missing |
| Coupon and promo code system | No DB model yet | Missing |

### 9.3 Medium Priority

| Feature | Notes |
|---------|-------|
| Server-side product search API | Client-side search does not scale beyond a few hundred products |
| Saved delivery addresses in account | Account page exists as a foundation |
| Order notes / delivery instructions UI | notes field exists in Order model |
| Related products algorithm improvement | Currently simple same-category filter only |
| Recently Viewed products | Can use localStorage tracking |
| Product comparison tool | Common in furniture retail |
| Room visualizer or AR preview | A luxury differentiator |
| "Complete the look" bundle suggestions | Cross-sell system for revenue increase |
| Gift wrapping option at checkout | Common luxury store feature |
| White-glove delivery option | Premium delivery differentiator |
| Live chat or WhatsApp integration | Customer support channel |
| Loyalty or rewards program | Customer retention driver |

### 9.4 Low Priority / Polish

| Feature |
|---------|
| Hero slideshow swipe support for touch devices |
| Hero slide manual navigation with dots or arrows |
| Scroll-to-top button |
| Cookie consent banner (required in EU) |
| robots.txt and sitemap.xml for SEO |
| Structured data / JSON-LD schema markup |
| Dark mode toggle |
| Print-friendly product page |
| Social sharing buttons on product pages |
| Newsletter subscription backend wired to Resend |

---

## 10. Detailed Improvement Recommendations

### REC-01: Fix Brand Name Inconsistency

| | |
|---|---|
| **Current Problem** | The site title (app/layout.tsx) says "WY Furniture", the login panel left-side logo reads "WY FURNITURE", but the footer, nav logo, and auth page right panel all say "Aristocraft". Three different brand presentations across one application. |
| **Why It Matters** | This destroys brand recognition and trust. A luxury store must have a single, consistent name across every touchpoint. Users may question if they are on the right website. |
| **Recommended Solution** | Change metadata.title in app/layout.tsx to "Aristocraft". Update the login panel left-side span from "WY FURNITURE" to "Aristocraft". Add page-specific titles following the pattern "Product Name — Aristocraft". |
| **Expected Impact** | Immediate brand coherence; improved SEO with consistent brand keyword; increased user trust. |
| **Priority** | **Critical** |

---

### REC-02: Fix Footer Navigation Links

| | |
|---|---|
| **Current Problem** | All four "Navigate" links in the footer (Shop, Collections, About, Contact) use href="#". Privacy Policy and Terms & Conditions links also use href="#". |
| **Why It Matters** | These are completely broken for users and for SEO crawlers. A luxury brand cannot have dead navigation links in its footer. |
| **Recommended Solution** | Replace all href="#" in footer.tsx with real routes: /shop, /about, /contact, /privacypolicy, /terms&conditions. Update the NAV_LINKS data array to use actual href values. |
| **Expected Impact** | Restored site navigation; improved SEO link graph; prevents 404s from crawlers. |
| **Priority** | **Critical** |

---

### REC-03: Fix Product Detail Performance (N+1 Fetch)

| | |
|---|---|
| **Current Problem** | app/(shop)/products/[id]/page.tsx calls fetch("/api/products") to get ALL products, then uses .find() to locate the target product by ID. This is O(n) per product page view. |
| **Why It Matters** | With 100 products, every product page loads 100 records to display 1. With 1,000+ products this creates noticeable lag and high database read costs. |
| **Recommended Solution** | Create a dedicated API route /api/products/[id] that fetches a single product by ID using Prisma's findUnique. Update the product detail page to call this endpoint. Consider generateStaticParams for static pre-rendering. |
| **Expected Impact** | Dramatically faster product page loads; reduced database load; supports catalog scaling to thousands of products. |
| **Priority** | **Critical** |

---

### REC-04: Integrate Real Payment Gateway

| | |
|---|---|
| **Current Problem** | The checkout collects card number, expiry, CVV, and cardholder name, but sends only paymentMethod: "card" to the orders API. No actual payment processing occurs. The store cannot collect real money. |
| **Why It Matters** | Without payment processing, the store cannot function commercially. Collecting raw card numbers without PCI-compliant tokenization is also a serious legal and security risk. |
| **Recommended Solution** | Integrate Stripe (recommended for international) or Razorpay (Pakistan-friendly). Use Stripe Payment Elements — Stripe handles the card fields in an iframe so raw numbers never touch your server. Create a /api/create-payment-intent route. Remove the current card input fields entirely. |
| **Expected Impact** | Enables real revenue generation; achieves PCI DSS compliance; builds customer trust. |
| **Priority** | **Critical** |

---

### REC-05: Enable Guest Checkout

| | |
|---|---|
| **Current Problem** | In checkout/page.tsx, the handlePlaceOrder function checks if (!user) and calls router.push("/login"), completely blocking checkout for unauthenticated users. |
| **Why It Matters** | Forced account creation during checkout is one of the most impactful conversion killers in e-commerce, reducing conversions by 20-35% among new visitors. |
| **Recommended Solution** | Allow guest checkout by collecting email and phone in the shipping step and creating the order without requiring a user account. Add a guestEmail field to the order. Offer account creation as a post-purchase option. |
| **Expected Impact** | Significant conversion rate improvement for new visitors who do not want to create an account. |
| **Priority** | **Critical** |

---

### REC-06: Build Product Image Gallery

| | |
|---|---|
| **Current Problem** | The product detail page shows a single image even though the ProductImage model in Prisma supports multiple images per product. |
| **Why It Matters** | Furniture buyers need to see multiple angles: front, back, side, close-up on materials, and in-room lifestyle shots. Single images significantly reduce purchase confidence. |
| **Recommended Solution** | Build a ProductGallery component with a full-width main image viewer and a scrollable thumbnail strip below. Support keyboard arrow navigation between images. Add a lightbox for full-screen zoom. Wire to ProductImage records from the API. |
| **Expected Impact** | Higher product page engagement; reduced returns from mismatched expectations; higher conversion rate. |
| **Priority** | **Critical** |

---

### REC-07: Add SEO Metadata to All Pages

| | |
|---|---|
| **Current Problem** | No generateMetadata exists on any page. All pages inherit the generic "WY Furniture" title. No Open Graph, Twitter Card, or structured data tags anywhere. |
| **Why It Matters** | Every product page and category page is an organic search opportunity. Without unique titles, descriptions, and OG images, the store is invisible to search engines and appears generic when shared on social media. |
| **Recommended Solution** | Add generateMetadata to each page. Product pages: title as product.name + " — Aristocraft". Shop page: "Luxury Furniture Shop — Aristocraft". Add openGraph images using product imageUrl. Create robots.txt and sitemap.xml. Add Product JSON-LD schema to product pages. |
| **Expected Impact** | Organic search traffic growth over 3-6 months; better social sharing previews; eligibility for Google rich results. |
| **Priority** | **Critical** |

---

### REC-08: Build Customer Reviews UI

| | |
|---|---|
| **Current Problem** | The Review model is fully defined in the Prisma schema with rating, comment, user relation, and product relation — but no UI exists anywhere to read or write reviews. |
| **Why It Matters** | Customer reviews are the single most powerful conversion driver for e-commerce. A luxury furniture store showing a numeric rating with zero reviews looks untrustworthy to new visitors. |
| **Recommended Solution** | Build a ReviewSection component on the product detail page. Display existing reviews with star ratings and comments. Allow logged-in users to submit a review (1-5 stars + text). Create /api/reviews POST and GET endpoints. Add review count next to the rating on ProductCard. |
| **Expected Impact** | Significant trust improvement; meaningful conversion rate lift on product pages; improved customer confidence. |
| **Priority** | **Critical** |

---

### REC-09: Build Wishlist Feature

| | |
|---|---|
| **Current Problem** | The Wishlist model is fully defined in Prisma with user relation and product relation, but there is no heart icon, wishlist page, or any mechanism for users to save products. |
| **Why It Matters** | Wishlists are a powerful intent-capture and re-engagement tool. They drive return visits and create email remarketing opportunities ("Your saved item just went on sale!"). |
| **Recommended Solution** | Add a heart/bookmark icon to ProductCard (top-right corner) and to the product detail page. Create /account/wishlist page showing saved items. Create /api/wishlist POST and DELETE endpoints. Show wishlist item count in navigation next to cart. |
| **Expected Impact** | Increased return visit rate; new email re-engagement channel; improved purchase intent conversion. |
| **Priority** | **High** |

---

### REC-10: Fix Hardcoded Stock Count

| | |
|---|---|
| **Current Problem** | const stockCount = 10 is hardcoded in the product detail page file. The "In Stock" badge is always shown regardless of actual product inventory. |
| **Why It Matters** | Inventory accuracy is critical for customer trust. Showing "In Stock" for out-of-stock products causes failed orders, customer complaints, and chargebacks. |
| **Recommended Solution** | Include stock in the /api/products/[id] response from Prisma's Product.stock field. Display dynamic status: "In Stock" when stock > 5, "Only {n} left!" when stock is 1-5, and "Out of Stock" with a disabled Add to Cart button when stock = 0. |
| **Expected Impact** | Accurate inventory management; FOMO-driven urgency on low-stock items; prevention of overselling. |
| **Priority** | **High** |

---

### REC-11: Fix Accessibility — Missing Focus States

| | |
|---|---|
| **Current Problem** | Most interactive elements including nav links, product card buttons, cart quantity buttons, and mobile drawer links have no visible focus ring when tabbed to with keyboard. |
| **Why It Matters** | WCAG 2.4.7 requires all interactive elements to have a visible focus indicator. Keyboard-only users and screen reader users depend on this to navigate. This is also a legal accessibility requirement in many jurisdictions. |
| **Recommended Solution** | Add a global :focus-visible rule in globals.css: outline: 2px solid #004b47; outline-offset: 2px. Add Tailwind focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 to all interactive elements. The hero CTA already implements this correctly — apply the same pattern everywhere. |
| **Expected Impact** | WCAG AA compliance; legal risk reduction; dramatically improved keyboard usability. |
| **Priority** | **High** |

---

### REC-12: Fix Footer Text Contrast

| | |
|---|---|
| **Current Problem** | Footer copyright text (#3D3027 on #1A1714) has an estimated contrast ratio of 1.8:1, far below the WCAG required 4.5:1. Footer nav links (#A89880) achieve only ~3.8:1. |
| **Why It Matters** | Many users — especially older users — cannot read low-contrast text. This is a WCAG 1.4.3 violation. |
| **Recommended Solution** | Lighten footer text colours while maintaining the warm dark aesthetic: copyright from #3D3027 to #7B6C60 (or higher), nav links from #A89880 to #C8B8A2, label headings from #6B5D4F to #9B8B7E. |
| **Expected Impact** | WCAG AA compliance; improved readability for all users; no visual character lost from the dark warm footer aesthetic. |
| **Priority** | **High** |

---

### REC-13: Fix Product ID Type Mismatch

| | |
|---|---|
| **Current Problem** | types/product.ts defines id: number (likely from a DummyJSON or numeric mock API), but Prisma schema defines id as String @id @default(cuid()). This creates a fundamental type mismatch between mock data and production database. |
| **Why It Matters** | When products are served from the real Prisma database, the ID type mismatch will break cart operations (product lookup uses id), URL routing (parseInt in product detail), and order creation (productId passed to API). |
| **Recommended Solution** | Decide on one strategy: if using Prisma with cuid, update types/product.ts to id: string and update all usages in cart-store.ts, product lookup logic, and the parseInt call in product detail page. |
| **Expected Impact** | Prevents critical runtime errors when switching from mock data to production database. |
| **Priority** | **High** |

---

### REC-14: Migrate Font Loading to next/font

| | |
|---|---|
| **Current Problem** | Fraunces and Inter fonts are loaded via an @import url() Google Fonts call inside a style JSX element inside HeroSection.jsx. This causes a Flash of Unstyled Text (FOUT) and is not optimized. |
| **Why It Matters** | Next.js next/font/google automatically handles font optimization, self-hosting, preloading, and elimination of layout shift. The current approach is the opposite of best practice. |
| **Recommended Solution** | In app/layout.tsx, import Fraunces and Inter from 'next/font/google'. Configure subsets, weights, and display settings. Pass the generated className to the html element. Remove the @import style block from HeroSection.jsx entirely. |
| **Expected Impact** | Eliminated FOUT; better Cumulative Layout Shift (CLS) score; faster perceived font rendering. |
| **Priority** | **Medium** |

---

### REC-15: Remove or Implement lenis

| | |
|---|---|
| **Current Problem** | lenis ^1.3.23 is listed in package.json dependencies but no usage was found anywhere in the source code of the project. |
| **Why It Matters** | Unused dependencies add to bundle size, increase install time, and create unnecessary maintenance surface for security updates. |
| **Recommended Solution** | Option A: Remove lenis with npm uninstall lenis if smooth scroll is not desired. Option B: Implement Lenis smooth scroll by creating a SmoothScrollProvider component and wrapping the app layout. |
| **Expected Impact** | Cleaner dependencies and reduced bundle size if removed; premium smooth scroll experience if implemented. |
| **Priority** | **Low** |

---

## 11. Action Plan

### Phase 1 — Critical Fixes (Week 1-2)

Fix what breaks trust, revenue, or basic functionality. These issues must be resolved before any marketing or launch.

- [ ] **REC-01** Fix brand name: Change "WY Furniture" to "Aristocraft" in app/layout.tsx metadata title
- [ ] **REC-01** Fix login panel: Update left-side "WY FURNITURE" span to "Aristocraft"
- [ ] **REC-02** Fix footer nav links: Replace all href="#" with real routes (/shop, /about, /contact, /privacypolicy, /terms&conditions)
- [ ] **REC-02** Fix footer legal links: Privacy Policy and Terms must link to actual pages
- [ ] Fix nav route mismatches: "Best Sellers" should go to /best-sellers; "New In" should go to /new-arrivals
- [ ] **REC-03** Create /api/products/[id] endpoint for single-product fetch by ID
- [ ] **REC-03** Update product detail page to use the new single-product endpoint instead of fetching all
- [ ] Fix copyright year: Change hardcoded "2025" to dynamic new Date().getFullYear()
- [ ] **REC-07** Add generateMetadata to app/(shop)/layout.tsx with Aristocraft brand defaults
- [ ] **REC-07** Add generateMetadata to product detail page with dynamic product title and description
- [ ] **REC-07** Create public/robots.txt allowing all crawlers
- [ ] **REC-04** Remove raw card input fields and add a visible notice that real payment processing is pending
- [ ] **REC-13** Update types/product.ts id from number to string to align with Prisma cuid

### Phase 2 — Core E-Commerce Features (Week 3-5)

Build the features users expect before they can trust and buy from the store.

- [ ] **REC-04** Stripe integration: Install @stripe/stripe-js, create /api/create-payment-intent, replace card form with Stripe Payment Elements
- [ ] **REC-05** Guest checkout: Allow orders without login by collecting email in shipping step; offer account creation post-purchase
- [ ] **REC-06** Product image gallery: Build ProductGallery component; wire to ProductImage DB records; add thumbnails and lightbox
- [ ] **REC-08** Customer reviews: Build ReviewSection on product detail; add /api/reviews endpoints; show review count on ProductCard
- [ ] **REC-09** Wishlist: Add heart icon to ProductCard and product detail; create /account/wishlist page; add /api/wishlist endpoints
- [ ] **REC-10** Dynamic stock display: Fetch stock from DB; show "Only {n} left!" for low stock; disable Add to Cart when stock = 0
- [ ] Hero slide navigation: Add prev/next arrow buttons and dot indicators; implement pause on hover; add touch swipe support

### Phase 3 — SEO and Performance (Week 6-7)

Make the store discoverable and fast enough to compete.

- [ ] **REC-07** Product structured data: Add Product JSON-LD schema to product detail pages (name, price, rating, image, availability)
- [ ] **REC-07** BreadcrumbList schema: Add structured breadcrumb data matching the UI breadcrumbs
- [ ] **REC-07** Open Graph: Add og:title, og:description, og:image to all pages via generateMetadata
- [ ] **REC-07** Create dynamic /sitemap.xml that includes all product and category URLs
- [ ] **REC-14** Migrate font loading: Replace @import url() in HeroSection with next/font/google Fraunces and Inter in app/layout.tsx
- [ ] Add pagination to /api/products: Support page and limit query parameters
- [ ] Add pagination UI to shop page: Page numbers or "Load More" button
- [ ] Add Suspense boundaries: Wrap FeaturedCollection and product grid with skeleton fallbacks
- [ ] Lazy load below-fold sections: Use dynamic() for WhyChooseUsSection and FeaturedCollection
- [ ] Convert hero images to WebP format; add WebP alternatives for all hero JPGs

### Phase 4 — Accessibility (Week 7-8)

Meet WCAG AA standards. This is both a legal requirement and an ethical one.

- [ ] **REC-11** Add global focus-visible styles: Add :focus-visible rule to globals.css with emerald outline
- [ ] **REC-11** Audit every interactive element: Add focus-visible classes to nav links, product card buttons, cart controls, footer links
- [ ] Implement focus trap in mobile cart modal using a focus trap library or custom hook
- [ ] Implement focus trap in mobile navigation drawer
- [ ] **REC-12** Fix footer text contrast: Lighten all footer text colours to meet 4.5:1 minimum ratio
- [ ] Fix orange brand label on white: Increase font weight or add subtle background to improve contrast
- [ ] Add aria-live="polite" region for toast notification announcements to screen readers
- [ ] Fix footer semantic: Change h2 for "Aristocraft" brand wordmark to p element
- [ ] Add keyboard controls to hero slideshow: Left/right arrow keys to navigate between slides

### Phase 5 — Conversion Optimisation and Polish (Week 9-10)

Maximise revenue from the visitors you already have.

- [ ] Color variant selector: Build interactive color swatch component using ProductColor model; clicking a swatch changes the product image
- [ ] Product specifications section: Display material, dimensions, and weight below the description from DB fields
- [ ] "Buy Now" button: Add direct-to-checkout button alongside "Add to Cart" on product detail
- [ ] Free shipping progress bar in cart: "Add $X more for free shipping" with animated progress bar
- [ ] Recently Viewed products: Track last 5 product views in localStorage; show horizontal rail at bottom of product pages
- [ ] Newsletter backend: Wire footer email form to /api/newsletter endpoint and save to DB; trigger Resend welcome email
- [ ] Order tracking page: Build /account/orders/[id] with visual status timeline (Pending, Processing, Shipped, Delivered)
- [ ] Email order confirmation: Trigger Resend transactional email on successful order creation in /api/orders
- [ ] Trust badges at checkout: Add Visa, Mastercard, PayPal icons; add "256-bit SSL Secure Checkout" badge
- [ ] **REC-15** Remove lenis dependency or implement smooth scroll provider
- [ ] Add "Only X left in stock" urgency badge to ProductCard when stock is low

### Phase 6 — Advanced Features (Ongoing)

Premium features that elevate Aristocraft above competitors.

- [ ] Coupon and promo code system: Create PromoCode DB model; add /api/promo endpoint; add input field at checkout
- [ ] Product comparison tool: Allow users to select 2-3 products and compare specifications side by side
- [ ] Admin product CRUD: Add product creation, editing, and deletion to the admin dashboard
- [ ] Admin order management: View, update status, and manage all orders from the dashboard
- [ ] Abandoned cart email automation: Detect carts idle for 1 hour; trigger Resend email sequence
- [ ] Customer loyalty program: Points system for purchases; tiered benefits for repeat buyers
- [ ] Room visualizer: Integrate a third-party AR room preview service (e.g., Dopple, Zakeke)
- [ ] Live chat: Integrate Crisp, Intercom, or WhatsApp Business API
- [ ] Blog CMS: Wire /blog route to actual content management (Sanity, Contentful, or DB-based)
- [ ] Server-side full-text search: Implement Prisma full-text search or PostgreSQL tsvector for scalable search
- [ ] Multi-language support: Add i18n routing for Arabic or Urdu given Pakistan audience
- [ ] Performance monitoring: Add Vercel Analytics or PostHog for real Core Web Vitals tracking

---

## Summary Table

| # | Recommendation | Priority | Effort |
|---|----------------|---------|--------|
| REC-01 | Fix brand name inconsistency | Critical | 30 min |
| REC-02 | Fix footer dead links | Critical | 30 min |
| REC-03 | Fix product detail N+1 fetch | Critical | 2 hours |
| REC-04 | Integrate real payment gateway | Critical | 1-2 days |
| REC-05 | Enable guest checkout | Critical | 1 day |
| REC-06 | Build product image gallery | Critical | 1 day |
| REC-07 | Add SEO metadata + structured data | Critical | 1 day |
| REC-08 | Build customer reviews UI | Critical | 2 days |
| REC-09 | Build wishlist feature | High | 1 day |
| REC-10 | Fix hardcoded stock count | High | 2 hours |
| REC-11 | Fix accessibility focus states | High | 3 hours |
| REC-12 | Fix footer contrast failures | High | 1 hour |
| REC-13 | Fix product ID type mismatch | High | 2 hours |
| REC-14 | Migrate font to next/font | Medium | 1 hour |
| REC-15 | Remove or implement lenis | Low | 30 min |

---

*Report generated by Antigravity AI Code Audit — July 1, 2026*
*Based on full source code analysis of the aristocraft Next.js project.*
*Files reviewed: app/layout.tsx, all shop/auth/dashboard pages, all home and UI components, hooks/store files, Prisma schema, middleware.ts, next.config.ts, package.json, globals.css, tsconfig.json.*
