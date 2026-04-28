#!/bin/bash

# Configuration
SOURCE_BACKEND="backend"
SOURCE_FRONTEND="next-frontend"
MONOLITH_DIR="izaan_monolith"
ZIP_NAME="izaan_full_deploy.zip"

echo "🚀 Starting Master Monolith Sync..."
echo ""

# 0. CRITICAL: Build Next.js locally (cPanel can't build!)
echo "🔨 Building Next.js locally (required for cPanel)..."
cd "$SOURCE_FRONTEND"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Build Next.js
echo "⚙️ Running: npm run build"
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Next.js build failed! Fix errors above and try again."
  exit 1
fi

echo "✅ Next.js build successful!"
cd ..
echo ""

# 0. Clean up previous monolith junk (important if folders were moved)
echo "🧹 Cleaning previous monolith build artifacts..."
rm -rf "$MONOLITH_DIR/node_modules" "$MONOLITH_DIR/next-frontend/node_modules" "$MONOLITH_DIR/backend/node_modules"

# 1. Sync Backend (excluding junk)
echo "📦 Syncing Backend Files..."
rsync -av --delete "$SOURCE_BACKEND/" "$MONOLITH_DIR/backend/" \
    --exclude "node_modules" \
    --exclude "uploads" \
    --exclude ".env" \
    --exclude "*.sql" \
    --exclude "prisma" \
    --exclude ".prisma"

# 2. Sync Frontend (INCLUDING BUILD, excluding Cache/Modules)
echo "📦 Syncing Frontend Files (WITH .next build)..."
rsync -av --delete "$SOURCE_FRONTEND/" "$MONOLITH_DIR/next-frontend/" \
    --exclude "node_modules" \
    --exclude ".next/cache" \
    --exclude ".next/dev" \
    --exclude "cache" \
    --exclude "out" \
    --exclude ".env*" \
    --exclude "prisma" \
    --exclude ".prisma"

# Note: NOT excluding .next folder - cPanel needs the build!
# .next/cache and .next/dev are excluded to save space

# 3. Create Production Environment File (Automatic injection)
echo "📦 Generating Production-Ready .env for cPanel..."

cat <<EOF > "$MONOLITH_DIR/.env"
# [cPanel PRODUCTION ENVIRONMENT]
# Shared hosting MySQL with optimized connection pool
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

# Cache Revalidation Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REVALIDATE_SECRET=your-secret-key-min-32-characters-here
NEXT_PUBLIC_API_URL=https://izaanshop.com/api
EOF

# Copy root supporting files
[ -f "package.json" ] && cp package.json "$MONOLITH_DIR/"
[ -f "entry.js" ] && cp entry.js "$MONOLITH_DIR/"

# 4. Create the Deployment ZIP
echo "🗜️ Creating Deployment ZIP..."
rm -f "$ZIP_NAME"

# ZIP from the contents of izaan_monolith
# Passenger will run npm install when app starts
cd "$MONOLITH_DIR" && zip -r "../$ZIP_NAME" . \
    -x "**/node_modules/*" \
    -x "**/.next/cache/*" \
    -x "**/.next/dev/*" \
    -x "**/cache/*" \
    -x "**/.git/*" \
    -x "**/.env.local" \
    -x "**/.env.development"
cd ..

echo ""
echo "✅ DONE! Your production-ready deployment package is ready: $ZIP_NAME"
echo ""
echo "📊 Package Contents:"
echo "   ✓ Backend source code"
echo "   ✓ Frontend source code"
echo "   ✓ Frontend .next BUILD (ready for cPanel)"
echo "   ✓ Production .env file"
echo "   ✓ All dependencies listed in package.json"
echo ""
echo "📦 Size: $(du -sh "$ZIP_NAME" | cut -f1)"
echo ""
echo "🚀 Next Steps:"
echo "   1. Set REVALIDATE_SECRET in .env (generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo "   2. Upload $ZIP_NAME to cPanel"
echo "   3. Extract in cPanel file manager"
echo "   4. Set Application Root to: /izaan_monolith"
echo "   5. Set Startup File to: entry.js"
echo "   6. Add environment variables in cPanel"
echo "   7. Restart Node.js application"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - The .next folder IS INCLUDED (cPanel doesn't need to rebuild)"
echo "   - node_modules are NOT included (cPanel will run npm install)"
echo "   - If you made code changes, run this script again BEFORE uploading"
echo ""

