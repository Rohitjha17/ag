# Agrio India - Complete Backend API Requirements

This document is the **definitive source of truth** for all backend APIs required by both the **Web Application (Next.js)** and **Mobile Application (Flutter)**. This unified API specification ensures consistency across platforms.

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User Profile APIs](#2-user-profile-apis)
3. [Crops & Preferences APIs](#3-crops--preferences-apis)
4. [Products Catalog APIs](#4-products-catalog-apis)
5. [Categories APIs](#5-categories-apis)
6. [Distributors APIs](#6-distributors-apis)
7. [Scan & Win / Coupons APIs](#7-scan--win--coupons-apis)
8. [Rewards APIs](#8-rewards-apis)
9. [Search APIs](#9-search-apis)
10. [Contact & Support APIs](#10-contact--support-apis)
11. [Notifications APIs](#11-notifications-apis)
12. [App Configuration APIs](#12-app-configuration-apis)
13. [Admin APIs](#13-admin-apis)
14. [Database Schema Summary](#14-database-schema-summary)

---

## 1. Authentication APIs

**Base Path:** `/api/v1/auth`

### 1.1 Send OTP

**Endpoint:** `POST /api/v1/auth/send-otp`

**Description:** Sends a 6-digit OTP to the provided mobile number via Msg91.

**Request Body:**
```json
{
  "phone_number": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "request_id": "uuid",
    "expires_in": 300
  }
}
```

**Backend Logic:**
- Validate Indian phone number format (10 digits starting with 6-9)
- Integrate with Msg91 to send SMS
- Create record in `otp_verifications` table with expiry (5 minutes)
- Rate limit: Max 5 OTP requests per phone per hour

**Database Table:** `otp_verifications`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| phone_number | VARCHAR(15) | Phone number |
| otp_code | VARCHAR(6) | Generated OTP |
| request_id | UUID | Unique request identifier |
| expires_at | TIMESTAMP | Expiry time |
| is_verified | BOOLEAN | Verification status |
| created_at | TIMESTAMP | Creation time |

---

### 1.2 Verify OTP

**Endpoint:** `POST /api/v1/auth/verify-otp`

**Description:** Verifies the OTP and returns authentication token.

**Request Body:**
```json
{
  "phone_number": "9876543210",
  "otp_code": "123456"
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN_STRING",
    "refresh_token": "REFRESH_TOKEN_STRING",
    "is_new_user": false,
    "user": {
      "id": "uuid",
      "phone_number": "9876543210",
      "full_name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "role": "FARMER",
      "pin_code": "400001",
      "state": "Maharashtra",
      "district": "Mumbai",
      "language": "en",
      "crop_preferences": ["wheat", "rice"],
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Response (New User):**
```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN_STRING",
    "is_new_user": true,
    "user": {
      "id": "uuid",
      "phone_number": "9876543210"
    }
  }
}
```

**Backend Logic:**
- Validate OTP against `otp_verifications` table
- Check expiry and mark as verified
- If user exists in `users` table, return full profile
- If new user, create minimal user record
- Generate JWT token (access + refresh)

---

### 1.3 Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Request Body:**
```json
{
  "refresh_token": "REFRESH_TOKEN_STRING"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "NEW_JWT_TOKEN",
    "refresh_token": "NEW_REFRESH_TOKEN"
  }
}
```

---

### 1.4 Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User Profile APIs

**Base Path:** `/api/v1/user`

### 2.1 Get Current User Profile

**Endpoint:** `GET /api/v1/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone_number": "9876543210",
    "full_name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "FARMER",
    "pin_code": "400001",
    "full_address": "123 Farmer Street, Mumbai",
    "state": "Maharashtra",
    "district": "Mumbai",
    "language": "en",
    "crop_preferences": [
      { "id": "wheat", "name": "Wheat", "name_hi": "गेहूं" }
    ],
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "last_login": "2024-08-15T14:30:00Z"
  }
}
```

**Database Table:** `users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| phone_number | VARCHAR(15) | Unique, verified phone |
| full_name | VARCHAR(100) | User's full name |
| email | VARCHAR(255) | Optional email |
| role | ENUM | `FARMER`, `DEALER`, `ADMIN` |
| pin_code | VARCHAR(6) | 6-digit pincode |
| full_address | TEXT | Complete address |
| state | VARCHAR(50) | State name |
| district | VARCHAR(50) | District name |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Registration date |
| last_login | TIMESTAMP | Last login time |
| updated_at | TIMESTAMP | Last update time |

---

### 2.2 Create/Complete Profile (New User)

**Endpoint:** `POST /api/v1/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "Rajesh Kumar",
  "pin_code": "400001",
  "full_address": "123 Farmer Street",
  "email": "rajesh@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone_number": "9876543210",
    "full_name": "Rajesh Kumar",
    "pin_code": "400001",
    "state": "Maharashtra",
    "district": "Mumbai"
  }
}
```

**Backend Logic:**
- Auto-detect state/district from pincode using India Post API or local database
- Update user record

---

### 2.3 Update Profile

**Endpoint:** `PUT /api/v1/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "pin_code": "400001",
  "full_address": "123 Farmer Street, Mumbai"
}
```

---

### 2.4 Update Language Preference

**Endpoint:** `PUT /api/v1/user/language`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "language": "hi"
}
```

**Database Table:** `user_preferences`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| pref_language | VARCHAR(5) | `en`, `hi` |
| push_notifications | BOOLEAN | Notification preference |
| sms_notifications | BOOLEAN | SMS preference |
| updated_at | TIMESTAMP | Last update |

---

### 2.5 Get User Stats

**Endpoint:** `GET /api/v1/user/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_scans": 25,
    "coupons_won": 18,
    "rewards_claimed": 12,
    "last_scan_date": "2024-08-10T14:30:00Z",
    "total_savings": 2500
  }
}
```

---

## 3. Crops & Preferences APIs

**Base Path:** `/api/v1/crops`

### 3.1 Get All Crops (Master List)

**Endpoint:** `GET /api/v1/crops`

**Query Parameters:**
- `q` (optional): Search keyword
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sugarcane",
      "name": "Sugarcane",
      "name_hi": "गन्ना",
      "image_url": "/crops/sugarcane.png"
    },
    {
      "id": "wheat",
      "name": "Wheat",
      "name_hi": "गेहूं",
      "image_url": "/crops/wheat.png"
    }
  ]
}
```

**Database Table:** `crops`
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) | Primary key (slug) |
| name | VARCHAR(100) | English name |
| name_hi | VARCHAR(100) | Hindi name |
| image_url | VARCHAR(255) | Crop image URL |
| is_active | BOOLEAN | Visibility status |
| display_order | INTEGER | Sort order |

---

### 3.2 Get User's Crop Preferences

**Endpoint:** `GET /api/v1/user/crops`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "crop_ids": ["wheat", "rice", "sugarcane"],
    "crops": [
      { "id": "wheat", "name": "Wheat", "name_hi": "गेहूं" }
    ]
  }
}
```

---

### 3.3 Sync User Crop Preferences

**Endpoint:** `POST /api/v1/user/crops`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "crop_ids": ["wheat", "rice", "sugarcane"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crop preferences updated successfully"
}
```

**Backend Logic:**
- Replace all existing entries in `user_crops` table for this user
- Validate crop IDs exist in master list

**Database Table:** `user_crops`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| crop_id | VARCHAR(50) | Foreign key to crops |
| created_at | TIMESTAMP | Selection date |

---

## 4. Products Catalog APIs

**Base Path:** `/api/v1/products`

### 4.1 Get All Products

**Endpoint:** `GET /api/v1/products`

**Query Parameters:**
- `q` (optional): Search keyword
- `category` (optional): Category ID filter
- `crop` (optional): Crop ID filter
- `best_seller` (optional): Boolean filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): `name`, `name_desc`, `popular`, `newest`

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "AgriPower Plus",
        "name_hi": "एग्रीपावर प्लस",
        "slug": "agripower-plus",
        "category": {
          "id": "insecticide",
          "name": "Insecticides",
          "name_hi": "कीटनाशक"
        },
        "description": "Effective pest control...",
        "description_hi": "प्रभावी कीट नियंत्रण...",
        "composition": "Chlorpyrifos 20% EC",
        "dosage": "2-3 ml per liter of water",
        "application_method": "Foliar spray",
        "target_pests": ["Stem borer", "White grub"],
        "suitable_crops": ["Sugarcane", "Rice", "Wheat"],
        "pack_sizes": [
          { "size": "250ml", "sku": "AP-250" },
          { "size": "500ml", "sku": "AP-500" },
          { "size": "1L", "sku": "AP-1L" }
        ],
        "safety_precautions": ["Wear protective clothing"],
        "images": ["/products/agripower-plus.jpg"],
        "is_best_seller": true,
        "is_active": true,
        "sales_count": 1500,
        "display_order": 1
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "total_pages": 8
    }
  }
}
```

**Database Table:** `products`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | English name |
| name_hi | VARCHAR(100) | Hindi name |
| slug | VARCHAR(100) | URL slug (unique) |
| category_id | VARCHAR(50) | Foreign key to categories |
| description | TEXT | English description |
| description_hi | TEXT | Hindi description |
| composition | VARCHAR(255) | Technical composition |
| dosage | VARCHAR(255) | Recommended dosage |
| application_method | VARCHAR(255) | Application method |
| target_pests | JSONB | Array of pest names |
| suitable_crops | JSONB | Array of crop names |
| safety_precautions | JSONB | Array of safety tips |
| images | JSONB | Array of image URLs |
| technical_details | JSONB | Flexible technical specs |
| is_best_seller | BOOLEAN | Best seller flag |
| is_active | BOOLEAN | Product visibility |
| sales_count | INTEGER | Total sales count |
| display_order | INTEGER | Sort order |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

---

### 4.2 Get Product by Slug

**Endpoint:** `GET /api/v1/products/:slug`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "AgriPower Plus",
    "name_hi": "एग्रीपावर प्लस",
    "slug": "agripower-plus",
    "category": { ... },
    "description": "...",
    "pack_sizes": [
      { "size": "250ml", "mrp": 350, "selling_price": 320, "sku": "AP-250" }
    ],
    "related_products": [ ... ]
  }
}
```

