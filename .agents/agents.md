# Star Gadgets — Client (Next.js)

## Project Overview

Star Gadgets is a full-stack e-commerce platform for gadgets and electronics. This is the **client** application built with Next.js 16 (App Router) and React 19. The backend is a separate Express 5 + Mongoose 9 API server located at `../star-gadgets-server`.

- **Client** runs on port `8000` — `pnpm dev`
- **Server** runs on port `5000` — `pnpm dev` (from server directory)
- **API base URL:** `http://localhost:5000/api/v1` (set via `NEXT_PUBLIC_BASE_URL`)
- Docker Compose is available at the parent directory for containerized deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TailwindCSS 4, Radix UI / shadcn/ui |
| State (client) | Zustand |
| State (server) | TanStack React Query v5 |
| Forms | React Hook Form + Zod v4 |
| HTTP | Axios (with auto token refresh interceptor) |
| Rich Text | Lexical |
| Charts | Recharts |
| Carousel | Swiper |
| Drag & Drop | @dnd-kit |
| PDF | @react-pdf/renderer |
| Icons | @tabler/icons-react, lucide-react |
| Toasts | Sonner |
| Package Manager | pnpm |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (site)/             # Public-facing pages (home, products, cart, checkout, etc.)
│   ├── (dashboard)/        # Admin dashboard pages (products, orders, categories, etc.)
│   ├── globals.css         # TailwindCSS + global styles
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # 404 page
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # Shared/reusable components
│   ├── ui/                 # shadcn/ui primitives (button, dialog, input, etc.)
│   ├── shared/             # Cross-feature shared components
│   ├── layout/             # Layout components (header, footer, sidebar)
│   ├── form/               # Reusable form components
│   ├── filters/            # Filter UI components
│   ├── modals/             # Reusable modal components
│   ├── dashboard/          # Dashboard-specific shared components
│   ├── data-table.tsx      # Reusable TanStack Table component
│   └── data-table-action.tsx
├── config/                 # App configuration (baseUrl, etc.)
├── constants/              # Query keys (QUERY_KEYS), pagination defaults
├── features/               # Feature modules (see Feature Module Pattern below)
├── hooks/                  # Global custom hooks
├── lib/                    # Utilities (axios instance, helpers)
├── providers/              # React context providers (Auth, QueryClient, Theme)
├── store/                  # Zustand stores
└── types/                  # Global TypeScript types (ApiResponse, Meta, QueryType)
```

---

## Feature Module Pattern

Every feature follows this consistent structure under `src/features/<feature>/`:

```
src/features/<feature>/
├── api/
│   └── index.ts            # Axios API functions returning Promise<ApiResponse<T>>
├── components/             # Feature-specific React components
├── hooks/
│   └── use<Feature>.ts     # TanStack Query hooks wrapping API functions
├── schemas/  (or schema/)
│   └── index.ts            # Zod validation schemas + inferred form types
├── types.d.ts              # Feature-specific TypeScript interfaces
```

### Current Features (13)

`account`, `products`, `cart`, `checkout`, `orders`, `categories`, `sub-categories`, `brands`, `badges`, `coupons`, `hero`, `gallery`, `config`

---

## Code Conventions

### API Layer (`features/<feature>/api/index.ts`)

- Use `axiosInstance` from `@/lib/axios`
- Every function returns `Promise<ApiResponse<T>>` where `T` is the data type
- Use `res.data` to unwrap the axios response
- Name functions with the pattern: `<verb><Entity>Api` (e.g., `createUserApi`, `getProductsApi`)

```typescript
import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";

export const getProductsApi = async (params?: QueryType): Promise<ApiResponse<IProduct[]>> => {
  const res = await axiosInstance.get("/products", { params });
  return res.data;
};
```

### Hooks Layer (`features/<feature>/hooks/use<Feature>.ts`)

- Queries use `useQuery` with keys from `QUERY_KEYS` constant (`@/constants`)
- Mutations use `useMutation` with `onSuccess` / `onError` handlers
- Error messages extracted via `extractErrorMessage(err)` and shown with `toast.error()`
- Success messages shown with `toast.success()`
- Use `queryClient.invalidateQueries()` to refetch after mutations

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { QUERY_KEYS } from "@/constants";

export const useGetProducts = (params?: QueryType) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => getProductsApi(params),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success("Product created successfully!");
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
};
```

