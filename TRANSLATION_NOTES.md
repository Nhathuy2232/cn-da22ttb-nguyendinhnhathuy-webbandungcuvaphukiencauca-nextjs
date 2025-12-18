# Translation Notes - Ghi chú Dịch thuật

## Ngôn ngữ sử dụng trong dự án

### Database Schema
- Tên bảng (tables): **Tiếng Anh** (users, products, orders, categories, etc.)
- Tên cột (columns): **Tiếng Anh** (id, name, email, price, etc.)
- Comments trong SQL: **Tiếng Việt** (để dễ đọc và bảo trì)

### Backend Code
- Biến, hàm, class: **Tiếng Anh** (camelCase, PascalCase)
- Comments: **Tiếng Việt** (giải thích logic)
- Messages/Errors: **Tiếng Việt** (response cho user)

### Frontend Code
- Component names: **Tiếng Anh** (ProductCard, Header, Footer)
- Props, state: **Tiếng Anh**
- UI Text: **Tiếng Việt** (hiển thị cho người dùng)
- Comments: **Tiếng Việt**

## Thuật ngữ chuyên ngành Câu cá

| English | Tiếng Việt | Ghi chú |
|---------|-----------|---------|
| Fishing Rod | Cần Câu | |
| Fishing Reel | Máy Câu | |
| Fishing Line | Dây Cước | |
| Hook | Lưỡi Câu / Móc Câu | |
| Bait | Mồi Câu | |
| Lure | Mồi Giả | |
| Tackle | Dụng Cụ Câu | |
| Spinning Reel | Máy Câu Spinning | |
| Baitcasting Reel | Máy Câu Baitcasting | |
| Carbon Rod | Cần Carbon | |
| PE Line | Dây PE | |
| Fluorocarbon Line | Dây Fluorocarbon | |

## Convention Đặt tên

### Database
```sql
-- Bảng (table): số nhiều, snake_case
CREATE TABLE products (...)
CREATE TABLE order_items (...)

-- Cột (column): snake_case
id, full_name, created_at, is_published
```

### Backend TypeScript
```typescript
// Interface: PascalCase
interface ProductRecord { }
interface UserCredentials { }

// Function: camelCase
async function findById(id: number) { }
async function updateProduct(data: Partial<Product>) { }

// Variable: camelCase
const productRepository = new ProductRepository();
const totalRevenue = 0;
```

### Frontend React/Next.js
```typescript
// Component: PascalCase
function ProductCard() { }
function AdminDashboard() { }

// Hook: camelCase với prefix "use"
function useAuth() { }
function useProducts() { }

// Props: camelCase
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}
```

## Lưu ý khi làm việc

1. **Không dịch thuật ngữ kỹ thuật**: API, endpoint, query, middleware, repository
2. **Dịch message/error cho user**: "Đăng nhập thành công", "Không tìm thấy sản phẩm"
3. **Giữ nguyên từ khóa**: SELECT, INSERT, UPDATE, DELETE, WHERE, JOIN
4. **Comment code bằng tiếng Việt** để team dễ hiểu
5. **UI text luôn bằng tiếng Việt** cho người dùng Việt Nam