---

### 4.3 Get Best Selling Products

**Endpoint:** `GET /api/v1/products/best-sellers`

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)

**Response:** Same structure as products list.

---

### 4.4 Get Recommended Products

**Endpoint:** `GET /api/v1/products/recommended`

**Headers:** `Authorization: Bearer <token>`

**Description:** Returns products based on user's crop preferences.

---

**Database Table:** `product_pack_sizes`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | Foreign key to products |
| size | VARCHAR(50) | Pack size (e.g., "250ml") |
| sku | VARCHAR(50) | Stock keeping unit |
| mrp | DECIMAL | Maximum retail price |
| selling_price | DECIMAL | Discounted price |
| is_active | BOOLEAN | Availability status |

---

## 5. Categories APIs

**Base Path:** `/api/v1/categories`

### 5.1 Get All Categories

**Endpoint:** `GET /api/v1/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "insecticide",
      "name": "Insecticides",
      "name_hi": "कीटनाशक",
      "slug": "insecticide",
      "image_url": "/categories/insecticide.png",
      "parent_id": null,
      "level": 0,
      "path": "insecticide",
      "product_count": 45
    },
    {
      "id": "fungicide",
      "name": "Fungicides",
      "name_hi": "फफूंदनाशक",
      "slug": "fungicide",
      "image_url": "/categories/fungicide.png",
      "parent_id": null,
      "level": 0,
      "path": "fungicide",
      "product_count": 32
    }
  ]
}
```

