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
- Add to cart, view the full cart page, or use "Buy Now" for instant checkout
- Billing & shipping address auto-filled from saved account details when logged in
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

Choose the setup method that works best for you — **Docker** (recommended, zero config) or **Manual**.

---

### 🐳 Docker Setup (Recommended)

Run the entire Star Gadgets stack with a single command. No need to install Node.js, pnpm, or any other dependency manually.

#### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

#### Steps

**1. Create a parent folder and clone both repositories inside it**

```bash
mkdir star-gadgets && cd star-gadgets
git clone https://github.com/jubayerCodes/star-gadgets-client.git
git clone https://github.com/jubayerCodes/star-gadgets-server.git
```

**2. Set up server environment variables**

```bash
cd star-gadgets-server
cp .env.example .env
# Open .env and fill in all values
cd ..
```

**3. Create `docker-compose.yml` in the parent `star-gadgets/` folder**

Create a new file named `docker-compose.yml` and paste the following:

```yaml
services:

  server:
    build:
      context: ./star-gadgets-server
      dockerfile: Dockerfile
    container_name: star-gadgets-server
    restart: unless-stopped
    env_file:
      - ./star-gadgets-server/.env
    environment:
      NODE_ENV: PRODUCTION
    ports:
      - "5000:5000"
    networks:
      - star-gadgets-net

  client:
    build:
      context: ./star-gadgets-client
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_BASE_URL: http://localhost:5000/api/v1
    container_name: star-gadgets-client
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "8000:8000"
    networks:
      - star-gadgets-net

networks:
  star-gadgets-net:
    driver: bridge
```

**4. Confirm your folder structure looks like this**

```
star-gadgets/
├── docker-compose.yml        ← created in step 3
├── star-gadgets-client/      ← cloned in step 1
└── star-gadgets-server/      ← cloned in step 1
```

**5. Build and start everything**

```bash
docker compose up --build
```

The app will be available at:
- **Frontend** → http://localhost:8000
- **Backend API** → http://localhost:5000/api/v1

#### ⚠️ Important Notes

- **MongoDB**: This project uses MongoDB Atlas. Make sure your Atlas cluster allows connections from your IP under **Network Access → Add IP Address**.
- **`NEXT_PUBLIC_BASE_URL`**: This is baked into the Next.js bundle at build time. If your API runs on a different URL, update the `args.NEXT_PUBLIC_BASE_URL` value in `docker-compose.yml` before building.
- **`.env` file**: Never commit your `.env` file. It is gitignored by default. Anyone cloning the repo must create their own `.env` from `.env.example`.

#### Useful Docker Commands

```bash
# Start in background (after first build)
docker compose up -d

# Stop all containers
docker compose down

# Rebuild after code changes
docker compose up --build

# View live logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f server
docker compose logs -f client

# Open a shell inside a running container
docker compose exec server sh
docker compose exec client sh
```

---

### Manual Setup

#### Prerequisites
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
# Set NEXT_PUBLIC_BASE_URL to your backend API base URL

# 4. Start development server
pnpm dev
```

The client runs on `http://localhost:8000` by default.

---

### 🔑 Environment Variables (Server)

Create a `.env` file in the **server root** with the following keys:

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

# Google OAuth
GOOGLE_CLIENT_ID=              # Google OAuth client ID
GOOGLE_CLIENT_SECRET=          # Google OAuth client secret
GOOGLE_CALLBACK_URL=           # e.g. http://localhost:5000/api/v1/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SSLCommerz
SSL_STORE_ID=
SSL_STORE_PASS=
SSL_PAYMENT_API=
SSL_VALIDATION_API=
SSL_IPN_URL=                   # IPN URL called by SSLCommerz for server-to-server payment verification

# SSL Redirect URLs (Backend)
SSL_SUCCESS_BACKEND_URL=
SSL_FAIL_BACKEND_URL=
SSL_CANCEL_BACKEND_URL=

# SSL Redirect URLs (Frontend)
SSL_SUCCESS_FRONTEND_URL=
SSL_FAIL_FRONTEND_URL=
SSL_CANCEL_FRONTEND_URL=

# Google Cloud
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

### 🔑 Environment Variables (Client)

Create a `.env` file in the **client root** with the following key:

```env
NEXT_PUBLIC_BASE_URL=          # Backend API base URL (e.g. http://localhost:5000/api/v1)
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