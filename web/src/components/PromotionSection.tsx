import Link from "next/link";

const mallProducts = [
  {
    id: 1,
    image: "/images/products/can_bai_nhat.png",
    name: "Cần Nhật Bãi"
  },
  {
    id: 2,
    image: "/images/products/can_chinh_hang.png",
    name: "Máy Chính Hãng"
  },
  {
    id: 3,
    image: "/images/products/com_bo.png",
    name: "Combo Tiết Kiệm"
  },
  {
    id: 4,
    image: "/images/products/hang_nhap_khau.png",
    name: "Hàng Nhập Khẩu"
  },
  {
    id: 5,
    image: "/images/products/deal_sieu_re.png",
    name: "Deal Siêu Rẻ"
  },
  {
    id: 6,
    image: "/images/products/moi_cao_cap.png",
    name: "Mồi Cao Cấp"
  },
  {
    id: 7,
    image: "/images/products/san_gia_soc.png",
    name: "Săn Deal Giá Sốc"
  },
  {
    id: 8,
    image: "/images/products/free_ship__0d.png",
    name: "Freeship 0Đ"
  }
];

export function PromotionSection() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-700 font-semibold text-lg">Chương Trình Khuyến Mãi</h2>
          <Link href="/products" className="text-primary-600 text-sm hover:text-orange-600 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-8 gap-4">
          {mallProducts.map((product) => (
            <Link
              key={product.id}
              href="/products"
              className="flex flex-col items-center gap-3 p-3 hover:shadow-lg transition-all rounded-lg border border-gray-100"
            >
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs text-center text-gray-700 line-clamp-2 font-medium">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