**Database Table:** `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) | Primary key (slug) |
| name | VARCHAR(100) | English name |
| name_hi | VARCHAR(100) | Hindi name |
| slug | VARCHAR(100) | URL slug |
| image_url | VARCHAR(255) | Category icon URL |
| parent_id | VARCHAR(50) | Parent category (nullable) |
| level | INTEGER | Nesting depth (0 = root) |
| path | VARCHAR(255) | Materialized path |
| is_active | BOOLEAN | Visibility status |
| display_order | INTEGER | Sort order |

---

## 6. Distributors APIs

**Base Path:** `/api/v1/distributors`

### 6.1 Get Distributors by Pincode

**Endpoint:** `GET /api/v1/distributors`

**Query Parameters:**
- `pincode` (required): 6-digit pincode
- `lat` (optional): Latitude for distance calculation
- `lng` (optional): Longitude for distance calculation
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "distributors": [
      {
        "id": "uuid",
        "name": "Rajesh Kumar",
        "business_name": "National Agro Agency",
        "phone": "9876543210",
        "whatsapp": "9876543210",
        "email": "national.agro@email.com",
        "address": {
          "street": "123, Farmer's Plaza",
          "area": "Main Market Rd",
          "city": "Mumbai",
          "pincode": "400001",
          "state": "Maharashtra"
        },
        "location": {
          "lat": 19.076,
          "lng": 72.8777
        },
        "distance_km": 2.5,
        "opening_hours": {
          "monday": { "open": "09:00", "close": "18:00", "closed": false },
          "sunday": { "closed": true }
        },
        "signature_image_url": "/signatures/dist-1.png",
        "stamp_image_url": "/stamps/dist-1.png",
        "is_verified": true,
        "is_active": true,
        "rating": 4.5,
        "review_count": 45
      }
    ],
    "pagination": { ... }
  }
}
```

