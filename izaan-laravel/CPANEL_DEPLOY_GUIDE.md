# 🚀 Izaan Shop - Laravel cPanel Deployment Guide

This guide explains how to deploy this Laravel project to cPanel securely.

---

## 🏗️ Deployment Architecture
For security, we separate the core logic from the public assets:
- **Core Files**: `/home/izaansho/izaan_laravel/` (Hidden from the web)
- **Public Assets**: `/home/izaansho/public_html/` (Accessible via the web)

---

## 📦 Step 1: Prepare the Project on your Mac

You have two ways to prepare your project. **Option A** is the fastest.

### 🚀 Option A: The "One-Click" Way (Using the script)
We have created a script that builds your frontend and zips everything for you.
1. Open your terminal in the `izaan-laravel` folder.
2. Run this command:
   ```bash
   ./laravel_deploy.sh
   ```
3. This will create **`izaan_laravel_deploy.zip`** in your main `Izaan Shop` folder. Done!

---

### 🛠️ Option B: The Manual Way
If you prefer to run the commands yourself:

1. **Build Frontend Assets**:
   Run this in your terminal to compile Tailwind/Vite:
   ```bash
   npm run build
   ```
2. **Create the Deployment ZIP**:
   Run this command to zip the project (including the `vendor` and `public/build` folders):
   ```bash
   zip -r izaan_laravel_deploy.zip . -x "node_modules/*" -x "storage/logs/*" -x ".git/*" -x ".env"
   ```

---

## 📤 Step 2: Upload to cPanel
1. Open **cPanel File Manager**.
2. Go to your **Home** directory (`/home/izaansho/`).
3. Create a folder named `izaan_laravel`.
4. Upload `izaan_laravel_deploy.zip` inside `izaan_laravel` and **Extract**.

---

## 🌐 Step 3: Configure Public Access
We need to link the `public` folder to `public_html`.

### Method A: Terminal (Recommended)
If you have SSH or cPanel Terminal access:
```bash
# Delete the existing public_html (Warning: backup if needed)
rm -rf ~/public_html
# Create a symbolic link
ln -s ~/izaan_laravel/public ~/public_html
```

### Method B: Manual Move (If no Terminal)
1. Move everything inside `~/izaan_laravel/public/` to `~/public_html/`.
2. Edit `~/public_html/index.php` and update the paths:
    ```php
    // 1. Update paths to point to your izaan_laravel folder
    require __DIR__.'/../izaan_laravel/vendor/autoload.php';
    /** @var Application $app */
    $app = require_once __DIR__.'/../izaan_laravel/bootstrap/app.php';

    // 2. IMPORTANT: Force Laravel to recognize public_html as the public folder
    // This fixes the "Vite manifest not found" error!
    $app->usePublicPath(__DIR__);

    // 3. Traditional binding for older package compatibility
    $app->bind('path.public', function() {
        return __DIR__;
    });

    $app->handleRequest(Request::capture());
    ```

---

## ⚙️ Step 4: Final Configuration (No SSH)
1. **Environment**: Create a `.env` file in `~/izaan_laravel/` using the cPanel File Manager.
   - Update `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
   - Set `APP_ENV=production` and `APP_DEBUG=false`.
2. **Run Migrations**: Since you cannot run `php artisan migrate`, you have two options:
   - **Option A (Easy)**: Export your local database from PHPMyAdmin (on Mac) and **Import** it into cPanel PHPMyAdmin.
   - **Option B (Route)**: Temporarily add this to `routes/web.php` and visit `yourdomain.com/run-migrate`:
     ```php
     Route::get('/run-migrate', function () {
         Artisan::call('migrate', ['--force' => true]);
         return "Migration Success!";
     });
     ```
3. **Permissions**: In File Manager, right-click the `storage` and `bootstrap/cache` folders and set permissions to **775** or **777**.

---

## ⚡ Step 5: Optimize Performance (.htaccess)
For a premium experience, you must optimize how the browser loads your site:
1. In cPanel File Manager, go to `~/public_html/`.
2. Create or edit the **`.htaccess`** file.
3. Copy the entire contents of **`PUBLIC_HTACCESS.txt`** (found in your project root) into this file.
4. This will enable:
   - **Gzip Compression**: Makes your site 70% smaller/faster.
   - **Browser Caching**: Makes repeat visits instant.
   - **HTTPS Redirection**: Automatically sends users to the secure site.

---

## ✅ SUCCESS
Your Laravel site should now be live at **https://izaanshop.com**.
