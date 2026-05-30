# 🍽️ BiteBridge — Online Food Ordering System

> A **production-quality, full-stack food ordering system** built for a single restaurant, featuring a Flask REST API backend, MySQL database with triggers, and a React frontend with cinematic GSAP + Framer Motion animations.

![Tech Stack](https://img.shields.io/badge/Flask-Python-blue) ![MySQL](https://img.shields.io/badge/MySQL-Database-orange) ![React](https://img.shields.io/badge/React-Vite-61DAFB) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Resume-Worthy Highlights](#resume-worthy-highlights)

---

## 🎯 Overview

BiteBridge is a complete food ordering platform that demonstrates mastery of modern web development and database engineering:

- **Customers** can browse a curated menu, add items to cart, place orders, make payments, and track delivery in real-time
- **Admins** can manage menu items, update order statuses, and view business analytics
- **Database** features 6 tables with foreign keys, 4 MySQL triggers, and transactional order processing

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Flask (Python) | REST API |
| Database | MySQL | Relational DB with triggers |
| ORM | SQLAlchemy | Object-relational mapping |
| Auth | Flask-JWT-Extended | Token-based authentication |
| Migrations | Flask-Migrate (Alembic) | Schema versioning |
| Frontend | React + Vite | Component-based SPA |
| Styling | Tailwind CSS | Utility-first CSS |
| Animations | GSAP + Framer Motion | Cinematic UI motion |
| HTTP Client | Axios | API communication |

---

## 🏗️ Architecture

```
bitbridge/
├── backend/                  # Flask REST API
│   ├── app/
│   │   ├── __init__.py       # App factory
│   │   ├── config.py         # Environment configs
│   │   ├── extensions.py     # SQLAlchemy, JWT, Bcrypt
│   │   ├── models/           # 6 SQLAlchemy models
│   │   ├── routes/           # 6 API blueprints
│   │   └── utils/            # Decorators & helpers
│   └── sql/                  # DDL, DML, Triggers, DCL
├── frontend/                 # React + Vite SPA
│   └── src/
│       ├── pages/            # 12 page components
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth & Cart state
│       ├── hooks/            # Custom React hooks
│       ├── api/              # Axios configuration
│       └── animations/       # GSAP utilities
└── setup.sh / start.sh      # One-command setup & run
```

---

## 🗄️ Database Design

### Tables (6)
1. **CUSTOMER** — User accounts with bcrypt password hashing and role-based access
2. **ORDER_TABLE** — Orders with status tracking (Pending → Processing → Delivery → Completed)
3. **MENU** — Restaurant menu items with categories and availability flags
4. **ORDER_DETAILS** — Line items linking orders to menu items (many-to-many)
5. **PAYMENT** — Payment records with method and status tracking
6. **ORDER_BACKUP** — Trigger-populated backup of deleted orders

### MySQL Triggers (4)
1. `backup_deleted_order` — Copies order to ORDER_BACKUP before deletion
2. `update_order_total_on_insert` — Auto-calculates order total from ORDER_DETAILS
3. `prevent_unavailable_item_order` — Blocks orders for unavailable items
4. `sync_payment_on_order_update` — Syncs payment status with order status changes

---

## 🔌 API Endpoints (20+)

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new customer |
| POST | `/login` | Public | Login, returns JWT |
| POST | `/logout` | JWT | Logout |
| GET | `/me` | JWT | Get profile |
| POST | `/refresh` | Refresh | Refresh access token |
| POST | `/forgot-password` | Public | Password reset request |

### Menu (`/api/menu`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List available items |
| GET | `/categories` | Public | Get categories |
| GET | `/<id>` | Public | Item details |
| POST | `/` | Admin | Add item |
| PUT | `/<id>` | Admin | Update item |
| DELETE | `/<id>` | Admin | Soft-delete item |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Place order (transaction) |
| GET | `/` | JWT | Customer's orders |
| GET | `/<id>` | JWT | Order details |
| PUT | `/<id>/status` | Admin | Update status (fires triggers) |

### Payment (`/api/payment`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | JWT | Create payment |
| GET | `/<order_id>` | JWT | Payment status |
| PUT | `/<payment_id>` | JWT | Update payment |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Admin | Business analytics |
| GET | `/orders` | Admin | All orders (with JOINs) |
| GET | `/customers` | Admin | Customer list |

---

## ✨ Features

### Customer Features
- 🔐 JWT authentication with bcrypt password hashing
- 📋 Browse menu with category filtering
- 🛒 Add to cart with real-time quantity management
- 💳 Multiple payment methods (Credit Card, UPI, PayPal, etc.)
- 📦 Real-time order tracking with visual stepper
- 🎬 Cinematic page transitions and animations

### Admin Features
- 📊 Dashboard with revenue, order count, and analytics
- 📦 Order management with status updates (triggers fire automatically)
- 🍽️ Full menu CRUD (Create, Read, Update, Delete)
- 👥 Customer list and management

### Technical Features
- 🔄 SQLAlchemy transactions for atomic order placement
- 🔥 4 MySQL triggers for data integrity and automation
- 🎯 Role-based access control (RBAC)
- 📱 Fully responsive design
- ✨ GSAP particle animations and text reveals
- 🎬 Framer Motion page transitions with blur effects

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- macOS (Intel/Apple Silicon)

### Quick Start
```bash
# Clone and enter project
cd bitbridge

# Make scripts executable
chmod +x setup.sh start.sh

# Run setup (installs everything + seeds database)
./setup.sh

# Start both servers
./start.sh
```

### Manual Setup
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
mysql -u root -p < sql/schema.sql
mysql -u root -p bitbridge_db < sql/seed.sql
mysql -u root -p bitbridge_db < sql/triggers.sql
flask run --port=5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 📖 Usage

### URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bitbridge.com | password123 |
| Customer | john@gmail.com | password123 |

### Verify Triggers
```sql
mysql -u root -p bitbridge_db

-- Show all triggers
SHOW TRIGGERS;

-- Test backup trigger
DELETE FROM ORDER_TABLE WHERE order_id = 4;
SELECT * FROM ORDER_BACKUP;
```

---

## 🎓 Resume-Worthy Highlights

1. **MySQL Triggers** — 4 production-grade triggers that auto-fire on DB events
2. **JWT Authentication** — Stateless token-based auth with refresh tokens
3. **SQLAlchemy ORM** — Models with relationships, cascades, and transactions
4. **GSAP Animations** — Cinematic hero section with particle animations
5. **Framer Motion** — Page-level route transitions with blur effects
6. **RESTful API** — 20+ endpoints with proper HTTP status codes
7. **Role-Based Access Control** — Customer vs Admin authorization
8. **Database Transactions** — Atomic order placement (all-or-nothing)
9. **Flask-Migrate** — Professional schema versioning with Alembic
10. **React Context + Custom Hooks** — Industry-standard state management

---

## 📄 License

This project was built as a DBMS course project demonstrating full-stack web development proficiency.

---

*Built with ❤️ using Flask, MySQL, React, GSAP, and Framer Motion*
