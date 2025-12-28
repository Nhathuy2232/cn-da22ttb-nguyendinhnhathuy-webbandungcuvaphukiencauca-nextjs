'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { apiClient } from "@/lib/api-client";

interface FlashSaleProduct {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_thumbnail: string | null;
  discount_percentage: number;
  discounted_price: number;
  start_time: string;
  end_time: string;
  status: string;
}

export default function FlashSalePage() {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('default');

  // Fetch flash sale products
  useEffect(() => {
    async function fetchFlashSales() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/flash-sales/active');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setProducts(result.data);
            
            // Calculate time left based on the earliest end_time
            if (result.data.length > 0) {
              const earliestEnd = new Date(result.data[0].end_time);
              calculateTimeLeft(earliestEnd);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch flash sales:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFlashSales();
  }, []);

  // Calculate time remaining
  const calculateTimeLeft = (endTime: Date) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.discounted_price - b.discounted_price;
      case 'price-desc':
        return b.discounted_price - a.discounted_price;
      case 'discount':
        return b.discount_percentage - a.discount_percentage;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-orange-100">
              <ChevronLeft className="w-5 h-5" />
              <span>Trang chủ</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                </svg>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-wide">GIẢM GIÁ SỐC</h1>
                  <p className="text-orange-100 text-sm">Ưu đãi có hạn - Nhanh tay kẻo hết!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right mr-3">
                  <div className="text-white text-xs font-medium">KẾT THÚC TRONG</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] text-orange-100 text-center">Giờ</div>
                  </div>
                  <span className="text-2xl text-white font-bold">:</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] text-orange-100 text-center">Phút</div>
                  </div>
                  <span className="text-2xl text-white font-bold">:</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] text-orange-100 text-center">Giây</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Sắp xếp theo:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('default')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'default'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mặc định
                </button>
                <button
                  onClick={() => setSortBy('discount')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'discount'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Giảm nhiều nhất
                </button>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-asc'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Giá thấp đến cao
                </button>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'price-desc'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Giá cao đến thấp
                </button>
              </div>
            </div>
            
            <div className="text-gray-600">
              <span className="font-semibold text-orange-600">{products.length}</span> sản phẩm đang giảm giá
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm giảm giá</h3>
            <p className="text-gray-500">Vui lòng quay lại sau để không bỏ lỡ các ưu đãi hấp dẫn!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedProducts.map((product, index) => (
                  <Link
                    key={`${product.product_id}-${index}`}
                    href={`/products/${product.product_id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100"
                  >
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={product.product_thumbnail || '/images/products/placeholder.jpg'}
                        alt={product.product_name}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                        -{product.discount_percentage}%
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 h-10 group-hover:text-orange-600 transition-colors">
                        {product.product_name}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-orange-600 text-lg font-bold">
                            {product.discounted_price.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm line-through">
                          {product.product_price.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                      
                      {/* Progress bar cho số lượng đã bán (giả lập) */}
                      <div className="mt-3">
                        <div className="bg-gray-200 rounded-full overflow-hidden h-5">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
                            style={{ width: `${Math.min(Math.random() * 100, 95)}%` }}
                          >
                            ĐÃ BÁN {Math.floor(Math.random() * 100)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>

            {/* Promotion Banner */}
            <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">🔥 DEAL SỐC TRONG NGÀY 🔥</h2>
              <p className="text-orange-100">
                Miễn phí vận chuyển cho đơn hàng từ 500.000₫ • Giảm thêm 100.000₫ cho đơn từ 2.000.000₫
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
