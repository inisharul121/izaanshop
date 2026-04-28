#!/bin/bash

# Configuration
SOURCE_BACKEND="backend"
SOURCE_FRONTEND="next-frontend"
MONOLITH_DIR="izaan_monolith"
ZIP_NAME="izaan_full_deploy.zip"

echo "🚀 Starting Master Monolith Build & Sync..."

# 1. Clean up previous monolith junk
rm -rf "$MONOLITH_DIR" "$ZIP_NAME"
mkdir -p "$MONOLITH_DIR"

# 2. Build the Frontend (CRITICAL for Drizzle/Performance fixes)
echo "🏗️ Building Frontend for Production..."
cd "$SOURCE_FRONTEND"
# Ensure we have the latest dependencies
npm install --no-fund --no-audit
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend Build Failed! Aborting zip."
    exit 1
fi
cd ..

# 3. Sync Backend (excluding Prisma junk)
echo "📦 Syncing Backend Files..."
mkdir -p "$MONOLITH_DIR/backend"
rsync -av --quiet "$SOURCE_BACKEND/" "$MONOLITH_DIR/backend/" \
    --exclude "node_modules" \
    --exclude "uploads" \
    --exclude ".env" \
    --exclude "prisma" \
    --exclude ".prisma"

# 4. Sync Frontend (Built files included)
echo "📦 Syncing Frontend Files..."
mkdir -p "$MONOLITH_DIR/next-frontend"
rsync -av --quiet "$SOURCE_FRONTEND/" "$MONOLITH_DIR/next-frontend/" \
    --exclude "node_modules" \
    --exclude "cache" \
    --exclude ".next/cache" \
    --exclude ".env*" \
    --exclude "prisma" \
    --exclude ".prisma"

# 5. Sync Root Configuration Files
echo "📦 Syncing Root Configuration Files..."
cp entry.js "$MONOLITH_DIR/"
cp package.json "$MONOLITH_DIR/"

# 6. Create Root Configuration (for cPanel entry)
echo "📦 Generating Production-Ready .env for cPanel..."

# NOTE: The User should manually update these credentials in cPanel if they differ
cat <<EOF > "$MONOLITH_DIR/.env"
# [cPanel PRODUCTION ENVIRONMENT]
# Shared hosting often uses 'localhost' as the DB host.
DATABASE_URL="mysql://izaansho_main:IzaanShop2024Secure@localhost:3306/izaansho_db"

PORT=5001
JWT_SECRET=supersecretkey_izaan_shop_2024
JWT_REFRESH_SECRET=supersecretrefreshkey_izaan_shop_2024
STRIPE_SECRET_KEY=sk_test_51...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
CLIENT_URL=https://izaanshop.com
EOF

# 6. Create the Deployment ZIP
echo "🗜️ Creating Deployment ZIP..."
cd "$MONOLITH_DIR" && zip -r "../$ZIP_NAME" . -x "**/node_modules/*" -x "**/cache/*" -x "**/.next/cache/*" -x "**/.git/*"
cd ..

# Final report
SIZE=$(du -h "$ZIP_NAME" | cut -f1)
echo "✅ DONE! Your engine-free deployment package is ready: $ZIP_NAME ($SIZE)"
echo "👉 Upload this to your cPanel. It contains the optimized Drizzle build (No LATERAL JOIN bugs)."