### Schema Layer (`features/<feature>/schema/index.ts`)

- Use Zod v4 for validation
- Export both the schema and the inferred type
- Type naming: `<Entity>FormValues` (e.g., `RegisterFormValues`)

```typescript
import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```

### Types (`features/<feature>/types.d.ts`)

- Use `.d.ts` extension for type-only declaration files
- Interface naming: `I<Entity>` (e.g., `IUser`, `IProduct`, `IOrder`)
- Enum naming: PascalCase (e.g., `Role`, `OrderStatus`)

### Zustand Stores (`src/store/<name>Store.ts`)

- File naming: `<name>Store.ts` (camelCase)
- Define interface for store state + actions
- Use `create<T>()(set => ...)` pattern

```typescript
import { create } from "zustand";

interface ICartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

export const useCartStore = create<ICartStore>()((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
```

### Global Types (`src/types/index.d.ts`)

```typescript
// All API responses are wrapped in this type
interface ApiResponse<T> {
  statusCode: HttpStatusCode;
  success: boolean;
  message: string;
  meta: Meta;       // { page, total, limit, skip }
  data: T;
}

// Use for paginated query params
type QueryType<T> = {
  page?: number;
  limit?: number;
  search?: string;
  filterBy?: string;
  sortBy?: string;
  sortOrder?: string;
} & T;
```

### Constants (`src/constants/index.ts`)

- `QUERY_KEYS` — Centralized TanStack Query cache keys (always use these, never inline strings)
- `PAGINATION` — Default page/limit values
- `PRODUCT_LISTING` — Product listing pagination config

---

## Authentication Flow

1. JWT access + refresh tokens are stored in **HTTP-only cookies** (set by the server)
2. `axiosInstance` has a response interceptor that detects `"jwt expired"` errors, calls `POST /auth/refresh-token`, and retries the original request (with a queue to prevent duplicate refreshes)
3. `AuthInitializer` provider calls `GET /users/me` on mount to hydrate `useAuthStore`
4. Roles: `USER`, `ADMIN`, `SUPER_ADMIN`
5. Google OAuth: redirects to server `/auth/google`, server handles callback and sets cookies

---

## Page Routes

### Public Site (`(site)` route group)

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/products` | Product listing with filters |
| `/products/[slug]` | Product detail |
| `/categories/[slug]` | Category products |
| `/sub-categories/[slug]` | Sub-category products |
| `/search` | Search results |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/orders` | Order history |
| `/payment` | Payment status page |
| `/account` | User profile/settings |
| `/pc-builder` | PC builder tool |
| `/about`, `/contact`, `/terms`, `/privacy-policy`, `/cookie-policy` | Static pages |

### Admin Dashboard (`(dashboard)` route group)

| Route | Purpose |
|---|---|
| `/dashboard` | Overview with charts |
| `/dashboard/products` | Product CRUD |
| `/dashboard/categories` | Category management |
| `/dashboard/sub-categories` | Sub-category management |
| `/dashboard/brands` | Brand management |
| `/dashboard/orders` | Order management |
| `/dashboard/invoices` | Invoice PDF generation |
| `/dashboard/coupons` | Coupon management |
| `/dashboard/gallery` | Image gallery (Cloudinary) |
| `/dashboard/configurations` | Site configuration |

---

## Server API Reference (Express Backend)

The server is at `../star-gadgets-server` and follows a modular pattern:

```
src/app/modules/<Module>/
├── <name>.interface.ts      # TypeScript types/enums
├── <name>.model.ts          # Mongoose schema + model
├── <name>.validation.ts     # Zod request validation
├── <name>.controller.ts     # Route handlers (wrapped with catchAsync)
├── <name>.service.ts        # Business logic
├── <name>.route.ts          # Express Router
```

### Server Modules & API Routes

