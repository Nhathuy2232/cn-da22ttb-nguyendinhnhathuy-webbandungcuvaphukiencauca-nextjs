# API Documentation - Tài liệu API

## Base URL
```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

## Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789"
}

Response: 201 Created
{
  "message": "Đăng ký thành công"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "role": "customer"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGc..."
}
```

## Products - Sản phẩm

### Get All Products
```http
GET /api/products?page=1&limit=20&search=cần&category=1

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "Cần Câu Carbon Pro",
      "description": "Cần câu chuyên nghiệp...",
      "price": 1500000,
      "stock_quantity": 50,
      "category_id": 1,
      "category_name": "Cần Câu",
      "thumbnail_url": "/images/products/can-cau.jpg",
      "sku": "CC-PRO-21",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Get Product by ID
```http
GET /api/products/:id

Response: 200 OK
{
  "id": 1,
  "name": "Cần Câu Carbon Pro",
  "description": "Cần câu chuyên nghiệp...",
  "price": 1500000,
  "stock_quantity": 50,
  "category_id": 1,
  "category_name": "Cần Câu",
  "thumbnail_url": "/images/products/can-cau.jpg",
  "sku": "CC-PRO-21",
  "status": "active",
  "images": [
    {
      "id": 1,
      "image_url": "/images/products/can-cau-1.jpg",
      "alt_text": "Ảnh chính",
      "is_primary": true
    },
    {
      "id": 2,
      "image_url": "/images/products/can-cau-2.jpg",
      "alt_text": "Chi tiết",
      "is_primary": false
    }
  ]
}
```

## Categories - Danh mục

### Get All Categories
```http
GET /api/categories

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cần Câu",
      "description": "Các loại cần câu carbon, composite",
      "created_at": "2025-12-04T12:13:34.000Z"
    }
  ]
}
```

## Cart - Giỏ hàng

### Get Cart
```http
GET /api/cart
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "user_id": 1,
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Cần Câu Carbon Pro",
      "price": 1500000,
      "quantity": 2,
      "thumbnail_url": "/images/products/can-cau.jpg"
    }
  ],
  "total": 3000000
}
```

### Add to Cart
```http
POST /api/cart/items
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}

Response: 201 Created
{
  "message": "Đã thêm vào giỏ hàng"
}
```

### Update Cart Item
```http
PUT /api/cart/items/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "quantity": 3
}

Response: 200 OK
{
  "message": "Cập nhật giỏ hàng thành công"
}
```

### Remove from Cart
```http
DELETE /api/cart/items/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Đã xóa khỏi giỏ hàng"
}
```

## Orders - Đơn hàng

### Create Order
```http
POST /api/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "shipping_address": {
    "full_name": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1"
  },
  "payment_method": "cod",
  "coupon_code": "GIAM10"
}

Response: 201 Created
{
  "order_id": 1,
  "message": "Đặt hàng thành công"
}
```

### Get Orders
```http
GET /api/orders
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": 1,
    "total_amount": 3000000,
    "status": "pending",
    "created_at": "2025-12-04T18:00:00.000Z",
    "items": [...]
  }
]
```

## Blogs - Bài viết

### Get All Blogs
```http
GET /api/blogs?page=1&limit=12&category=Kỹ thuật câu&isPublished=true

Response: 200 OK
{
  "blogs": [
    {
      "id": 1,
      "title": "10 Kỹ thuật câu cá cơ bản",
      "slug": "10-ky-thuat-cau-ca-co-ban",
      "excerpt": "Hướng dẫn chi tiết...",
      "category": "Kỹ thuật câu",
      "thumbnail": "/images/blog/ky-thuat.jpg",
      "view_count": 150,
      "published_at": "2025-12-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25
  }
}
```

### Get Blog Detail
```http
GET /api/blogs/:id

Response: 200 OK
{
  "id": 1,
  "title": "10 Kỹ thuật câu cá cơ bản",
  "slug": "10-ky-thuat-cau-ca-co-ban",
  "excerpt": "Hướng dẫn chi tiết...",
  "content": "<p>Nội dung đầy đủ...</p>",
  "category": "Kỹ thuật câu",
  "tags": ["câu cá", "kỹ thuật", "hướng dẫn"],
  "thumbnail": "/images/blog/ky-thuat.jpg",
  "author_name": "Admin",
  "view_count": 151,
  "published_at": "2025-12-01T10:00:00.000Z"
}
```

## Admin APIs (Yêu cầu quyền admin)

### Upload Image
```http
POST /api/admin/upload
Authorization: Bearer {adminToken}
Content-Type: multipart/form-data

image: [file]

Response: 200 OK
{
  "success": true,
  "imageUrl": "/images/products/image-123456.jpg",
  "filename": "image-123456.jpg"
}
```

### Admin - Products
```http
GET /api/admin/products
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
Authorization: Bearer {adminToken}
```

### Admin - Categories
```http
GET /api/admin/categories
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id
Authorization: Bearer {adminToken}
```

### Admin - Orders
```http
GET /api/admin/orders
GET /api/admin/orders/:id
PUT /api/admin/orders/:id/status
Authorization: Bearer {adminToken}
```

### Admin - Blogs
```http
GET /api/admin/blogs
GET /api/admin/blogs/:id
POST /api/admin/blogs
PUT /api/admin/blogs/:id
DELETE /api/admin/blogs/:id
Authorization: Bearer {adminToken}
```

### Admin - Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {adminToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "totalCategories": 6,
    "totalOrders": 50,
    "totalRevenue": 150000000,
    "recentOrders": [...],
    "topProducts": [...],
    "ordersByStatus": {...},
    "revenueByDay": [...]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Vui lòng đăng nhập"
}
```

### 403 Forbidden
```json
{
  "message": "Không có quyền truy cập"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy tài nguyên"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi máy chủ"
}
```

## Rate Limiting
- 100 requests/phút cho API public
- 1000 requests/phút cho API admin (với token hợp lệ)

## Pagination
- Default: page=1, limit=20
- Max limit: 100

## Image Upload
- Kích thước tối đa: 5MB
- Định dạng: JPG, PNG, GIF, WEBP
- Lưu tại: `/web/public/images/products/`
