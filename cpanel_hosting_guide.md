# cPanel Hosting Guide for Izaan Shop (SIMPLIFIED)

This is the simplest way to host your shop where the website is at `yourdomain.com` and the API is at `yourdomain.com/api`.

## 1. Backend Deployment (Node.js & Express)

### Step 1: Upload Files
1. In cPanel **File Manager**, create a folder named `backend_app` **outside** of `public_html` (e.g., `/home/username/backend_app`).
2. Upload your `backend.zip` (without `node_modules`) and extract it there.

### Step 2: Create API Proxy Folder
1. Go to `public_html/` and create an empty folder named **`api`**.
2. (cPanel needs this folder to handle the `/api` URL).

### Step 3: Setup Node.js App
1. In cPanel **Setup Node.js App**, click **Create Application**.
2. **Application root**: `backend_app`.
3. **Application URL**: Select your domain and type **`api`** in the path box.
   - Result: `yourdomain.com/api`
4. **Application startup file**: `server.js`.
21. Click **Create**, then click **Run NPM Install**.
22. **Note**: If you see a **503 Service Unavailable** error in your browser, it usually means the `node_modules` are missing or Prisma hasn't been generated. My recent update added a `postinstall` script, so clicking **Run NPM Install** now generates Prisma automatically.
23. Add the following **Environment variables** in the cPanel Node.js Selector UI:
    - `DATABASE_URL`: `mysql://zaansho_main:PASS@localhost:3306/izaansho_db` (Get actual from `cenv.txt`)
    - `JWT_SECRET`: `supersecretkey_izaan_shop_2024`
    - `NODE_ENV`: `production`
    - `CLIENT_URL`: `https://yourdomain.com`
24. Click **SAVE** and then click **RESTART**.


---

## 2. Frontend Deployment (Vite & React)

### Step 1: Build locally
1. Ensure `frontend/vite.config.js` has `base: '/'`.
2. Ensure `frontend/.env.production` has `VITE_API_URL=https://yourdomain.com/api`.
3. Run `npm run build`.

### Step 2: Upload to cPanel
1. Go to your local `frontend/dist` folder.
2. Select **all files/folders inside `dist`** and zip them (`frontend.zip`).
3. In cPanel **File Manager**, go to the root of **`public_html`**.
4. **Delete everything** inside `public_html` (folders like `frontend`, `backend`, etc. if you created them before).
5. Upload `frontend.zip` into `public_html` and **Extract** it.
   - Now `index.html` should be directly inside `public_html`.

### Step 3: Routing (.htaccess)
Create a `.htaccess` file in the root of `public_html` (if it doesn't exist) and paste this:
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

## Summary of URLs
- **Store**: `https://yourdomain.com`
- **API**: `https://yourdomain.com/api`
- **API Test**: `https://yourdomain.com/api/products`