**Database Table:** `distributors`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Contact person name |
| business_name | VARCHAR(150) | Business name |
| phone | VARCHAR(15) | Primary phone |
| whatsapp | VARCHAR(15) | WhatsApp number |
| email | VARCHAR(255) | Email address |
| address_street | VARCHAR(255) | Street address |
| address_area | VARCHAR(100) | Area/locality |
| address_city | VARCHAR(100) | City |
| address_pincode | VARCHAR(6) | Pincode |
| address_state | VARCHAR(50) | State |
| location_lat | DECIMAL(10,8) | Latitude |
| location_lng | DECIMAL(11,8) | Longitude |
| opening_hours | JSONB | Opening hours by day |
| signature_image_url | VARCHAR(255) | Signature image |
| stamp_image_url | VARCHAR(255) | Stamp image |
| is_verified | BOOLEAN | Verification status |
| is_active | BOOLEAN | Active status |
| rating | DECIMAL(2,1) | Average rating |
| review_count | INTEGER | Total reviews |
| created_at | TIMESTAMP | Registration date |

---

### 6.2 Get Distributor by ID

**Endpoint:** `GET /api/v1/distributors/:id`

---

### 6.3 Get Distributor Coverage Pincodes

**Endpoint:** `GET /api/v1/distributors/:id/coverage`

**Response:**
```json
{
  "success": true,
  "data": {
    "pincodes": ["400001", "400002", "400003"],
    "products": [
      { "id": "uuid", "name": "AgriPower Plus" }
    ]
  }
}
```

**Database Table:** `distributor_coverage`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| distributor_id | UUID | Foreign key |
| pincode | VARCHAR(6) | Covered pincode |

**Database Table:** `distributor_products`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| distributor_id | UUID | Foreign key |
| product_id | UUID | Foreign key |
| is_available | BOOLEAN | Stock status |

---

## 7. Scan & Win / Coupons APIs

**Base Path:** `/api/v1/coupons`

### 7.1 Verify Coupon Code

**Endpoint:** `POST /api/v1/coupons/verify`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "coupon_code": "AGR-CROP-XYZ123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "coupon": {
      "id": "uuid",
      "code": "AGR-CROP-XYZ123",
      "product": {
        "id": "uuid",
        "name": "AgriPower Plus"
      },
      "batch_number": "BATCH2024-001"
    },
    "campaign": {
      "id": "uuid",
      "name": "Diwali Bonanza 2024",
      "tier": {
        "id": "uuid",
        "reward_name": "Cashback ₹500",
        "reward_name_hi": "कैशबैक ₹500",
        "reward_type": "CASHBACK",
        "reward_value": 500
      }
    }
  }
}
```

**Response (Invalid):**
```json
{
  "success": false,
  "error": {
    "code": "COUPON_INVALID",
    "message": "This coupon code is invalid or has already been used."
  }
}
```

**Backend Logic:**
- Validate coupon exists in `coupons` table
- Check if already used (`status = 'used'`)
- Check if expired
- Determine prize tier based on campaign rules
- Random prize selection if applicable

---

### 7.2 Redeem Coupon (After Scratch Card)

**Endpoint:** `POST /api/v1/coupons/redeem`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "coupon_id": "uuid",
  "campaign_tier_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "id": "uuid",
      "coupon_code": "AGR-CROP-XYZ123",
      "prize": {
        "name": "Cashback ₹500",
        "name_hi": "कैशबैक ₹500",
        "description": "Get ₹500 cashback",
        "type": "CASHBACK",
        "value": 500
      },
      "status": "PENDING_VERIFICATION",
      "assigned_rank": 15,
      "rank_display": "15th Winner",
      "redeemed_at": "2024-08-15T14:30:00Z"
    }
  }
}
```

**Backend Logic:**
- Update coupon status to `used`
- Create entry in `scan_redemptions` table
- Assign winner rank
- Trigger notification

---

### 7.3 Get Coupon History

**Endpoint:** `GET /api/v1/user/coupons`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): `used`, `pending`, `expired`
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": "uuid",
        "code": "AGR-CROP-XYZ123",
        "product_name": "AgriPower Plus",
        "prize": {
          "name": "Cashback ₹500",
          "type": "CASHBACK",
          "value": 500
        },
        "status": "REDEEMED",
        "scanned_at": "2024-08-15T14:30:00Z",
        "redeemed_at": "2024-08-16T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

**Database Table:** `coupons`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR(20) | Unique coupon code |
| product_id | UUID | Linked product |
| batch_number | VARCHAR(50) | Batch identifier |
| campaign_id | UUID | Active campaign |
| status | ENUM | `UNUSED`, `USED`, `EXPIRED` |
| used_by | UUID | User who redeemed |
| used_at | TIMESTAMP | Redemption time |
| expiry_date | DATE | Expiration date |
| created_at | TIMESTAMP | Generation date |

