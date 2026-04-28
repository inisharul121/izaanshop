# 🚀 Izaan Shop - High-Speed Hosting Guide (Drizzle Monolith)

This guide covers the **optimized Drizzle-based** setup for Izaan Shop. This new architecture is **96% smaller** and **significantly faster** than the old Prisma-based version.

---

## 🛡️ Global Reference: File Safety Manual

Before you delete or overwrite anything on cPanel, check this table:

| File / Folder | Status | Action | Why? |
| :--- | :--- | :--- | :--- |
| **`.env`** | 🛑 **SACRED** | **NEVER DELETE** | Contains your live database passwords and secrets. |
| **`uploads/`** | 🛑 **SACRED** | **NEVER DELETE** | Contains all product images. **Must have "755" permissions.** |
| **`node_modules/`** | ⚠️ **STABLE** | **KEEP** | Only delete if you add new packages to `package.json`. |
| **`.next/`** | ♻️ **DISPOSABLE** | **REPLACE** | The compiled high-speed Next.js frontend. |
| **`backend/`** | ♻️ **DISPOSABLE** | **REPLACE** | The API logic and database schema. |

---

## 🏗️ PART 1: Fresh / First-Time Hosting Setup

### 1. Initial Environment Setup
1.  **Create Node.js App**: Go to cPanel -> **Setup Node.js App**. 
    *   **Application root**: `izaan_app`
    *   **Application URL**: `izaanshop.com`
    *   **Application startup file**: `entry.js` (Root startup)
2.  **Create Database**: Go to cPanel -> **MySQL® Databases**. Create a database and user, then link them with **ALL PRIVILEGES**.
3.  **Remote MySQL**: If you want to connect from your Mac, add **`%`** in cPanel -> **Remote MySQL®**.

### 2. Initial Database Structure
On your Mac, use Drizzle Kit to sync the schema directly to your cPanel database:
```bash
# Update backend/.env with your cPanel DB credentials first!
npx drizzle-kit push
```
*   **Alternative**: Export the SQL from your local XAMPP phpMyAdmin and Import it into cPanel's phpMyAdmin.

### 3. The "Master Sync" & ZIP
This is the **only** command you need to prepare your site:
1.  **On Mac**: Run the master deployment script:
    ```bash
    ./master_deploy.sh
    ```
2.  **What it does**: It builds the frontend, optimizes database queries, and creates a ~20MB **`izaan_full_deploy.zip`**.
3.  **Upload & Extract**: Upload the ZIP to your `izaan_app` folder on cPanel and extract.
4.  **NPM Install**: In cPanel's Node.js App page, click **"Run NPM Install"**.

---

## 🔄 PART 2: Updating Your Site

### 1. Updating the Database Schema
If you added new tables or columns:
1.  **On Mac**: Update `backend/db/schema.js`.
2.  **Sync**: Run `npx drizzle-kit push` (Targeting your cPanel DB).

### 2. The "One-Click" Update
1.  **On Mac**: Run `./master_deploy.sh` to generate a new `izaan_full_deploy.zip`.
2.  **Clean cPanel**: Delete everything in `izaan_app/` **EXCEPT** `.env`, `node_modules/`, and `backend/uploads/`.
3.  **Upload & Extract**: Upload the new ZIP and extract it.
4.  **Restart**: Click **"Restart"** in the cPanel Node.js App dashboard. ✅

---

## 🛑 PART 3: Troubleshooting

### 1. "Out of Storage" Errors
*   **Delete `.next/cache`**: This folder grows large and is safe to delete to free up space.
*   **Check `node_modules`**: If it's too big, delete it and run "NPM Install" again (Drizzle has zero engine overhead).

### 2. ⚡ Speed Issues (Home Page hangs)
*   **Direct DB Access**: Our new system solves "Loopback SSR" errors. The homepage now queries the database directly from the server.
*   **Check Pool Limits**: Ensure `DATABASE_URL` in your `.env` doesn't have too high a connection limit (Keep it at `5-10` for shared hosting).

### 3. Images aren't loading (404)
*   Verify the `uploads/` folder is inside the `backend/` directory.
*   Check that the file permissions in cPanel for the `uploads` folder are set to **`755`**.

---

**Follow this guide to keep Izaan Shop running at peak performance!** 🏎️💨✨
