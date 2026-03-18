# cPanel Hosting Guide for Izaan Shop

This guide provides step-by-step instructions on how to host the Izaan Shop project (Frontend and Backend) on a cPanel-based web server.

## Prerequisites
- A cPanel account with Node.js support (Setup Node.js App).
- MySQL database access.
- Domain or Subdomain for both Frontend and Backend (e.g., `shop.com` and `api.shop.com`).

---

## 1. Backend Deployment (Node.js & Express)

### Step 1: Prepare the Files
1. Go to your local `backend` folder.
2. Delete the `node_modules` folder.
3. Compress everything inside the `backend` folder into a `.zip` file.

### Step 2: Upload and Extract
1. In cPanel, open **File Manager**.
2. Create a folder named `backend` (outside `public_html` for security, e.g., `/home/username/backend`).
3. Upload your `.zip` file there and extract it.

### Step 3: Setup Node.js App
1. In cPanel, search for **Setup Node.js App**.
2. Click **Create Application**.
3. **Application root**: `backend` (the folder you created).
4. **Application URL**: Select your API subdomain (e.g., `api.shop.com`).
5. **Application startup file**: `server.js`.
6. Click **Create**.
7. Once created, click **Run JS Install** to install dependencies.

### Step 4: Environment Variables
1. In the Node.js App interface, add your environment variables from `.env`:
   - `DATABASE_URL`: `mysql://user:password@localhost:3306/db_name`
   - `JWT_SECRET`: Your secret key.
   - `CLOUDINARY_CLOUD_NAME`: ...
   - `CLOUDINARY_API_KEY`: ...
   - `CLOUDINARY_API_SECRET`: ...
2. Restart the app.

### Step 5: Database Migration
1. In cPanel, create a MySQL database and user via **MySQL Database Wizard**.
2. Assign the user to the database with all privileges.
3. If you have terminal access (SSH), run:
   ```bash
   npx prisma db push
   ```
   *If no SSH, you might need to export your local schema as SQL and import it via phpMyAdmin.*

---

## 2. Frontend Deployment (Vite & React)

### Step 1: Build the App
1. Locally, in the `frontend` folder, update `.env` or `vite.config.js` to point to your live API URL (e.g., `https://api.shop.com/api`).
2. Run:
   ```bash
   npm run build
   ```
3. This will create a `dist` folder.

### Step 2: Upload to cPanel
1. Open **File Manager** and go to `public_html`.
2. Upload the **contents** of the `dist` folder directly into `public_html`.

### Step 3: Handle Routing (SPA)
Since this is a React app, you need a `.htaccess` file in `public_html` to handle routing:
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

## 3. Connecting Frontend and Backend
1. Ensure your frontend calls the correct backend URL.
2. Ensure your backend has the frontend URL in its CORS configuration (if applicable).

---

## Troubleshooting
- **404 on Refresh**: Check the `.htaccess` file.
- **500 Internal Server Error**: Check the Node.js App logs in cPanel.
- **Database Connection Error**: Verify `DATABASE_URL` in the Node.js App environment variables.