---

## 8. Rewards APIs

**Base Path:** `/api/v1/rewards`

### 8.1 Get User Rewards

**Endpoint:** `GET /api/v1/user/rewards`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): `pending`, `redeemed`, `verified`
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "id": "uuid",
        "coupon_code": "AGR-CROP-XYZ123",
        "prize": {
          "id": "uuid",
          "name": "Cashback ₹500",
          "name_hi": "कैशबैक ₹500",
          "description": "Get ₹500 cashback",
          "type": "CASHBACK",
          "value": 500,
          "image_url": "/prizes/cashback-500.png"
        },
        "product_name": "AgriPower Plus",
        "status": "REDEEMED",
        "won_at": "2024-08-15T10:30:00Z",
        "redeemed_at": "2024-08-16T14:00:00Z",
        "acknowledgment_file_url": "/certificates/reward-123.pdf",
        "verified_by_distributor": {
          "id": "uuid",
          "name": "National Agro Agency"
        }
      }
    ],
    "summary": {
      "total_rewards": 12,
      "pending": 3,
      "redeemed": 9,
      "total_value": 5000
    },
    "pagination": { ... }
  }
}
```

---

### 8.2 Get Reward Certificate/Letter

**Endpoint:** `GET /api/v1/rewards/:id/certificate`

**Headers:** `Authorization: Bearer <token>`

**Response:** Returns PDF file or download URL.

---

**Database Table:** `scan_redemptions`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User who won |
| coupon_id | UUID | Scanned coupon |
| campaign_tier_id | UUID | Prize tier |
| prize_type | ENUM | `CASHBACK`, `DISCOUNT`, `GIFT`, `POINTS` |
| prize_value | DECIMAL | Prize amount/percentage |
| assigned_rank | INTEGER | Winner rank number |
| status | ENUM | `PENDING_VERIFICATION`, `VERIFIED`, `CLAIMED` |
| verified_by_distributor_id | UUID | Verifying distributor |
| acknowledgment_file_url | VARCHAR(255) | Certificate PDF URL |
| scanned_at | TIMESTAMP | Scan timestamp |
| verified_at | TIMESTAMP | Verification timestamp |
| claimed_at | TIMESTAMP | Claim timestamp |

---

**Database Table:** `campaign_tiers`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Parent campaign |
| tier_name | VARCHAR(50) | Tier level (Gold, Silver) |
| reward_name | VARCHAR(100) | English reward name |
| reward_name_hi | VARCHAR(100) | Hindi reward name |
| reward_type | ENUM | `CASHBACK`, `DISCOUNT`, `GIFT` |
| reward_value | DECIMAL | Prize amount |
| probability | DECIMAL | Win probability (0-1) |
| max_winners | INTEGER | Maximum winners |
| current_winners | INTEGER | Current winner count |

---

## 9. Search APIs

**Base Path:** `/api/v1/search`

### 9.1 Global Search

**Endpoint:** `GET /api/v1/search`

**Query Parameters:**
- `q` (required): Search keyword
- `type` (optional): `products`, `categories`, `distributors`, `all`
- `limit` (optional): Results per type

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      { "id": "uuid", "name": "AgriPower Plus", "slug": "agripower-plus" }
    ],
    "categories": [
      { "id": "insecticide", "name": "Insecticides" }
    ],
    "distributors": [
      { "id": "uuid", "business_name": "National Agro Agency" }
    ]
  }
}
```

---

## 10. Contact & Support APIs

**Base Path:** `/api/v1/support`

### 10.1 Submit Contact Form

**Endpoint:** `POST /api/v1/support/contact`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "mobile": "9876543210",
  "email": "rajesh@example.com",
  "subject": "Product Inquiry",
  "message": "I want to know about..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket_id": "TICKET-2024-001",
    "message": "Your message has been received. We'll get back to you soon."
  }
}
```

**Database Table:** `support_tickets`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| ticket_number | VARCHAR(20) | Display ticket ID |
| user_id | UUID | Logged-in user (nullable) |
| name | VARCHAR(100) | Contact name |
| mobile | VARCHAR(15) | Phone number |
| email | VARCHAR(255) | Email (optional) |
| subject | VARCHAR(255) | Ticket subject |
| message | TEXT | Message content |
| status | ENUM | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| priority | ENUM | `LOW`, `MEDIUM`, `HIGH` |
| assigned_to | UUID | Admin user |
| created_at | TIMESTAMP | Submission time |
| resolved_at | TIMESTAMP | Resolution time |

---

### 10.2 Get FAQs

**Endpoint:** `GET /api/v1/support/faqs`

**Query Parameters:**
- `category` (optional): FAQ category filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "How do I scan a coupon?",
      "question_hi": "मैं कूपन कैसे स्कैन करूं?",
      "answer": "Open the app, go to Scan & Win...",
      "answer_hi": "ऐप खोलें, स्कैन और जीतें पर जाएं...",
      "category": "Scan & Win"
    }
  ]
}
```

