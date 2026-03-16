# IzaanShop - Minimal E-Commerce Platform

IzaanShop is a modern, responsive, and conversion-focused e-commerce platform built for educational products, books, and kids' items in Bangladesh. Built with Node.js (Express) and React.js (Vite).

## 🚀 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Zustand, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Design**: Minimalist, Mobile-first, Premium aesthetics.

## 🛠️ Features
- ✅ **Authentication**: JWT-based login and registration.
- ✅ **Product Management**: Category filtering, sorting, and search.
- ✅ **Cart System**: Local persistence, quantity management.
- ✅ **Checkout**: guest-friendly 3-step checkout flow.
- ✅ **User Dashboard**: Order history and profile overview.
- ✅ **Admin Dashboard**: Manage orders and products.
- ✅ **SEO**: Optimized meta tags for all main pages.
- ✅ **Premium UX**: Smooth animations and responsive card-based layouts.

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file from the following template:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/izaan-shop
   JWT_SECRET=your_jwt_secret
   ```
4. `node seeder.js` (Optional: Seed initial data)
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📖 API Documentation
- **Auth**:
  - `POST /api/auth/register`: Register new user
  - `POST /api/auth/login`: Login user
- **Products**:
  - `GET /api/products`: Fetch products (with query params)
  - `GET /api/products/:id`: Fetch single product details
- **Orders**:
  - `POST /api/orders`: Create new order (Protected)
  - `GET /api/orders/myorders`: Fetch user orders (Protected)
  - `GET /api/orders`: Fetch all orders (Admin only)

## 🚢 Deployment Guide
- **Frontend**: Deploy to Vercel/Netlify. Connect to the backend API URL via `VITE_API_URL`.
- **Backend**: Deploy to Render/Railway. Set up MongoDB environment variables.
