# 🛠️ Izaan Shop - Error Solutions & Troubleshooting

This document serves as a persistent knowledge base for identified errors and their resolutions in the Izaan Shop project. Agents should refer to this file before starting any troubleshooting.

---

## 1. Database Connection Errors (500 Internal Server Error)

### Symptom
Axios returns a **500 status code** after switching databases (e.g., from XAMPP to Railway).

### Root Cause
The new database is empty and does not contain the required tables (Product, Category, Order, etc.).

### Solution
1. **Sync Schema**: Run the following command from the `backend` directory to push your Prisma schema to the new database:
   ```bash
   npx prisma db push
   ```
2. **Verify Connection**: Ensure the `DATABASE_URL` in `.env` uses the **Public Connection String** if connecting from outside Railway.
3. **Restart Server**: Restart the backend server after syncing.

---

## 2. React Hydration Errors

### Symptom
Console error: `In HTML, <div> cannot be a descendant of <p>`.

### Root Cause
Invalid HTML nesting (e.g., putting a `motion.div` or a complex component inside a `<p>` tag).

### Solution
Replace the wrapping `<p>` tag with a `<div>` or use `<span>` if appropriate.

---

## 3. Sidebar/Navbar 404 Errors

### Symptom
`AxiosError: Request failed with status code 404` when saving a Category.

### Root Cause
Incorrect pluralization logic in the frontend (e.g., adding an 's' to "category" results in "categorys" instead of the expected "categories").

### Solution
Add a specific check for "category" in the `handleSaveItem` logic to use the correct `/categories` endpoint.

---

## 4. Logo/Image 404s in Analytics

### Symptom
Broken images in the "Top Selling Products" section.

### Root Cause
The `images` field in the database is a JSON string and needs to be parsed before being sent to the frontend.

### Solution
In the backend controller (e.g., `orderController.js`), use `JSON.parse(product.images)` to convert the string into an object before mapping the response.

---

## 5. Vercel Deployment Failures (Environment)

### Symptom
Backend fails to connect to database in production.

### Root Cause
Using `RAILWAY_PRIVATE_DOMAIN` which is only available within Railway's internal network.

### Solution
Use the **Public Proxy Domain** (e.g., `centerbeam.proxy.rlwy.net`) and **Public Port** in Vercel environment variables.

---
## 6. Missing Branded Icons (lucide-react)

### Symptom
`AxiosError: Export Facebook doesn't exist in target module` or similar import errors for branded icons (e.g., WhatsApp, Instagram).

### Root Cause
`lucide-react` focuses on generic UI icons and does not include branded icons like Facebook or WhatsApp.

### Solution
1. **Do Not Import**: Remove the branded icon name from the `lucide-react` import statement.
2. **Custom SVG**: Create a simple SVG component for the branded icon within the component itself or in a separate file.
3. **Example**: 
   ```jsx
   const FacebookIcon = ({ className }) => (
     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
     </svg>
   );
   ```

---

## 7. Next.js Product Details 404

### Symptom
Navigating to `/product/[slug]` in Next.js results in a 404 error even when the product exists.

### Root Cause
1. **Server-Side Fetch**: Next.js server components require absolute URLs for `fetch`. If `baseUrl` is relative, it fails.
2. **Slug Mismatch**: Backend logic might fail if slugs are improperly formatted or numeric.

### Solution
1. **Absolute URL**: Always use `process.env.NEXT_PUBLIC_API_URL` or a fallback like `http://localhost:5001/api` in `fetch`.
2. **Defensive Controller**: Update `productController.js` to handle both numeric IDs and string slugs robustly.

---

## 8. Variable Product & Gallery Issues

### Symptom
Users "can't add variable products" or are missing gallery options in the admin dashboard. Variants don't show specific images when selected.

### Root Cause
1. **Payload Serialization**: Sending `attributes` and `variants` as JSON strings sometimes causes the backend (.map function) to fail if not parsed.
2. **Missing State**: Gallery state was not initialized or mapped in the submission payload.
3. **Image Swapping**: Frontend `ProductDetail` components weren't checking for `activeVariant.image` when rendering the main preview.

### Solution
1. **Structured Data**: Send `attributes` and `variants` as objects/arrays. Let the API client handle serialization.
2. **Backend Parsing**: Use `typeof attributes === 'string' ? JSON.parse(attributes) : attributes` in controllers for resilience.
3. **Gallery Hidden Field**: Use a hidden input or state mapping to ensure `gallery` images are included in the `data` object.
4. **Variant Image Priority**: Update `ProductDetailClient.jsx` to prioritize `activeVariant.image` as the main display image and reset the gallery index (setActiveImg(0)) on selection.

---

## 9. ProductModal JSON Parsing Error

### Symptom
Runtime SyntaxError: "[object Object]" is not valid JSON in `ProductModal`.

### Root Cause
The component attempted to call `JSON.parse` on `editingItem.images`, which was already an object (pre-parsed by the backend controller).

### Solution
Implemented a `parseImages` helper that checks the type of the images property before attempting to parse it, ensuring it only parses if the data is a string.

---

## 10. Network Error: Cannot reach the backend API

### Symptom
Console Error: `🌐 NETWORK ERROR: Cannot reach the backend API.`

### Root Cause
1. **Backend Not Running**: The Node.js server (express) is not started or has crashed.
2. **Incorrect API URL**: The `NEXT_PUBLIC_API_URL` in `.env.local` does not match the backend's port or domain.
3. **CORS Blocker**: The backend does not whitelist the frontend's origin (e.g., localhost:3001).

### Solution
1. **Check Backend**: Ensure you have run `npm run dev` in the `/backend` directory.
2. **Verify Env**: Check `next-frontend/.env.local` for `NEXT_PUBLIC_API_URL=http://localhost:5001/api`.
3. **CORS Update**: If using a new port (like 3001), ensure it's added to `allowedOrigins` in `backend/server.js`.

## 11. Prisma Create Error: categoryId: NaN

### Symptom
Prisma error: `Invalid prisma.product.create() invocation`. Request payload shows `categoryId: NaN`.

### Root Cause
Frontend `Modals.jsx` was sending `categoryId` instead of the `category` field expected by the `productController`. This resulted in `Number(undefined)` which is `NaN`, causing a database crash for the required `categoryId` field.

### Solution
1. **Frontend Sync**: Update the `select` name in `Modals.jsx` to `category`.
2. **Backend Resilience**: Update `productController.js` to support both `category` and `categoryId` as fallbacks and add `isNaN()` checks before database operations.

---
*Last Updated: March 26, 2026*