**Database Table:** `faqs`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| question | TEXT | English question |
| question_hi | TEXT | Hindi question |
| answer | TEXT | English answer |
| answer_hi | TEXT | Hindi answer |
| category | VARCHAR(50) | FAQ category |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Visibility |

---

### 10.3 Get Legal Pages (Terms, Privacy Policy)

**Endpoint:** `GET /api/v1/pages/:slug`

**Path Parameters:**
- `slug`: `terms`, `privacy-policy`, `about`

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Terms of Service",
    "title_hi": "सेवा की शर्तें",
    "content": "<html content>",
    "content_hi": "<hindi html content>",
    "updated_at": "2024-08-01T00:00:00Z"
  }
}
```

**Database Table:** `cms_pages`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| slug | VARCHAR(50) | URL slug |
| title | VARCHAR(100) | English title |
| title_hi | VARCHAR(100) | Hindi title |
| content | TEXT | English HTML content |
| content_hi | TEXT | Hindi HTML content |
| is_active | BOOLEAN | Published status |
| updated_at | TIMESTAMP | Last update |

---

## 11. Notifications APIs

**Base Path:** `/api/v1/notifications`

### 11.1 Get User Notifications

**Endpoint:** `GET /api/v1/notifications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (optional): `REWARD`, `PROMO`, `ORDER`, `SYSTEM`
- `unread_only` (optional): Boolean
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "REWARD",
        "title": "Congratulations! You won ₹500",
        "title_hi": "बधाई हो! आपने ₹500 जीते",
        "message": "Your cashback has been credited...",
        "message_hi": "आपका कैशबैक जमा हो गया है...",
        "data": { "reward_id": "uuid" },
        "is_read": false,
        "created_at": "2024-08-15T14:30:00Z"
      }
    ],
    "unread_count": 5,
    "pagination": { ... }
  }
}
```

---

### 11.2 Mark Notification as Read

**Endpoint:** `PUT /api/v1/notifications/:id/read`

**Headers:** `Authorization: Bearer <token>`

---

### 11.3 Mark All as Read

**Endpoint:** `PUT /api/v1/notifications/read-all`

**Headers:** `Authorization: Bearer <token>`

---

**Database Table:** `notifications`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Target user |
| type | ENUM | `REWARD`, `PROMO`, `ORDER`, `SYSTEM` |
| title | VARCHAR(255) | English title |
| title_hi | VARCHAR(255) | Hindi title |
| message | TEXT | English message |
| message_hi | TEXT | Hindi message |
| data | JSONB | Additional payload |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Created time |

---

## 12. App Configuration APIs

**Base Path:** `/api/v1/config`

### 12.1 Get App Configuration

**Endpoint:** `GET /api/v1/config`

**Response:**
```json
{
  "success": true,
  "data": {
    "app_version": {
      "android_min": "1.0.0",
      "android_latest": "1.2.0",
      "ios_min": "1.0.0",
      "ios_latest": "1.2.0",
      "force_update": false
    },
    "contact": {
      "support_email": "support@agrioindia.com",
      "support_phone": "+91 1800 123 4567",
      "whatsapp": "+91 9123456789"
    },
    "social": {
      "facebook": "https://facebook.com/agrioindia",
      "instagram": "https://instagram.com/agrioindia",
      "youtube": "https://youtube.com/agrioindia"
    },
    "feature_flags": {
      "scan_enabled": true,
      "shop_enabled": false,
      "referral_enabled": true
    }
  }
}
```

---

### 12.2 Get Home Banners

**Endpoint:** `GET /api/v1/banners`

**Query Parameters:**
- `section` (optional): `HOME_TOP`, `HOME_MIDDLE`, `PRODUCTS`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "section": "HOME_TOP",
      "image_url": "/banners/diwali-offer.jpg",
      "image_url_hi": "/banners/diwali-offer-hi.jpg",
      "title": "Diwali Special Offer",
      "link_type": "PRODUCT",
      "link_value": "agripower-plus",
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

**Database Table:** `app_banners`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| section | VARCHAR(50) | Banner placement |
| image_url | VARCHAR(255) | English banner |
| image_url_hi | VARCHAR(255) | Hindi banner |
| title | VARCHAR(100) | Alt text/title |
| link_type | ENUM | `PRODUCT`, `CATEGORY`, `URL`, `NONE` |
| link_value | VARCHAR(255) | Link destination |
| display_order | INTEGER | Sort order |
| start_date | DATE | Start showing |
| end_date | DATE | Stop showing |
| is_active | BOOLEAN | Active status |

---

**Database Table:** `system_config`
| Column | Type | Description |
|--------|------|-------------|
| key | VARCHAR(50) | Config key (primary) |
| value | TEXT | Config value |
| type | ENUM | `STRING`, `JSON`, `BOOLEAN`, `INTEGER` |
| description | VARCHAR(255) | Key description |
| updated_at | TIMESTAMP | Last update |

---

## 13. Admin APIs

**Base Path:** `/api/v1/admin`

**All admin endpoints require:** `Authorization: Bearer <admin_token>` and admin role verification.

### 13.1 Admin Authentication

#### Login

**Endpoint:** `POST /api/v1/admin/auth/login`

**Request Body:**
```json
{
  "email": "admin@agrioindia.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "ADMIN_JWT_TOKEN",
    "admin": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@agrioindia.com",
      "role": "SUPER_ADMIN"
    }
  }
}
```

---

### 13.2 Dashboard Statistics

**Endpoint:** `GET /api/v1/admin/dashboard/stats`

**Query Parameters:**
- `period`: `7days`, `30days`, `90days`, `year`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 14500,
    "user_growth": 1.5,
    "active_users": 8321,
    "active_user_growth": 5.2,
    "total_scans": 25000,
    "scan_growth": 0.8,
    "coupons_redeemed": 312,
    "redemption_growth": 12,
    "total_revenue": 1250000,
    "total_products": 150,
    "total_distributors": 42,
    "new_registrations_today": 45,
    "scans_per_day": [
      { "date": "2024-08-01", "value": 245 },
      { "date": "2024-08-02", "value": 312 }
    ],
    "crop_preferences": [
      { "name": "Wheat", "value": 35 },
      { "name": "Rice", "value": 28 }
    ],
    "top_states": [
      { "state": "Uttar Pradesh", "users": 450 },
      { "state": "Maharashtra", "users": 320 }
    ]
  }
}
```

