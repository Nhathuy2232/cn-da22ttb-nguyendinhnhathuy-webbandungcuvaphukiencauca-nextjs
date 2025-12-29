# 🎣 Hệ Thống Thương Mại Điện Tử - Cửa Hàng Dụng Cụ Câu Cá

Nền tảng thương mại điện tử chuyên nghiệp cho cửa hàng dụng cụ câu cá, được xây dựng với Next.js 15, Node.js/Express và Clean Architecture.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc](#kiến-trúc)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Đóng góp](#đóng-góp)
- [License](#license)

## 🎯 Giới thiệu

Dự án xây dựng một nền tảng thương mại điện tử hoàn chỉnh cho cửa hàng dụng cụ câu cá, áp dụng Clean Architecture để đảm bảo: 
- **Dễ bảo trì**: Code có cấu trúc rõ ràng, dễ đọc và dễ sửa
- **Dễ mở rộng**: Thêm tính năng mới không ảnh hưởng logic hiện tại
- **Dễ kiểm thử**: Các layer độc lập, dễ viết unit test
- **Độc lập framework**: Business logic không phụ thuộc vào framework

Hệ thống bao gồm:
- Website khách hàng (Customer-facing) - Next.js 15
- Admin Dashboard quản trị - Next.js 15
- RESTful API Backend - Node.js/Express với Clean Architecture
- Tích hợp thanh toán và vận chuyển GHN

##  Tính năng

###  Dành cho Khách hàng
-  Xác thực người dùng với JWT
-  Duyệt và tìm kiếm sản phẩm
-  Quản lý giỏ hàng (Thêm, Sửa, Xóa)
-  Đặt hàng và thanh toán (COD)
-  Theo dõi trạng thái đơn hàng
-  Đọc blog về kỹ thuật câu cá
-  Sản phẩm giảm giá sốc (Flash Sale)
-  Quản lý thông tin cá nhân
-  Tích hợp Google Maps (trang giới thiệu)
-  Trang hỗ trợ khách hàng

### Dành cho Quản trị viên
-  Dashboard thống kê tổng quan
-  Quản lý sản phẩm (Tạo, Sửa, Xóa)
-  Quản lý danh mục sản phẩm
-  Quản lý đơn hàng và trạng thái
-  Quản lý blog và bài viết
-  Upload và quản lý hình ảnh
-  Quản lý người dùng
-  Quản lý Flash Sale

###  Tính năng nổi bật
-  Tích hợp API Giao Hàng Nhanh (GHN)
-  Gửi email tự động khi đặt hàng
-  Tìm kiếm và lọc sản phẩm nâng cao
-  Thiết kế responsive trên mọi thiết bị
-  Giao diện hoàn toàn tiếng Việt
-  Clean Architecture cho backend

##  Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 15.5.6 (React 18.3.1)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.18
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Turbopack

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.9.3
- **Database**: MySQL 2 (via mysql2)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.3
- **Validation**: Zod 4.1.12
- **Logging**: Pino 10.1.0
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **File Upload**: Multer 2.0.2
- **Security**:  Helmet 8.1.0, CORS 2.8.5

### DevOps & Tools
- **Database**:  XAMPP (MySQL)
- **Version Control**: Git & GitHub
- **Package Manager**: npm

## 📁 Cấu trúc dự án

```
DOAN_CN_E-COMMERCE/
├── server/                    # Backend API
│   ├── src/
│   │   ├── controllers/      # Controllers
│   │   ├── routes/           # API Routes
│   │   ├── models/           # Database Models
│   │   ├── middleware/       # Middleware (auth, validation)
│   │   ├── utils/            # Utilities
│   │   └── server.ts         # Entry point
│   ├── database/             # SQL scripts
│   ├── uploads/              # Upload folder
│   ├── package. json
│   └── tsconfig.json
│
├── web/                       # Frontend Next.js
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React Components
│   │   ├── lib/              # Libraries & Utils
│   │   └── styles/           # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   └── tailwind.config.ts
│
├── API_DOCUMENTATION.md       # API Documentation
├── TRANSLATION_NOTES.md       # Translation notes
└── README.md
```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL >= 5.7 (hoặc XAMPP)
- npm hoặc yarn

### 1. Clone repository

```bash
git clone https://github.com/Nhathuy2232/DOAN_CN_E-COMMERCE.git
cd DOAN_CN_E-COMMERCE
```

### 2.  Cài đặt Backend

```bash
cd server
npm install
```

**Cấu hình Backend:**

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Môi trường
NODE_ENV=development

# Server
PORT=4000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Database (XAMPP MySQL mặc định)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=fishing_shop
DB_CONNECTION_LIMIT=10

# Pagination
PAGINATION_LIMIT=20
```

**Tạo Database:**

1. Khởi động XAMPP (Apache + MySQL)
2. Truy cập phpMyAdmin:  http://localhost/phpmyadmin
3. Tạo database mới tên `fishing_shop`
4. Import file SQL từ `server/database/` (nếu có)

**Chạy Backend:**

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Backend sẽ chạy tại: http://localhost:4000

### 3. Cài đặt Frontend

```bash
cd ../web
npm install
```

**Cấu hình Frontend:**

Tạo file `.env. local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Chỉnh sửa file `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Chạy Frontend:**

```bash
# Development mode với Turbopack
npm run dev

# Production build
npm run build
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## 💻 Sử dụng

### Development

1. **Khởi động MySQL (XAMPP)**
   ```bash
   # Mở XAMPP Control Panel
   # Start Apache và MySQL
   ```

2. **Chạy Backend**
   ```bash
   cd server
   npm run dev
   ```

3. **Chạy Frontend** (Terminal mới)
   ```bash
   cd web
   npm run dev
   ```

4. **Truy cập ứng dụng**
   - Website:  http://localhost:3000
   - API: http://localhost:4000/api
   - Swagger API Docs: http://localhost:4000/api-docs (nếu có)

### Tài khoản mặc định

**Admin:**
- Email: admin@fishingshop.com
- Password: admin123

**Customer:**
- Email: customer@example.com
- Password: customer123

##  API Documentation

API Documentation chi tiết được lưu tại file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### API Endpoints chính: 

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token

#### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm

#### Cart
- `GET /api/cart` - Xem giỏ hàng
- `POST /api/cart/items` - Thêm vào giỏ
- `PUT /api/cart/items/:id` - Cập nhật
- `DELETE /api/cart/items/:id` - Xóa

#### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn hàng

#### Admin
- `GET /api/admin/dashboard/stats` - Thống kê
- `POST /api/admin/products` - Tạo sản phẩm
- `POST /api/admin/upload` - Upload hình ảnh

### Testing API với cURL

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fishingshop.com","password":"admin123"}'

# Get Products
curl http://localhost:4000/api/products? page=1&limit=20
```

## 🧪 Testing

### Test GHN API

```bash
cd server
node test-ghn-api.js
```

## 📸 Screenshots

_Thêm screenshots của ứng dụng tại đây_

##  Đóng góp

Contributions, issues và feature requests đều được chào đón! 

1. Fork dự án
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 👥 Tác giả

- **Nhathuy2232** - [GitHub](https://github.com/Nhathuy2232)

## 📝 License

Dự án này được phát hành dưới license ISC.

## 🔗 Links

- Repository: https://github.com/Nhathuy2232/DOAN_CN_E-COMMERCE
- Issues: https://github.com/Nhathuy2232/DOAN_CN_E-COMMERCE/issues

## 📧 Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng tạo issue hoặc liên hệ qua GitHub.

---

⭐ Nếu dự án này hữu ích, hãy cho một star nhé! 