| Module | Prefix | Key Endpoints |
|---|---|---|
| **Auth** | `/auth` | `POST /login`, `POST /refresh-token`, `POST /logout`, `POST /reset-password`, `GET /google`, `GET /google/callback` |
| **User** | `/users` | `POST /` (register), `GET /` (admin), `GET /me`, `PATCH /me` |
| **Product** | `/products` | `POST /`, `PATCH /:id`, `DELETE /:id`, `GET /admin`, `GET /featured`, `GET /search`, `GET /listing`, `GET /category/:slug`, `GET /sub-category/:slug`, `GET /slug/:slug`, `GET /:id` |
| **Order** | `/orders` | `POST /` (softAuth), `GET /` (admin), `GET /my`, `GET /:id`, `PATCH /:id/cancel`, `PATCH /:id/status` |
| **Payment** | `/payments` | `POST /initiate/:orderId`, `GET /order/:orderId`, `GET /transaction/:transactionId`, `POST /success`, `POST /fail`, `POST /cancel` |
| **Category** | `/categories` | Standard CRUD |
| **Sub-Category** | `/sub-categories` | Standard CRUD |
| **Brand** | `/brands` | Standard CRUD |
| **Badge** | `/badges` | Standard CRUD |
| **Coupon** | `/coupons` | Standard CRUD |
| **Configuration** | `/config` | Site config management |
| **Upload** | `/uploads` | Cloudinary image upload via Multer |

### Server Auth Middleware

- `checkAuth(...roles)` — Requires valid JWT in cookies, checks user role
- `softAuth` — Attaches user if token present, proceeds without if not (for guest checkout)
- `validateRequest(zodSchema)` — Validates `req.body` against a Zod schema

### Server Response Format

All responses follow this shape (matching client's `ApiResponse<T>`):

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Description of what happened",
  "data": { ... },
  "meta": { "page": 1, "total": 50, "limit": 10, "skip": 0 }
}
```

### Server Error Handling

- `AppError` class with `statusCode` and `message`
- `globalErrorHandler` middleware handles: Zod errors, Mongoose validation/cast/duplicate errors, and generic errors
- Errors always return: `{ statusCode, success: false, message, ... }`

### Key Data Models

**User:** `name`, `email`, `password?`, `avatar?`, `phone?`, `role` (USER|ADMIN|SUPER_ADMIN), `billingAddress?`, `shippingAddress?`, `auths[]` (LOCAL|GOOGLE), `isDeleted`, `isVerified`

**Product:** `title`, `slug`, `featuredImage`, `productCode`, `keyFeatures`, `description`, `specifications[]`, `attributes[]`, `badges[]`, `variants[]` (with price, stock, sku, images, status), `categoryId`, `subCategoryId`, `brandId`, `isActive`, `isFeatured`

**Order:** `orderNumber`, `userId?`, `billingDetails`, `shippingDetails?`, `items[]` (productId, variantId, quantity, price, subtotal), `subtotal`, `shippingCost`, `discount`, `total`, `coupon?`, `paymentMethod`, `paymentId?`, `orderStatus` (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED | CANCELLED | FAILED)

**Payment:** `orderId`, `transactionId`, `paymentMethod` (COD|ONLINE), `paymentStatus` (PENDING|COMPLETED|FAILED|CANCELLED|REFUNDED), `amount`, `paidAt?`

---

## Important Patterns to Follow

1. **Always use `QUERY_KEYS`** from `@/constants` — never hardcode query key strings
2. **Always use `axiosInstance`** from `@/lib/axios` — never use raw `axios`
3. **Always wrap API responses** in `ApiResponse<T>` type
4. **Always use `extractErrorMessage()`** for user-facing error messages in hooks
5. **Always use `toast` from `sonner`** for notifications
6. **Feature isolation** — Keep feature-specific code inside `src/features/<feature>/`; shared components go in `src/components/`
7. **Type declarations** — Use `.d.ts` extension for type-only files within features
8. **Schema + Types colocated** — Zod schemas live alongside their feature, form types are inferred from schemas
9. **Server validation mirrors client** — Both use Zod with matching schemas
10. **Path aliases** — Use `@/` prefix for imports (maps to `src/`)
