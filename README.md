# Agrio India Crop Science

**भारतीय किसान की पहली पसंद** - Premium Agrochemicals for Higher Yield

A comprehensive web application for Agrio India Crop Science, empowering Indian farmers with high-quality crop solutions.

## 🚀 Features

### Public Website
- **Homepage** - Hero section, features, best-selling products, how it works
- **Products Catalog** - Browse and filter products by category
- **Product Details** - Detailed product information with specifications
- **Best Selling** - Showcase of top products
- **Contact Us** - Contact form with company information
- **About Us** - Company story, mission, vision, and values
- **Scan & Win** - Information about the rewards program
- **Buy Nearby** - Find nearby distributors

### User Dashboard
- **Dashboard** - Quick stats and actions
- **Scan & Win** - QR code scanner with scratch card reward reveal
- **My Rewards** - Track earned rewards and download certificates
- **My Profile** - Manage profile and crop preferences
- **Distributors** - Find nearby authorized distributors
- **Products** - Browse product catalog
- **Support** - FAQs and contact support

### Admin Panel
- **Dashboard** - Analytics overview with charts
- **Users Management** - View and manage registered users
- **Products Management** - CRUD operations for products
- **Coupons Management** - Generate and track promotional coupons
- **Distributors Management** - Manage authorized distributors
- **Reports & Analytics** - Detailed reports with exports
- **Settings** - Company info, admin users, system config, security

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts (ready for integration)
- **i18n**: next-intl (English/Hindi)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd agrio-india

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔗 Routes

### Public Routes
- `/` - Homepage
- `/products` - Products listing
- `/products/[slug]` - Product detail
- `/best-selling` - Best selling products
- `/contact` - Contact page
- `/about` - About us
- `/scan-win` - Scan & Win info
- `/buy-nearby` - Find distributors
- `/auth` - Login/Register

### User Dashboard (Protected)
- `/dashboard` - User dashboard
- `/dashboard/scan` - Scan & Win
- `/dashboard/rewards` - My rewards
- `/dashboard/profile` - My profile
- `/dashboard/distributors` - Find distributors
- `/dashboard/products` - Browse products
- `/dashboard/support` - Help & support

### Admin Panel (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/products` - Product management
- `/admin/coupons` - Coupon management
- `/admin/distributors` - Distributor management
- `/admin/reports` - Reports & analytics
- `/admin/settings` - System settings

## 🎨 Design System

### Colors
- **Primary Green**: `#16a34a`, `#22c55e`, `#15803d`
- **Secondary**: `#ffffff`
- **Accent (Golden Yellow)**: `#eab308`
- **Background**: `#f0fdf4`

### Typography
- **Primary Font**: Poppins
- **Hindi Font**: Noto Sans Devanagari

## 🌐 Internationalization

The application supports:
- English (default)
- Hindi (हिंदी)

Language can be toggled from the header.

## 📱 Responsive Design

Fully responsive design optimized for:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🔐 Authentication

- OTP-based mobile authentication
- Separate admin authentication
- Protected routes with middleware

## 📄 License

© 2024 Agrio India Crop Science. All Rights Reserved.

