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
*Last Updated: March 25, 2026*
