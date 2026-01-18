// Product Types
export interface Product {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  category: ProductCategory;
  description: string;
  descriptionHi: string;
  composition: string;
  dosage: string;
  applicationMethod: string;
  targetPests: string[];
  suitableCrops: string[];
  packSizes: string[];
  safetyPrecautions: string[];
  images: string[];
  isBestSeller: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | "insecticide"
  | "fungicide"
  | "herbicide"
  | "pgr"
  | "fertilizer";

// User Types
export interface User {
  id: string;
  name: string;
  mobile: string;
  pincode: string;
  state: string;
  district: string;
  cropPreferences: string[];
  language: "en" | "hi";
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface UserStats {
  totalScans: number;
  couponsWon: number;
  rewardsClaimed: number;
  lastScanDate: string | null;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  productName: string;
  batchNumber: string;
  prize: Prize;
  status: CouponStatus;
  usedBy?: {
    userId: string;
    userName: string;
    mobile: string;
  };
  usedAt?: string;
  expiryDate: string;
  createdAt: string;
}

export type CouponStatus = "unused" | "used" | "expired";

export interface Prize {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  value: number;
  image: string;
  type: "cashback" | "discount" | "gift" | "points";
}

// Reward Types
export interface Reward {
  id: string;
  couponCode: string;
  prize: Prize;
  productName: string;
  status: "pending" | "redeemed";
  wonAt: string;
  redeemedAt?: string;
  certificateUrl?: string;
}

// Distributor Types
export interface Distributor {
  id: string;
  name: string;
  businessName: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    state: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  coveragePincodes: string[];
  availableProducts: string[];
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  createdAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "viewer";
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeUsers: number;
  activeUserGrowth: number;
  totalScans: number;
  scanGrowth: number;
  couponsRedeemed: number;
  redemptionGrowth: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// Form Types
export interface LoginFormData {
  mobile: string;
}

export interface OTPFormData {
  otp: string;
}

export interface RegisterFormData {
  name: string;
  pincode: string;
  cropPreferences: string[];
}

export interface ContactFormData {
  name: string;
  mobile: string;
  email?: string;
  subject: string;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Note: Crops and Categories are now fetched from API
// Use api.getCrops() and api.getCategories() instead of hardcoded arrays

