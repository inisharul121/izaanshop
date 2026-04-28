#!/bin/bash

# Configuration
ZIP_NAME="izaan_laravel_deploy.zip"

echo "🚀 Starting Laravel Deployment Build..."

# 1. Build Frontend Assets
echo "🏗️ Building frontend assets (Vite)..."
npm run build

# 2. Clear Local Caches (to keep the zip clean)
echo "🧹 Clearing local Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# 2. Create the Deployment ZIP (Including Vendor)
echo "🗜️ Creating Deployment ZIP..."
# We include the vendor folder because there is no SSH on cPanel to run composer install.
zip -r "../$ZIP_NAME" . -x "node_modules/*" -x "storage/logs/*" -x ".git/*" -x ".env"

cd ..

# Final report
if [ -f "$ZIP_NAME" ]; then
    SIZE=$(du -h "$ZIP_NAME" | cut -f1)
    echo "✅ DONE! Your deployment package is ready: $ZIP_NAME ($SIZE)"
    echo "👉 Upload this to your cPanel Home directory, extract it into a folder, and follow CPANEL_LARAVEL_DEPLOY.md"
else
    echo "❌ Failed to create ZIP file."
fi
