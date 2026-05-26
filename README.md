# 🍛 Sénégal Dishes — Fullstack Food Ordering App

Authentic Senegalese restaurant web application with customer ordering and admin management.

**Stack:** React + Vite + Tailwind CSS | Node.js + Express | MongoDB Atlas

---

## 📁 Project Structure

```
senegal-food-app/
├── backend/          ← Express REST API
└── frontend/         ← React + Vite app
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/senegal-food
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> 💡 **MongoDB Atlas setup:**
> 1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
> 2. Create a free cluster
> 3. Create a database user
> 4. Whitelist your IP (or `0.0.0.0/0` for development)
> 5. Copy the connection string into `MONGODB_URI`

### 3. Seed the Database

```bash
cd backend
node config/seedData.js
```

This creates sample dishes and a default admin account:
- **Email:** admin@senegaldishes.com
- **Password:** admin123

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 🌐 API Reference

### Products
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products` | ❌ | Get all products (supports `?category=&search=`) |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |

### Orders
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/orders` | ❌ | Place new order |
| GET | `/api/orders` | ✅ | Get all orders (supports `?status=`) |
| GET | `/api/orders/stats` | ✅ | Get order statistics |
| GET | `/api/orders/:id` | ✅ | Get single order |
| PUT | `/api/orders/:id` | ✅ | Update order status |

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register admin |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |

---

## 🔐 Admin Dashboard

Access at `/admin`

**Features:**
- Login with JWT authentication
- Dashboard overview (orders, revenue, stats)
- Manage menu items (add, edit, delete, toggle availability)
- View and update order statuses (pending → preparing → delivered)

---

## 🚀 Deployment

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (same as `.env`)

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
4. Deploy — `vercel.json` handles SPA routing

### Database → MongoDB Atlas
Already cloud-hosted. Make sure to whitelist `0.0.0.0/0` for Render's dynamic IPs.

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero + featured dishes |
| `/menu` | Full menu with category filter + search |
| `/cart` | Shopping cart |
| `/checkout` | Order placement form |
| `/order-success` | Confirmation page |
| `/contact` | Contact info + WhatsApp link |
| `/admin` | Admin dashboard (protected) |
| `/admin/orders` | Order management |
| `/admin/products` | Menu management |
| `/admin/products/new` | Add new dish |
| `/admin/products/edit/:id` | Edit dish |

---

## 🎨 Features

- ✅ Responsive mobile-first design
- ✅ Cart persisted in localStorage
- ✅ Category filtering + search
- ✅ JWT admin authentication
- ✅ Toast notifications
- ✅ Form validation
- ✅ Loading & error states
- ✅ CFA Franc currency formatting
- ✅ WhatsApp integration
- ✅ Production-ready error handling
