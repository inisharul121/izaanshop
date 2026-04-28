# 🏗️ System Architecture (3 Main Layers)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│  - Shows products with placeholder images initially     │
│  - Fetches full product data + images on page load      │
│  - Handles filters/sorting (real-time API calls)       │
└─────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (Server + Client)          │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ SSR (Server-Side Rendering)                     │   │
│  │ - Generates homepage HTML with products         │   │
│  │ - NO images (keeps cache <2MB)                  │   │
│  │ - ISR: caches for 60 seconds                    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Client-Side (ShopClient.js)                     │   │
│  │ - Fetches fresh products WITH images            │   │
│  │ - Shows images after SSR loads (~500ms)         │   │
│  │ - Handles all filters/sorts in real-time        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Cache Revalidation API                          │   │
│  │ - Endpoint: /api/revalidate                     │   │
│  │ - Clears cache when products change             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────┐
│            EXPRESS.JS BACKEND (API Server)              │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Controllers (productController.js)              │   │
│  │ - GET /api/products (returns products + images) │   │
│  │ - POST/PUT/DELETE (with image upload)           │   │
│  │ - Calls revalidateCache() on changes            │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Database (MySQL via Drizzle ORM)                │   │
│  │ - Stores products, images, categories, orders   │   │
│  │ - Connection pool: 5 (optimized for cPanel)     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 How It Works (Step-by-Step)

### **User visits homepage:**

```
1. Browser → Requests localhost:3000
   ↓
2. Next.js SSR runs (Server-side rendering):
   - Fetches products from DB (NO images)
   - Returns HTML to browser (~200KB)
   - ✨ Page appears instantly (60ms)
   ↓
3. Browser renders placeholder images
   ↓
4. ShopClient.js runs (Client-side JavaScript):
   - Detects missing images
   - Calls API → GET /api/products
   - Receives full products WITH images
   ↓
5. Images appear smoothly (~500ms total)
   ✨ User sees: Product → Placeholder → Real Image
```

### **Admin adds a product:**

```
1. Admin fills form → Submits
   ↓
2. Backend saves to database
   ↓
3. Backend calls: POST /api/revalidate?secret=XXX
   ↓
4. Next.js clears cache (ISR revalidation)
   ↓
5. Next user sees new product automatically ✓
```

### **User filters products:**

```
1. Clicks "Books & Learning" category
   ↓
2. ShopClient updates URL → ?category=books-learning
   ↓
3. API call: GET /api/products?category=books-learning
   ↓
4. Backend queries: SELECT * WHERE categoryId = XXX
   ↓
5. Returns filtered products WITH images
   ↓
6. Products update in real-time (no page reload)
```

---

## 📊 The 3 Layers Explained

| Layer | Technology | What It Does | Performance |
|-------|------------|-------------|-------------|
| **Browser** | JavaScript/React | Interacts with user, shows UI | Real-time |
| **Frontend** | Next.js (SSR) | Serves cached HTML + revalidation | <1s (cached) |
| **Backend** | Express.js + MySQL | API endpoints + database | ~200-400ms |

---

## 🚀 Key Features

### Layer 1: Frontend (Browser)
- ✨ Interactive UI with React
- 🖼️ Shows products + banners
- 🔍 Real-time filters & search
- 🛒 Shopping cart management
- 💳 Checkout flow

### Layer 2: Frontend (Next.js Server)
- 📄 Server-Side Rendering (SSR)
- ⏱️ Incremental Static Regeneration (ISR) - 60s cache
- 🔄 On-Demand Cache Revalidation
- 📦 Image Optimization (AVIF, WebP)
- 🔐 API Route handlers

### Layer 3: Backend (Express.js)
- 🔌 RESTful API endpoints
- 📊 Database queries (Drizzle ORM)
- 🔐 Authentication & Authorization
- 📁 File upload handling
- 📧 Email notifications (future)

---

## 🎯 Performance Optimizations

### Caching Strategy
- **SSR**: Homepage cached for 60 seconds (ISR)
- **Client**: Recent categories cached in sessionStorage
- **Browser**: Images optimized to AVIF/WebP formats
- **Database**: Connection pooling (5 connections for cPanel)

### Bundle Size Optimization
- **Homepage Response**: ~200KB (no images)
- **Image Fetch**: Separate API call (~2-5MB, not cached)
- **Total Load Time**: <1s on repeat visits

### Database Queries
- Indexed columns: slug, categoryId, price, createdAt
- Bulk fetches: Products + attributes + variants in parallel
- Lazy loading: Images loaded only when needed

---

## 📋 Deployment Checklist

### Local Requirements
```bash
# 1. Have Node.js installed
node --version  # Should be v18+

# 2. Build Next.js locally (required for cPanel)
cd next-frontend
npm install
npm run build

# 3. Generate REVALIDATE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Create Monolith
```bash
# Builds everything and creates ZIP
bash sync_monolith.sh
```

### Upload to cPanel
```
1. Extract izaan_full_deploy.zip
2. Set Application Root: /izaan_monolith
3. Set Startup File: entry.js
4. Set Environment Variables:
   - DATABASE_URL
   - REVALIDATE_SECRET
   - NODE_ENV=production
5. Restart Node.js app
```

---

## 🎉 Expected Performance on cPanel

| Metric | Performance |
|--------|-------------|
| **First Load** | ~1-2s (from cache) |
| **Repeat Visit** | <500ms (ISR cached) |
| **Filter Click** | ~500-800ms |
| **Add Product** | ~1-2s (cache refresh) |
| **Image Load** | ~200-500ms |
| **Memory per Request** | 50-80MB |

---

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Server**: Express.js
- **ORM**: Drizzle ORM
- **Database**: MySQL
- **Auth**: JWT (Bearer tokens)
- **Image Upload**: Multer
- **CORS**: Express CORS middleware

### DevOps
- **Hosting**: cPanel (Shared Hosting)
- **Node Runner**: Passenger (built-in)
- **Database**: MySQL with connection pooling
- **SSL**: Let's Encrypt (cPanel integrated)

---

## 📝 File Structure

```
Izaan Shop/
├── backend/                    # Express API
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── db/                    # Database config
│   ├── middleware/            # Auth, error handling
│   ├── utils/                 # Helpers
│   ├── server.js              # Main server file
│   └── package.json
├── next-frontend/             # Next.js App
│   ├── src/
│   │   ├── app/              # Pages & layouts
│   │   ├── components/       # Reusable UI
│   │   ├── lib/              # Server functions
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Global state
│   │   └── utils/            # Helpers
│   ├── public/               # Static assets
│   ├── next.config.mjs       # Next.js config
│   ├── package.json
│   └── .next/                # Build output (generated)
├── entry.js                   # Monolith entry point
├── package.json               # Monolith dependencies
├── ARCHITECTURE.md            # This file
└── sync_monolith.sh          # Deployment script
```

---

## 🚀 Quick Start

1. **Development**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Production**
   ```bash
   # Build and create deployment ZIP
   bash sync_monolith.sh
   
   # Upload izaan_full_deploy.zip to cPanel
   ```

3. **Monitoring**
   - cPanel error logs: `/home/user/logs/`
   - API calls: Browser DevTools Network tab
   - Performance: Next.js built-in analytics

---

## 📞 Support

For issues:
1. Check error logs in cPanel
2. Verify `REVALIDATE_SECRET` is set
3. Check database connection in `.env`
4. Ensure `npm install` ran on cPanel (automatic)
5. Check Node.js version: Should be v18+ on cPanel
