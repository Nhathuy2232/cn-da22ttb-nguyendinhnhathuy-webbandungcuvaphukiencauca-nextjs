# 📁 Hướng dẫn sử dụng thư mục images

## Cấu trúc thư mục:

```
images/
├── products/       → Ảnh sản phẩm (cần câu, máy câu, dây cước, mồi câu...)
├── categories/     → Ảnh đại diện cho danh mục
├── banners/        → Banner trang chủ, banner khuyến mãi
├── logos/          → Logo website, logo đối tác
└── blog/           → Ảnh bài viết blog
```

## Quy tắc đặt tên file:

### Products:
- Lowercase, không dấu, dùng dấu gạch ngang `-`
- Ví dụ: `can-cau-carbon-pro.jpg`, `may-cau-shimano-3000.jpg`

### Categories:
- Ví dụ: `category-can-cau.jpg`, `category-may-cau.jpg`

### Banners:
- Ví dụ: `banner-home.jpg`, `banner-flash-sale.jpg`

### Blog:
- Ví dụ: `blog-ky-thuat-cau-ca-loc.jpg`

## Định dạng file khuyến nghị:
- **JPG/JPEG**: Cho ảnh thông thường (sản phẩm, banner)
- **PNG**: Cho ảnh có nền trong suốt (logo, icon)
- **WebP**: Tối ưu dung lượng (nếu có)

## Kích thước đề xuất:
- **Ảnh sản phẩm**: 800x800px (tỉ lệ 1:1)
- **Banner**: 1920x600px
- **Category thumbnail**: 400x300px
- **Blog thumbnail**: 1200x630px

## Cách sử dụng trong code:

### Next.js Image component (khuyến nghị):
```tsx
import Image from 'next/image';

<Image 
  src="/images/products/can-cau-pro.jpg"
  alt="Cần câu carbon pro"
  width={800}
  height={800}
  priority
/>
```

### HTML img tag:
```tsx
<img src="/images/banners/banner-home.jpg" alt="Banner" />
```

## Tối ưu hóa:
- Nén ảnh trước khi upload (TinyPNG, ImageOptim)
- Sử dụng Next.js Image component để tự động optimize
- Cân nhắc dùng CDN cho production