---

### 13.3 User Management

#### List Users

**Endpoint:** `GET /api/v1/admin/users`

**Query Parameters:**
- `q`: Search by name, mobile, email
- `status`: `active`, `pending`, `suspended`
- `state`: Filter by state
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "Rajesh Kumar",
        "mobile": "9876543210",
        "email": "rajesh@example.com",
        "location": "Ludhiana, Punjab",
        "crops": ["Wheat", "Rice"],
        "total_scans": 25,
        "status": "Active",
        "joined_date": "2023-08-14"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get User Details

**Endpoint:** `GET /api/v1/admin/users/:id`

#### Update User Status

**Endpoint:** `PUT /api/v1/admin/users/:id/status`

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Fraudulent activity"
}
```

#### Export Users

**Endpoint:** `GET /api/v1/admin/users/export`

**Query Parameters:** Same as list + `format`: `csv`, `xlsx`

---

### 13.4 Products Management

#### List Products

**Endpoint:** `GET /api/v1/admin/products`

#### Create Product

**Endpoint:** `POST /api/v1/admin/products`

**Request Body:**
```json
{
  "name": "AgriPower Plus",
  "name_hi": "एग्रीपावर प्लस",
  "category_id": "insecticide",
  "description": "...",
  "description_hi": "...",
  "composition": "Chlorpyrifos 20% EC",
  "dosage": "2-3 ml per liter",
  "application_method": "Foliar spray",
  "target_pests": ["Stem borer", "White grub"],
  "suitable_crops": ["Sugarcane", "Rice"],
  "pack_sizes": [
    { "size": "250ml", "sku": "AP-250", "mrp": 350, "selling_price": 320 }
  ],
  "safety_precautions": ["Wear protective clothing"],
  "images": ["base64_or_url"],
  "is_best_seller": true,
  "is_active": true
}
```

#### Update Product

**Endpoint:** `PUT /api/v1/admin/products/:id`

#### Delete Product

**Endpoint:** `DELETE /api/v1/admin/products/:id`

---

### 13.5 Coupon Management

#### List Coupons

**Endpoint:** `GET /api/v1/admin/coupons`

**Query Parameters:**
- `code`: Search by code
- `status`: `unused`, `used`, `expired`
- `product_id`: Filter by product
- `page`, `limit`

#### Generate Coupons

**Endpoint:** `POST /api/v1/admin/coupons/generate`

**Request Body:**
```json
{
  "count": 100,
  "product_id": "uuid",
  "campaign_id": "uuid",
  "prefix": "DIWALI",
  "expiry_date": "2024-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "generated_count": 100,
    "codes_preview": ["DIWALI-ABC123", "DIWALI-DEF456"],
    "batch_id": "uuid"
  }
}
```

#### Get Coupon Details

**Endpoint:** `GET /api/v1/admin/coupons/:id`

---

### 13.6 Distributors Management

#### List Distributors

**Endpoint:** `GET /api/v1/admin/distributors`

**Query Parameters:**
- `q`: Search by name
- `status`: `active`, `pending`, `inactive`
- `state`: Filter by state
- `page`, `limit`

#### Create Distributor

**Endpoint:** `POST /api/v1/admin/distributors`

#### Update Distributor

**Endpoint:** `PUT /api/v1/admin/distributors/:id`

#### Delete Distributor

**Endpoint:** `DELETE /api/v1/admin/distributors/:id`

---

### 13.7 Reports & Analytics

#### Get Report Data

**Endpoint:** `GET /api/v1/admin/reports/:type`

**Path Parameters:**
- `type`: `users`, `scans`, `coupons`, `products`, `distributors`

**Query Parameters:**
- `start_date`, `end_date`
- `group_by`: `day`, `week`, `month`

#### Export Report

**Endpoint:** `GET /api/v1/admin/reports/:type/export`

**Query Parameters:**
- Same as above + `format`: `csv`, `xlsx`, `pdf`

---

### 13.8 Settings & Configuration

#### Get Settings

**Endpoint:** `GET /api/v1/admin/settings`

#### Update Settings

**Endpoint:** `PUT /api/v1/admin/settings`

---

**Database Table:** `admin_users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Admin name |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Hashed password |
| role | ENUM | `SUPER_ADMIN`, `ADMIN`, `VIEWER` |
| is_active | BOOLEAN | Account status |
| last_login | TIMESTAMP | Last login time |
| created_at | TIMESTAMP | Creation date |

