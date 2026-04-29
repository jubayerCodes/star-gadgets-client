<h1 align="center">⭐ Star Gadgets</h1>
<p align="center">A full-stack e-commerce platform for gadgets, built with the MERN stack using Next.js and TypeScript.</p>

<p align="center">
  <a href="https://star-gadgets-client.vercel.app/">🌐 Live Site</a> &nbsp;|&nbsp;
  <a href="https://github.com/jubayerCodes/star-gadgets-server">🖥️ Server Repo</a> &nbsp;|&nbsp;
  <a href="https://github.com/jubayerCodes/star-gadgets-client">💻 Client Repo</a>
</p>

---

## 📌 Overview

**Star Gadgets** is a production-ready e-commerce web application where users can browse, purchase, and manage gadget orders. It features a role-based system with dedicated dashboards for **Admins** and **Customers**, secure JWT-based authentication, SSLCommerz payment gateway integration, and a full order lifecycle management system.

---

## ✨ Features

### 🛍️ Customer
- Browse and search gadgets by category
- Add to cart or use "Buy Now" for instant checkout
- Apply discount coupons with usage-limit validation
- Place orders with Cash on Delivery or Online Payment (SSLCommerz)
- Track orders and cancel unshipped orders
- View order history with payment status

### 🛠️ Admin
- Full product management (add, edit, delete, image upload via Cloudinary)
- Order management with status updates (Pending → Shipped → Delivered)
- Coupon management with discount type, expiry, and per-user usage limits
- User management and role assignment
- Analytics dashboard with charts

### 🔐 Auth & Security
- JWT-based access & refresh token system
- Secure HTTP-only cookies
- Password hashing with bcrypt
- Route protection for admin and customer roles

---

## 🧰 Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 + React 19 | Core framework |
| TypeScript | Type safety |
| TanStack Query | Server state & data fetching |
| TanStack Table | Data tables |
| Zustand | Client-side state management |
| React Hook Form + Zod | Form handling & validation |
| Shadcn UI + Radix UI | UI component library |
| Tailwind CSS v4 | Styling |
| Lexical | Rich text editor |
| Swiper | Product carousels |
| Recharts | Analytics charts |
| Sonner | Toast notifications |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Express.js v5 | REST API framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| Zod | Request validation |
| JWT | Authentication |
| Bcrypt.js | Password hashing |
| Multer + Cloudinary | File & image uploads |
| SSLCommerz | Payment gateway |
| Cookie Parser | Cookie management |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- pnpm
- MongoDB instance (local or Atlas)
- Cloudinary account
- SSLCommerz sandbox credentials

---

### 🖥️ Server Setup

```bash
# 1. Clone the server repository
git clone https://github.com/jubayerCodes/star-gadgets-server.git
cd star-gadgets-server

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env
# Fill in all values in .env (see Environment Variables section below)

# 4. Start development server
pnpm dev
```

The server runs on `http://localhost:5000` by default.

---

### 💻 Client Setup

```bash
# 1. Clone the client repository
git clone https://github.com/jubayerCodes/star-gadgets-client.git
cd star-gadgets-client

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env
# Set NEXT_PUBLIC_API_URL to your server URL

# 4. Start development server
pnpm dev
```

The client runs on `http://localhost:8000` by default.

---

### 🔑 Environment Variables (Server)

Create a `.env` file in the server root with the following keys:

```env
PORT=5000
DB_URL=                        # MongoDB connection string
CLIENT_URL=                    # Frontend URL (e.g. http://localhost:8000)
SERVER_URL=                    # Backend URL (e.g. http://localhost:5000/api/v1)
NODE_ENV=DEVELOPMENT

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

# Bcrypt
BCRYPT_SALT_ROUNDS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SSLCommerz
SSL_STORE_ID=
SSL_STORE_PASS=
SSL_PAYMENT_API=
SSL_VALIDATION_API=
SSL_IPN_URL=

# SSL Redirect URLs (Backend)
SSL_SUCCESS_BACKEND_URL=
SSL_FAIL_BACKEND_URL=
SSL_CANCEL_BACKEND_URL=

# SSL Redirect URLs (Frontend)
SSL_SUCCESS_FRONTEND_URL=
SSL_FAIL_FRONTEND_URL=
SSL_CANCEL_FRONTEND_URL=
```

---

## 🤖 How AI Was Used in This Project

This project was developed in close collaboration with **Antigravity AI** (powered by Google DeepMind), used as an AI pair programming assistant throughout the entire development lifecycle.

### Key areas where AI assisted:

- **Architecture Decisions** — Designing the modular folder structure (modules, services, controllers, routes) and deciding on the decoupled Payment entity separate from Orders.
- **Backend Logic** — Implementing MongoDB session-based atomic transactions for order creation to ensure data consistency across orders, payments, stock, and coupons.
- **Payment Integration** — Structuring the SSLCommerz payment flow with proper success, failure, and cancellation handling on both server and client.
- **TypeScript Typing** — Resolving complex TypeScript type mismatches and ensuring type safety across the full stack.
- **State Management** — Designing the Zustand stores with session persistence for the "Buy Now" flow and cart management.
- **Business Logic** — Implementing rules such as blocking cancellation of online-paid orders and coupon per-user usage limit enforcement.
- **Code Review & Refactoring** — Identifying and fixing logic bugs, improving code reusability, and maintaining consistent coding patterns.

> AI was used as a productivity tool — **all architectural and product decisions were made by the developer**. The AI assisted in implementing, debugging, and refining solutions.

---

## 👨‍💻 Developer

**Jubayer Hossain**
- 📧 Email: [jubayerhossain111220@gmail.com](mailto:jubayerhossain111220@gmail.com)
- 🐙 GitHub: [github.com/jubayerCodes](https://github.com/jubayerCodes)
- 💼 LinkedIn: [linkedin.com/in/jubayercodes](https://www.linkedin.com/in/jubayer-codes/)

## Copyright

© 2026 Jubayer Hossain. All rights reserved.