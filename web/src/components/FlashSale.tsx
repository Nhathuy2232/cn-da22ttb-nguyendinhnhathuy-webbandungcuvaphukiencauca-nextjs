"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface FlashSaleProduct {
  product_id: number;
  product_name: string;
  product_price: number;
  product_thumbnail: string;
  discount_percentage: number;
  discounted_price: number;
  flash_sale_quantity: number;
  sold_quantity: number;
}

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 30,
    seconds: 30
  });
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/flash-sales/active');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.slice(0, 6)); // Lấy 6 sản phẩm đầu tiên
        }
      }
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <div className="text-center text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                  </svg>
                  <span className="text-2xl font-bold text-white tracking-wide">GIẢM GIÁ SỐC</span>
                </div>
              </div>
              <Link href="/flash-sale" className="text-white hover:text-yellow-300 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Xem tất cả</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
          <div className="p-8 text-center text-gray-500">
            Hiện tại không có chương trình flash sale nào đang diễn ra.
          </div>
        </div>
      </div>
    );
  }

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
            {products.map((product, index) => (
              <Link
                key={`${product.product_id}-${index}`}
                href={`/products/${product.product_id}` as any}
                className="border border-gray-100 rounded-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.product_thumbnail || '/images/products/placeholder.jpg'}
                    alt={product.product_name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl">
                    -{product.discount_percentage}%
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-xs text-gray-700 line-clamp-2 mb-1 h-8">{product.product_name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-primary-600 text-lg font-bold">
                      {product.discounted_price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="bg-orange-500 rounded-full overflow-hidden h-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${Math.min((product.sold_quantity / product.flash_sale_quantity) * 100, 100)}%` }}
                    >
                      ĐÃ BÁN {product.sold_quantity}
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

