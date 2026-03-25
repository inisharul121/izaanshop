# 🚀 Izaan Shop - cPanel Hosting Guide (Next.js & Node.js)

This guide covers how to host your **Next.js Frontend** at `yourdomain.com` and your **Node.js/Prisma Backend** at `yourdomain.com/api` using cPanel.

---

## 1. Backend Deployment (Node.js & Express)

### Step 1: Prepare & Upload
1. Zip your `backend` folder locally (exclude `node_modules`, `.env`, and `prisma/dev.db`).
2. In cPanel **File Manager**, create a folder named `backend_app` **outside** of `public_html` (e.g., `/home/username/backend_app`).
3. Upload and extract your zip file there.

### Step 2: Setup Node.js App
1. In cPanel, find **Setup Node.js App** and click **Create Application**.
2. **Application root**: `backend_app`.
3. **Application URL**: Select your domain and type **`api`** in the path box.
   - *Result*: `https://yourdomain.com/api`
4. **Application startup file**: `server.js`.
5. Click **Create**, then click **Run NPM Install**.
6. **Add Environment Variables** in the Node.js UI:
   - `DATABASE_URL`: Your MySQL connection string (e.g., `mysql://user:pass@localhost:3306/db_name`)
   - `JWT_SECRET`: Your secret key.
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://yourdomain.com`

### Step 3: Prisma Generation
If the app fails with a 503 error, ensure Prisma is generated. You can run `npx prisma generate` via the **Terminal** in cPanel within the `backend_app` folder.

---

## 2. Frontend Deployment (Next.js - Full Node.js SSR)

For the best experience (SSR, SEO, Dynamic Routes), follow these steps to host Next.js as a Node.js app.

### Step 1: Pre-Build Locally
1. In `next-frontend/.env.local`, ensure `NEXT_PUBLIC_API_URL` is set to `https://yourdomain.com/api`.
2. Run `npm run build`. This creates the `.next` folder.
3. Zip the following files/folders:
   - `.next`
   - `public`
   - `package.json`
   - `next.config.mjs` (or `.js`)
   - `jsconfig.json` (if present)

### Step 2: Setup Node.js app for Frontend
1. Create a folder named `frontend_app` **outside** of `public_html`.
2. Upload and extract your zipped frontend files there.
3. In cPanel **Setup Node.js App**, click **Create Application**.
4. **Application root**: `frontend_app`.
5. **Application URL**: Select your domain and **leave the path box empty**.
   - *Result*: `https://yourdomain.com`
6. **Application startup file**: 
   - Create a file named `entry.js` in `frontend_app` and paste this:
     ```javascript
     const { createServer } = require('http')
     const { parse } = require('url')
     const next = require('next')
     
     const dev = false
     const hostname = 'localhost'
     const port = process.env.PORT || 3000
     const app = next({ dev, hostname, port })
     const handle = app.getRequestHandler()
     
     app.prepare().then(() => {
       createServer(async (req, res) => {
         try {
           const parsedUrl = parse(req.url, true)
           await handle(req, res, parsedUrl)
         } catch (err) {
           console.error('Error occurred handling', req.url, err)
           res.statusCode = 500
           res.end('internal server error')
         }
       }).listen(port, (err) => {
         if (err) throw err
         console.log(`> Ready on http://${hostname}:${port}`)
       })
     })
     ```
7. Set **Application startup file** to `entry.js`.
8. Click **Create**, then click **Run NPM Install**.

---

## 3. Alternative: Next.js Static Export (Simpler)

If you don't need SSR (Server Side Rendering), use static export.

1. In `next-frontend/next.config.mjs`, add `output: 'export'`.
2. Run `npm run build`. This creates an `out` folder.
3. Upload the **contents** of the `out` folder directly into `public_html`.
4. Create a `.htaccess` file in `public_html` to handle routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🛰️ Final Check
- **Main Site**: `https://yourdomain.com` (Served by `frontend_app` or static `out`)
- **API Backend**: `https://yourdomain.com/api` (Served by `backend_app`)
