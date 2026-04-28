# 🚀 Izaan Shop - Complete Project Master Guide (READ FIRST)

**Last Updated:** April 9, 2026 | **Status:** Production Live | **Domain:** izaanshop.com

This is the **central authority document** for all Izaan Shop development. Both human developers and AI assistants MUST read and follow this before making ANY changes to ensure system stability, deployment success, and code consistency.

---

# 📋 TABLE OF CONTENTS
1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Development Setup](#-development-setup)
5. [Database Management](#-database-management)
6. [cPanel Hosting Guide](#-cpanel-hosting-guide)
7. [Deployment Workflow](#-deployment-workflow)
8. [For AI Assistants (GPT/Claude)](#-for-ai-assistants-gptclaude)
9. [For Human Developers](#-for-human-developers)
10. [Common Tasks & Solutions](#-common-tasks--solutions)
11. [Safety Rules & Do's/Don'ts](#-safety-rules--dondts)
12. [Emergency Procedures](#-emergency-procedures)

---

# 🎯 PROJECT OVERVIEW

## What is Izaan Shop?

Izaan Shop is a **full-stack e-commerce platform** built for premium performance on cPanel-based hosting (shared hosting). It demonstrates how to build a fast, scalable monolith that handles 1000s of concurrent users without expensive server costs.

**Live Site:** https://izaanshop.com  
**Admin Dashboard:** https://izaanshop.com/admin/dashboard  
**Database:** MySQL (5 connection pooling for cPanel limits)

### Core Capabilities

- ✅ Product catalog with dynamic categories
- ✅ Real-time shopping cart with price calculations
- ✅ Admin dashboard with CRUD operations (Products, Categories, Orders, Coupons, Banners)
- ✅ Dynamic shipping method selection
- ✅ Rich text product descriptions
- ✅ Order management with invoice generation
- ✅ User authentication (JWT-based)
- ✅ Admin approval system for new admins
- ✅ Analytics and financial reports
- ✅ Real-time cache invalidation (ISR + on-demand revalidation)

### Performance Metrics

- **Homepage Load (first visit):** 2-3 seconds (SSR with ISR 60s cache)
- **Homepage Load (cached):** <500ms
- **Admin Dashboard:** <1s per tab (on-demand data loading)
- **Search Filtering:** Real-time, <800ms response
- **Image Optimization:** AVIF/WebP with device-aware sizing

---

# 🏗️ SYSTEM ARCHITECTURE

## Three-Layer Architecture Pattern

Izaan Shop uses a **3-layer rendering strategy** for performance:

```
Layer 1: SSR Shell (Static Layout)
├─ Quick initial render - HTML + minimal CSS
├─ Homepage: Sidebar + header + skeleton placeholders
├─ Admin: Dashboard layout without data
└─ Load time: 200KB cache

Layer 2: Client Hydration (React takeover)
├─ JavaScript compiles on client
├─ Layout becomes interactive (no data delay)
├─ Navigation/filters work immediately
└─ Time: ~100ms (imperceptible)

Layer 3: Async Data Fetch (On-Demand)
├─ Client fetches real data AFTER SSR renders
├─ Placeholders fade → real content
├─ Products, orders, banners load separately
├─ Homepage refresh via ISR revalidation
└─ Time: 500ms-2s (background, non-blocking)
```

## Project Structure

```
/Izaan Shop (root)
├─ /backend                    # Express.js API
│  ├─ server.js              # Entry point
│  ├─ db/schema.js           # Drizzle ORM schema (MySQL)
│  ├─ controllers/           # API route handlers
│  ├─ routes/                # API endpoints
│  ├─ middleware/            # Auth, error handling, uploads
│  ├─ utils/                 # Helpers, token generation
│  └─ uploads/               # User uploaded files (sacred!)
│
├─ /next-frontend            # Next.js 14+ frontend
│  ├─ src/app/              # Next.js App Router
│  │  ├─ page.js            # Homepage
│  │  ├─ admin/dashboard    # Admin dashboard
│  │  └─ api/revalidate     # Cache invalidation endpoint
│  │
│  ├─ src/components/        # React components
│  │  ├─ admin/             # Dashboard components
│  │  ├─ shop/              # Product shop components
│  │  └─ common/            # Shared UI components
│  │
│  ├─ src/hooks/            # Custom React hooks
│  ├─ src/store/            # Zustand state management
│  ├─ src/utils/            # API client, formatting
│  ├─ src/lib/              # Server-side helpers, data fetching
│  ├─ public/               # Static assets
│  ├─ .env.local            # Environment variables
│  └─ .next/                # Build output (included in cPanel)
│
├─ /izaan_monolith          # Backup structure (for reference)
├─ entry.js                 # Monolith entry point (both front + back)
├─ sync_monolith.sh         # Deployment script
├─ package.json             # Root dependencies
├─ schema.sql               # Database schema
└─ ARCHITECTURE.md          # Detailed architecture docs
```

---

# 🛠️ TECHNOLOGY STACK

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | SSR/ISR React framework | 14+ |
| **Styling** | Tailwind CSS | Utility-first CSS | 3.x |
| **UI Library** | Lucide React | Icons | Latest |
| **Animations** | Framer Motion | Smooth transitions | Latest |
| **State** | Zustand | Global state (user, cart) | Latest |
| **Backend** | Express.js | REST API | 4.x |
| **Database ORM** | Drizzle ORM | Type-safe queries | Latest |
| **Database** | MySQL | Relational DB | 8.0+ |
| **Auth** | JWT (jsonwebtoken) | Token-based auth | 9.x |
| **File Upload** | Multer | Multipart form handler | 1.x |
| **Image Optimization** | Next.js Image | Responsive images | Built-in |
| **Caching** | Next.js ISR | Incremental static revalidation | Built-in |

---

# 💻 DEVELOPMENT SETUP

## For Local Development (Mac/Windows/Linux)

### Prerequisites
- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- MySQL 8.0+ running locally (or Docker)
- Git installed

### Step 1: Clone & Install
```bash
cd /path/to/Izaan\ Shop
npm install                    # Root dependencies
cd next-frontend && npm install
cd ../backend && npm install
```

### Step 2: Database Setup (CHOOSE ONE)

#### Option A: Use Live cPanel Database (Recommended for testing)
```bash
# In /next-frontend/.env.local
DATABASE_URL="mysql://izaansho_main:IzaanShop2024Secure@srv100.servercpanel.com/izaansho_db?connection_limit=5"
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
```

#### Option B: Use Local MySQL
```bash
# Create local database
mysql -u root -p
mysql> CREATE DATABASE izaanshop CHARACTER SET utf8mb4;
mysql> exit

# In .env.local
DATABASE_URL="mysql://root:@localhost:3306/izaanshop"
NEXT_PUBLIC_API_URL="http://localhost:5001/api"

# Sync schema
cd next-frontend
npx drizzle-kit push
```

### Step 3: Start Development Servers
```bash
# Terminal 1: Backend API
cd backend
node server.js
# Should see: ✅ Server running on http://localhost:5001

# Terminal 2: Frontend Dev Server
cd next-frontend
npm run dev
# Should see: ✅ Local: http://localhost:3000
```

### Step 4: Verify Setup
- Visit http://localhost:3000 → Should see homepage
- Visit http://localhost:3000/admin/login → Should see admin login
- Check http://localhost:5001/products → Should return JSON

---

# 🗄️ DATABASE MANAGEMENT

## Schema Overview

Database is managed via **Drizzle ORM** in [backend/db/schema.js](backend/db/schema.js). Use this, NEVER raw SQL unless emergency.

### Key Tables
- `users` - Customer accounts (email, password hash, profile)
- `products` - Product catalog (name, price, images, descriptions)
- `categories` - Product categories (name, slug, icon)
- `orders` - Customer orders (status, shipping, total)
- `order_items` - Items within orders
- `coupons` - Discount codes
- `banners` - Homepage banners
- `shipping_methods` - Shipping options (name, price, status)
- `admin_approvals` - Pending admin account requests
- `settings` - Shop settings (payment numbers, etc.)

## Common Database Tasks

### View Live Database (cPanel)
```bash
# Install MySQL client if needed
brew install mysql-client

# Connect to live database
mysql -h srv100.servercpanel.com \
      -u izaansho_main \
      -p"IzaanShop2024Secure" \
      izaansho_db

# List tables
mysql> SHOW TABLES;

# Check product count
mysql> SELECT COUNT(*) FROM products;
```

### Push Schema Changes
```bash
# After editing backend/db/schema.js
cd backend
npx drizzle-kit push
# This syncs schema.js to live database
```

### Backup Database
```bash
mysqldump -h srv100.servercpanel.com \
          -u izaansho_main \
          -p"IzaanShop2024Secure" \
          izaansho_db > backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -h srv100.servercpanel.com \
      -u izaansho_main \
      -p"IzaanShop2024Secure" \
      izaansho_db < backup-20260409.sql
```

---

# 🌐 cPANEL HOSTING GUIDE

## What is cPanel?

cPanel is a **web hosting control panel** that manages shared hosting. Izaan Shop runs on cPanel's **Passenger** app server, which manages Node.js processes for high-traffic sites without expensive VPS costs.

**Hosting Details:**
- **Provider:** ServCPanel
- **Server:** srv100.servercpanel.com
- **Account:** izaansho_main
- **App Name:** izaan_monolith
- **Domain:** izaanshop.com
- **Database:** MySQL (5 connection pool, 20GB storage)
- **Memory Limit:** Shared (auto-tuned per request)
- **Node.js Version:** 18.x (Passenger managed)

## cPanel Login & Navigation

1. **URL:** cpanel.servercpanel.com/cpanel
2. **Username:** izaansho
3. **Password:** [Use your secure password manager]

### Key Sections
| Section | Purpose | Path |
|---------|---------|------|
| Node.js Apps | Start/stop/restart app | cPanel Home → Node.js Apps |
| File Manager | Upload/edit files | cPanel Home → File Manager |
| MySQL Databases | Backup/restore DB | cPanel Home → MySQL Databases |
| Cron Jobs | Scheduled tasks | cPanel Home → Cron Jobs |
| Addon Domains | Additional domains | cPanel Home → Addon Domains |
| SSL/TLS | HTTPS certificates | cPanel Home → SSL/TLS |

## cPanel File System

```
/home/izaansho
├─ /public_html          # Main website root
│  └─ (static assets only)
│
├─ /izaan_monolith       # Node.js app root (IMPORTANT!)
│  ├─ entry.js          # Startup file
│  ├─ package.json
│  ├─ .env              # Environment variables (sacred!)
│  ├─ /backend          # Backend source
│  ├─ /next-frontend    # Frontend source
│  └─ /node_modules     # Dependencies (auto-installed)
│
└─ /logs                # Application logs
   └─ /node-*           # Node.js app logs
```

### Important: Application Root Setup

In cPanel Node.js Apps, the app must be configured as:
- **Application Root:** `/izaan_monolith`
- **Application URL:** `https://izaanshop.com`
- **Startup File:** `entry.js`
- **Node Version:** 18.x
- **NPM Version:** Auto

---

# 🚀 DEPLOYMENT WORKFLOW

## Pre-Deployment Checklist

- [ ] All code changes completed and tested locally
- [ ] `npm run build` runs successfully (no errors)
- [ ] Environment variables are correct in `.env.local`
- [ ] Database changes pushed with `npx drizzle-kit push`
- [ ] No console errors in browser dev tools
- [ ] Mobile responsive check (viewport sizes)

## Automatic Deployment Script

Use **sync_monolith.sh** to package and deploy:

```bash
cd /path/to/Izaan\ Shop
bash sync_monolith.sh
```

What it does:
1. ✅ Builds Next.js frontend (`npm run build`)
2. ✅ Packages backend, frontend, .next build into ZIP
3. ✅ Creates `izaan_full_deploy.zip` (~30-40MB)
4. ✅ Outputs next steps

### Manual Steps on cPanel

1. **Upload ZIP to cPanel**
   - File Manager → /home/izaansho → Upload izaan_full_deploy.zip
   - Right-click → Extract

2. **Update Node.js App**
   - cPanel → Node.js Apps → Edit izaan_monolith
   - Verify "Application Root" = `/izaan_monolith`
   - Verify "Startup File" = `entry.js`
   - Click "Save"

3. **Install Dependencies**
   - Still in Node.js Apps → "Restart" button
   - cPanel auto-runs `npm install` from package.json

4. **Set Environment Variables (Critical!)**
   - In Node.js Apps → Environment Variables for izaan_monolith
   - Add/Update:
     ```
     NODE_ENV=production
     DATABASE_URL=mysql://izaansho_main:IzaanShop2024Secure@srv100.servercpanel.com/izaansho_db?connection_limit=5&pool_timeout=20
     NEXT_PUBLIC_API_URL=https://izaanshop.com/api
     REVALIDATE_SECRET=<generate-new-secret-below>
     ```

5. **Generate REVALIDATE_SECRET** (for cache invalidation)
   ```bash
   # Run locally, copy output
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Paste the 64-char string into cPanel env vars
   ```

6. **Restart App**
   - Node.js Apps → Click "Restart" button
   - Wait 10-15 seconds for startup
   - Check logs: tail `/home/izaansho/logs/node-*`

7. **Verify Deployment**
   - Visit https://izaanshop.com → Should load homepage
   - Visit https://izaanshop.com/admin/login → Should load admin panel
   - Check console errors (F12 → Console tab)

## Minimal Update Approach (Faster)

If you only changed UI code (no backend/schema):

Instead of full sync_monolith.sh, just:

1. Build frontend locally: `cd next-frontend && npm run build`
2. Upload only `.next` and `public` folders via cPanel File Manager
3. Restart Node.js app in cPanel
4. Done! (No dependency re-install needed)

---

# 🤖 FOR AI ASSISTANTS (GPT/Claude)

## Critical Context for AI

Before making ANY code changes, understand:

### Memory & Context Limits
- Keep responses concise and actionable
- Reference specific files with full paths
- Use line numbers when possible
- Break large refactors into small, testable steps

### Code Structure Rules

1. **Never modify without understanding**: Always read the existing component/function first
2. **Three-layer pattern**: Remember SSR → Hydration → Client Fetch pattern
3. **Database changes rare**: Only modify schema if absolutely necessary
4. **Test before suggesting**: Verify code compiles with `npm run build`

### When to Suggest vs. Implement

| Scenario | Action |
|----------|--------|
| Bug fix | Implement immediately |
| Feature addition | Discuss design, then implement |
| Performance optimization | Benchmark before/after |
| Large refactor | Break into small PRs (max 3 files changed per task) |
| Database schema change | Explain impact on all dependent code |

### Files You'll Interact With Most

**Frontend (Next.js)**
- `next-frontend/src/app/` - Page routes
- `next-frontend/src/components/` - React components
- `next-frontend/src/hooks/` - Custom hooks
- `next-frontend/src/utils/api.js` - API client
- `next-frontend/next.config.mjs` - Build config

**Backend (Express)**
- `backend/server.js` - API entry point
- `backend/db/schema.js` - Database schema
- `backend/controllers/` - API logic
- `backend/routes/` - Endpoint definitions
- `backend/middleware/authMiddleware.js` - Auth logic

**Deployment**
- `sync_monolith.sh` - Deployment script
- `.env.local` - Environment config
- `entry.js` - Monolith entry

### Common AI Tasks

| Task | How to Approach |
|------|-----------------|
| Add API endpoint | 1. Add route in `backend/routes/` 2. Add controller in `backend/controllers/` 3. Test with curl |
| Create admin page | 1. Copy existing section component 2. Create new route in `next-frontend/src/app/admin/` 3. Add to sidebar |
| Fix styling bug | 1. Identify component in `src/components/` 2. Check Tailwind classes 3. Use browser DevTools to verify |
| Optimize query | 1. Check `backend/db/schema.js` 2. Add indexes if needed 3. Benchmark with `console.time()` |
| Add feature to dashboard | 1. See AdminDashboardClient component 2. Add new `useAdminTab()` hook 3. Update tab switch logic |

### Red Flags (Stop and Ask)

- Modifying authentication logic → Verify with human first
- Deleting database tables → ALWAYS ask and backup first
- Changing API response format → Document migration path
- Touching .env files → Never overwrite, only suggest values
- Modifying entry.js → This affects monolith startup, test locally first

### Deployment Verification Checklist

After implementing any changes:

```bash
# 1. Build successfully
cd next-frontend && npm run build
# Should show: ✅ Using NEXT_PUBLIC_API_URL: https://izaanshop.com/api

# 2. No TypeScript errors
npm run build
# Should complete without warnings

# 3. Check specific file edits
git diff  # View all changes

# 4. Test locally if backend/database changed
node backend/server.js
# Should start without errors

# 5. Log any important changes
echo "✅ Added caching to ProductSection component" >> CHANGES.log
```

---

# 👨‍💻 FOR HUMAN DEVELOPERS

## Getting Started (First Time)

1. **Clone repo**
   ```bash
   git clone https://github.com/[owner]/Izaan-Shop.git
   cd "Izaan Shop"
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd next-frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Set up environment**
   ```bash
   # Copy to next-frontend/.env.local
   DATABASE_URL="mysql://izaansho_main:IzaanShop2024Secure@srv100.servercpanel.com/izaansho_db?connection_limit=5"
   NEXT_PUBLIC_API_URL="http://localhost:5001/api"
   ```

4. **Start dev servers**
   ```bash
   # Terminal 1: Backend
   cd backend && node server.js

   # Terminal 2: Frontend
   cd next-frontend && npm run dev
   ```

## Daily Development Workflow

### Opening Changes
```bash
# See what changed since last deployment
git status
git log --oneline -10

# See differences
git diff
```

### Making Changes

**Frontend Only:**
```bash
cd next-frontend
# Edit component in src/components/
npm run dev  # Auto-reloads on save
# Test in browser
git add .
git commit -m "Fix: button alignment on mobile"
```

**Backend Only:**
```bash
cd backend
# Edit controller or route file
# Restart server: Ctrl+C, then `node server.js`
# Test with curl or Postman
git add .
git commit -m "Feat: add product filtering by category"
```

**Both Frontend & Backend:**
```bash
# 1. Backend changes
cd backend && npm test  # if tests exist

# 2. Frontend changes
cd ../next-frontend && npm run build

# 3. Commit when both are working
git add .
git commit -m "Feat: new checkout flow integration"
```

### Database Schema Changes

```bash
# 1. BACKUP first
mysqldump -h srv100.servercpanel.com \
  -u izaansho_main \
  -p"IzaanShop2024Secure" \
  izaansho_db > backup-$(date +%Y%m%d).sql

# 2. Edit schema
vim backend/db/schema.js

# 3. Push to live database
npx drizzle-kit push

# 4. Update any affected API controllers
vim backend/controllers/productController.js

# 5. Commit changes
git add .
git commit -m "Feat: add product SKU field"
```

## Testing Checklist

Before pushing to production:

### Local Testing
- [ ] `npm run build` passes without errors
- [ ] No TypeScript errors in output
- [ ] Backend `node server.js` starts without errors
- [ ] Frontend `npm run dev` compiles without errors
- [ ] Can log in as admin
- [ ] Can add/edit/delete products
- [ ] Can go through checkout

### Browser Testing
- [ ] Chrome desktop (1920x1080)
- [ ] Firefox desktop (1920x1080)
- [ ] Safari desktop (MacBook Pro)
- [ ] Safari mobile (iPhone 12 Pro)
- [ ] Chrome mobile (Android, if available)
- [ ] Tablet view (iPad width ~768px)

### API Testing
```bash
# Test admin login
curl -X POST http://localhost:5001/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Test product fetch
curl http://localhost:5001/products | jq .

# Test add product (requires JWT token)
curl -X POST http://localhost:5001/products \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Deployment Steps

```bash
# 1. Final local test
npm run build  # Frontend builds

# 2. Create deployment package
bash sync_monolith.sh
# Creates: izaan_full_deploy.zip

# 3. Upload to cPanel
# - Open cPanel File Manager
# - Navigate to /home/izaansho
# - Upload izaan_full_deploy.zip
# - Right-click → Extract

# 4. Update cPanel Node.js App
# - cPanel → Node.js Apps
# - Edit izaan_monolith
# - Click "Restart"
# - Wait 15 seconds

# 5. Verify
# - Visit https://izaanshop.com
# - Check console for errors (F12)
# - Test admin dashboard

# 6. Monitor logs
# - cPanel → Raw Access Logs
# - Or SSH: tail -f ~/logs/node-*
```

## Code Style Guide

### JavaScript/JSX
- Use ES6+ syntax (const/let, arrow functions, template strings)
- Component names in PascalCase (ProductCard.jsx)
- File names in camelCase for utilities (formatPrice.js)
- Add JSDoc comments for complex functions

```javascript
/**
 * Formats price to USD with 2 decimals
 * @param {number} price - The raw price
 * @returns {string} Formatted price like "$99.99"
 */
const formatPrice = (price) => {
  return `$${(price / 100).toFixed(2)}`;
};
```

### CSS/Tailwind
- Use Tailwind utility classes (no custom CSS unless necessary)
- Mobile-first: sm: md: lg: lg: xl: responsive breakpoints
- Color system: Use primary, secondary, success, warning, danger, dark, light
- Spacing: Use 2, 4, 6, 8, 12, 16, 20, 24 etc (multiples of 4px)

```jsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
  Click me
</button>
```

### Database (Drizzle ORM)
- Table names plural: `products`, `categories`, not `product`, `category`
- Use camelCase for column names: `createdAt`, `updatedAt`
- Always include timestamps: `createdAt`, `updatedAt`
- Use MySQL TEXT for long content, LONGTEXT for base64 images (but avoid!)

---

# ✅ COMMON TASKS & SOLUTIONS

## Task: Add a New Product Field

1. **Update Database Schema**
   ```javascript
   // backend/db/schema.js
   export const products = sqlTable('products', {
     // ... existing fields
     sku: varchar('sku', { length: 50 }).unique(),
     warehouseLocation: varchar('warehouse_location', { length: 100 }),
   });
   ```

2. **Push Schema**
   ```bash
   npx drizzle-kit push
   ```

3. **Update API Controller**
   ```javascript
   // backend/controllers/productController.js
   const createProduct = async (req, res) => {
     const { name, price, sku, warehouseLocation } = req.body;
     // ... add sku and warehouseLocation to INSERT
   };
   ```

4. **Update Frontend Form**
   ```jsx
   // next-frontend/src/components/admin/ProductModal.jsx
   <input name="sku" placeholder="SKU" />
   <input name="warehouseLocation" placeholder="Warehouse Location" />
   ```

5. **Test & Deploy**
   ```bash
   npm run build
   bash sync_monolith.sh
   ```

## Task: Fix Admin Dashboard Navigation Not Working

**Root Cause:** Usually hydration mismatch or state sync issue.

**Solution:** Use the AdminDashboardClient with `useAdminTab` hook:
- Tab change → `router.push(?tab=new_tab)` updates URL
- `useAdminTab()` fetches only the active tab's data
- No hydration mismatch (layout ready before data)
- Check console logs with 🔄 emoji to verify tab switching

## Task: Homepage Images Not Showing

**Root Cause:** API URL mismatch (localhost vs production)

**Solution:**
```bash
# 1. Update .env.local
NEXT_PUBLIC_API_URL="https://izaanshop.com/api"  # NOT localhost!

# 2. Rebuild
npm run build

# 3. Deploy new build
bash sync_monolith.sh
```

## Task: Database Too Slow

**Root Cause:** Missing indexes or N+1 queries

**Solution:**
```javascript
// backend/db/schema.js
export const products = sqlTable('products', {
  id: int().primaryKey().autoincrement(),
  name: varchar('name').notNull(),
  categoryId: int().notNull(),
  // ... other fields
}, (table) => ({
  categoryIdx: index('category_idx').on(table.categoryId),
  slugIdx: index('slug_idx').on(table.slug),
}));
```

Then: `npx drizzle-kit push && restart app`

## Task: Add New Admin Dashboard Tab

1. **Create Data Hook**
   ```javascript
   // In useAdminTab.js, add new case:
   case 'new_tab':
     response = await api.get('/new-endpoint');
     setData(response.data);
     break;
   ```

2. **Create Component**
   ```jsx
   // next-frontend/src/components/admin/NewTabSection.jsx
   const NewTabSection = ({ data, onAdd, onEdit, onDelete }) => {
     return <div>...</div>;
   };
   ```

3. **Add to Dashboard**
   ```jsx
   // AdminDashboardClient.jsx
   {activeTab === 'new_tab' && (
     <NewTabSection 
       data={tabData.data} 
       onAdd={() => handleOpenModal('newtab')}
       // ...
     />
   )}
   ```

4. **Add Sidebar Link**
   ```jsx
   // AdminSidebar.jsx
   { id: 'new_tab', icon: IconComponent, label: 'New Tab' }
   ```

---

# 🛑 SAFETY RULES & DO'S/DON'TS

## Sacred Files (NEVER MODIFY)

- ❌ `.env` on cPanel (only update via cPanel UI)
- ❌ `/uploads/*` folder (user files stored here)
- ❌ `entry.js` (unless you understand monolith startup)
- ❌ Database backups in root
- ❌ package-lock.json (let npm manage it)

## Do's ✅

- ✅ **Always backup** before database schema changes
- ✅ **Test locally** before pushing to production
- ✅ **Use console logs** with emoji markers for debugging
- ✅ **Revalidate cache** when product/category changes
- ✅ **Use HTTPS** for all production API calls
- ✅ **Set NODE_ENV=production** on cPanel (prevents debug logs)
- ✅ **Monitor cPanel logs** after deployment (first 5 minutes)

## Don'ts ❌

- ❌ **Never change DATABASE_URL** on Mac without knowing why
- ❌ **Never run `npm install` on cPanel** (it auto-runs)
- ❌ **Never push .env files** to git
- ❌ **Never modify** schema.prisma without running `db push`
- ❌ **Never delete** .next folder manually (let build script create it)
- ❌ **Never use** `sudo npm install` (causes permission issues)
- ❌ **Don't commit** build artifacts (.next, node_modules)

## Git Best Practices

```bash
# Good commit message
git commit -m "Fix: homepage cache invalidation on product update"

# Bad commit message
git commit -m "fixed stuff"

# Good branch name
git checkout -b fix/admin-navigation-bug
git checkout -b feat/add-discount-codes

# Never do this
git push --force  # Rewrites history, dangerous!
git commit --amend  # Changes already-pushed commits
```

---

# 🚨 EMERGENCY PROCEDURES

## App Not Starting

**Symptoms:** cPanel shows "Exited" or "Not running"

**Steps:**
1. Check logs: `tail -f ~/logs/node-*`
2. Look for error: "Cannot find module", "Syntax error", etc.
3. Common fixes:
   ```bash
   # Missing dependency
   npm install [package-name]
   
   # Wrong Node version
   # cPanel → Node.js Apps → Change Node version to 18.x
   
   # Port already in use
   # cPanel → Restart button (kills old process)
   ```

## Database Connection Failed

**Symptoms:** Logs show "ECONNREFUSED", "Access denied", "ETIMEDOUT"

**Steps:**
1. Verify DATABASE_URL in cPanel env vars:
   ```
   mysql://izaansho_main:IzaanShop2024Secure@srv100.servercpanel.com/izaansho_db?connection_limit=5
   ```

2. Test connection locally:
   ```bash
   mysql -h srv100.servercpanel.com \
     -u izaansho_main \
     -p"IzaanShop2024Secure" \
     izaansho_db -e "SELECT 1;"
   ```

3. Check cPanel MySQL status: cPanel → MySQL Databases

## Homepage Shows "500 Internal Server Error"

**Root Cause:** Usually API endpoint failing

**Debug Steps:**
1. Open browser console (F12)
2. Check Network tab for failed requests
3. Verify NEXT_PUBLIC_API_URL matches production domain
4. Check cPanel logs: `/home/izaansho/logs/node-*`
5. Look for specific error in logs

**Common fixes:**
- API URL is `http://localhost` instead of `https://izaanshop.com`
- Missing REVALIDATE_SECRET
- Backend not responding on port 5001

## Cache Invalidation Not Working

**Symptoms:** Admin adds product but homepage still shows old list

**Debug:**
1. Check REVALIDATE_SECRET is set in cPanel env vars
2. Verify `/api/revalidate` endpoint exists
3. Check backend logs for revalidation calls
4. Manually revalidate:
   ```bash
   curl -X POST "https://izaanshop.com/api/revalidate?secret=YOUR_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"tag":"shop-init"}'
   ```

## Disk Space Critical

**cPanel → Storage Usage** shows near 100%

**Solutions:**
1. Delete old backups: `rm ~/backup-*.sql`
2. Clear npm cache: `npm cache clean --force`
3. Clear .next cache: `rm -rf next-frontend/.next/cache`
4. Delete old uploads: Review `/uploads` for unused files

---

# 📞 SUPPORT & ESCALATION

## Quick Reference

| Issue | Contact | Time |
|-------|---------|------|
| Domain/DNS | cPanel Support | 1-2 hours |
| Database | cPanel Support | 1-2 hours |
| Hosting limits | Upgrade plan | Immediate |
| Code bugs | AI Assistant (me!) | Minutes |
| Performance | Optimize code | Hours |

## Monitoring Checklist

Run weekly:
- [ ] Check cPanel disk usage (<80%)
- [ ] Review error logs for patterns
- [ ] Monitor database size (should grow ~5-10MB/month)
- [ ] Test admin login from different browser
- [ ] Verify https certificate validity (30+ days remaining)
- [ ] Check Google Analytics for traffic anomalies

---

# 📚 QUICK LINKS

- **Live Site:** https://izaanshop.com
- **Admin Dashboard:** https://izaanshop.com/admin/dashboard
- **cPanel:** cpanel.servercpanel.com/cpanel
- **GitHub:** [Link to repo if applicable]
- **Architecture Docs:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Hosting Guide:** [cpanel_hosting_guide.md](cpanel_hosting_guide.md)

---

**Last Updated:** April 9, 2026 | **Version:** 2.0 | **Status:** Production Live ✅

**Built with precision for Izaan Shop.** 🚀✨