---

## 14. Database Schema Summary

### Core Tables
1. `users` - User accounts
2. `user_preferences` - Language and notification settings
3. `user_crops` - User's crop preferences

### Product Related
4. `categories` - Product categories (hierarchical)
5. `products` - Product catalog
6. `product_pack_sizes` - Product variants
7. `crops` - Master crop list

### Distribution Network
8. `distributors` - Authorized distributors
9. `distributor_coverage` - Pincode coverage
10. `distributor_products` - Available products

### Rewards System
11. `coupons` - Generated coupon codes
12. `campaigns` - Marketing campaigns
13. `campaign_tiers` - Prize tiers
14. `scan_redemptions` - User redemptions

### Support & CMS
15. `support_tickets` - Contact form submissions
16. `faqs` - FAQ content
17. `cms_pages` - Static pages (terms, privacy)
18. `notifications` - User notifications

### Configuration
19. `app_banners` - Home banners
20. `system_config` - App configuration
21. `admin_users` - Admin accounts

### Authentication
22. `otp_verifications` - OTP requests

---

## Technical Requirements

### Authentication
- JWT tokens with RS256 algorithm
- Access token expiry: 7 days
- Refresh token expiry: 30 days
- Admin tokens: 24 hours

### Rate Limiting
- OTP: 5 requests per phone per hour
- API: 100 requests per minute per user
- Admin API: 200 requests per minute

### Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "data": { ... },
  "message": "Optional success message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Pagination
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `OTP_EXPIRED` | 400 | OTP has expired |
| `OTP_INVALID` | 400 | Invalid OTP code |
| `COUPON_INVALID` | 400 | Invalid coupon code |
| `COUPON_USED` | 400 | Coupon already used |
| `COUPON_EXPIRED` | 400 | Coupon has expired |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Integration Requirements

### Third-Party Services
1. **Msg91** - OTP SMS delivery
2. **Firebase Cloud Messaging** - Push notifications
3. **AWS S3 / Cloudinary** - Image and file storage
4. **India Post API / Pincode Database** - Pincode to location lookup

### Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
MSG91_API_KEY=...
MSG91_SENDER_ID=...
AWS_S3_BUCKET=...
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
FCM_SERVER_KEY=...
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-08-15 | Initial API specification |

---

*This document should be shared with the backend development team for implementation.*
