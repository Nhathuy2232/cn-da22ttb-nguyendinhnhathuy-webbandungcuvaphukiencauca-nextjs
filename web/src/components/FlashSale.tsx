"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const flashSaleProducts = [
  {
    id: 1,
    image: "/images/products/can-cau-carbon-pro.jpg",
    name: "Cần Câu Carbon",
    price: "₫1,990,000",
    originalPrice: "₫3,990,000",
    discount: "-50%",
    sold: 45
  },
  {
    id: 2,
    image: "/images/products/may-cau-shimano.jpg",
    name: "Máy Câu Shimano",
    price: "₫2,490,000",
    originalPrice: "₫4,990,000",
    discount: "-50%",
    sold: 67
  },
  {
    id: 3,
    image: "/images/products/day-pe-8-loi.jpg",
    name: "Dây PE 8 Lõi",
    price: "₫390,000",
    originalPrice: "₫790,000",
    discount: "-50%",
    sold: 89
  },
  {
    id: 4,
    image: "/images/products/luoi-cau-assorted.jpg",
    name: "Lưỡi Câu Nhật",
    price: "₫149,000",
    originalPrice: "₫299,000",
    discount: "-50%",
    sold: 34
  },
  {
    id: 5,
    image: "/images/products/moi-mem-silicon.jpg",
    name: "Mồi Giả Silicone",
    price: "₫79,000",
    originalPrice: "₫159,000",
    discount: "-50%",
    sold: 78
  },
  {
    id: 6,
    image: "/images/products/hop-do-nghe.jpg",
    name: "Hộp Đựng Đồ 5 Tầng",
    price: "₫329,000",
    originalPrice: "₫659,000",
    discount: "-50%",
    sold: 56
  }
];

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 30,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                </svg>
                <span className="text-2xl font-bold text-white tracking-wide">GIẢM GIÁ SỐC</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="bg-black/20 px-2 py-1 rounded">
                  <span className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                </div>
                <span className="text-xl">:</span>
                <div className="bg-black/20 px-2 py-1 rounded">
                  <span className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                </div>
                <span className="text-xl">:</span>
                <div className="bg-black/20 px-2 py-1 rounded">
                  <span className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
            <Link href={"/flash-sale" as any} className="flex items-center gap-1 text-white hover:text-orange-100">
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="p-4">
          <div className="grid grid-cols-6 gap-2">
            {flashSaleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}` as any}
                className="border border-gray-100 rounded-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl">
                    {product.discount}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-xs text-gray-700 line-clamp-2 mb-1 h-8">{product.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-primary-600 text-lg font-bold">{product.price}</span>
                  </div>
                  <div className="bg-orange-500 rounded-full overflow-hidden h-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${Math.min(product.sold, 100)}%` }}
                    >
                      ĐÃ BÁN{product.sold}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
