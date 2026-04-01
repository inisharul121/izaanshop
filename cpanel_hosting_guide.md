# 🚀 Izaan Shop - Universal Master Hosting Guide (cPanel Monolith)

This guide covers the **ultimate stable setup** for Izaan Shop. It allows you to develop on your Mac while using the live cPanel database, and update your site in seconds.

---

## 🛡️ 1. File Safety Manual (The "Sacred" vs "Disposable")

Before you delete anything on cPanel, check this table:

| File / Folder | Status | Action | Why? |
| :--- | :--- | :--- | :--- |
| **`.env`** | 🛑 **SACRED** | **NEVER DELETE** | Contains your live database passwords and secrets. |
| **`uploads/`** | 🛑 **SACRED** | **NEVER DELETE** | Contains all product images uploaded by you/users. |
| **`node_modules/`** | ⚠️ **STABLE** | **KEEP** | Only delete if you are changing `package.json` dependencies. |
| **`.next/`** | ♻️ **DISPOSABLE** | **REPLACE** | Replace this folder every time you change the Frontend. |
| **`public/`** | ♻️ **DISPOSABLE** | **REPLACE** | Replace this if you add new static images or logos. |
| **`backend/`** | ♻️ **DISPOSABLE** | **REPLACE** | Replace specific `.js` files when fixing API logic. |

---

## 🌍 2. The "Universal" Developer Setup (Life-Saver)

We have configured your project so you **never** have to change `.env` files between your Mac and cPanel.

### **The Requirement (Do this once):**
1.  Go to cPanel -> **Remote MySQL®**.
2.  Add **`%`** to the Access Hosts.
3.  Now your Mac can talk to the cPanel database directly.

### **The Universal Connection:**
Your `.env` now uses `srv100.servercpanel.com`. This works on your Mac (through the internet) and on cPanel (locally). **DO NOT** change this back to `localhost`.

---

## ⚡ 3. The 30-Second Minimal Update Workflow

You don't need to upload a 20MB ZIP every time. Use these "Minimal" paths:

### **Scenario A: You changed the Frontend (React/CSS/Images)**
1.  **On Mac**: `cd next-frontend && npm run build`
2.  **On Mac (The Tiny-ZIP Trick)**:
    ```bash
    zip -r ../frontend_update.zip .next -x ".next/cache/*"
    ```
    *(This creates a 5-10MB ZIP instead of a 1GB one!)*
3.  **On cPanel**: Delete the old `.next` folder in `izaan_app/next-frontend/`.
4.  **Upload & Extract** `frontend_update.zip` into `izaan_app/next-frontend/`.
5.  **Restart** the Node.js App.

### **Scenario B: You changed one API file (e.g. `productController.js`)**
1.  On Mac: Save your file.
2.  On cPanel: Upload **only** that single `.js` file to the same folder.
3.  **Restart** the Node.js App.

### **Scenario C: You changed a Dependency (`package.json`)**
1.  Upload the new `package.json`.
2.  On cPanel: Click **"Run NPM Install"**.
3.  **Restart** the Node.js App.

---

## 🛠️ 4. Essential Commands (Terminal)

Always run these inside the `izaan_app/` folder in the cPanel Terminal:

*   **To sync Database**: `npx prisma@6.2.1 db push --schema=backend/prisma/schema.prisma`
*   **To update Prisma Client**: `npx prisma@6.2.1 generate --schema=backend/prisma/schema.prisma`
*   **To test connection**: `node backend/test-db.js`
*   **To seed data (Caution!)**: `node backend/seeder.js` *(Note: Our seeder is now in "Safety Mode" and won't delete your board books).*

---

## 🛑 5. If "Resource temporarily unavailable" appears:
1.  **STOP** the Node.js app in cPanel.
2.  Wait 10 seconds.
3.  Run `pkill -u your_username -f node` in the terminal.
4.  **START** the app again.

---

**This is your Master Manual. Keep it safe and follow the "Minimal Update" path to save hours of uploading time!** 🚀✨🚣‍♂️
