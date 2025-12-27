"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from '@/lib/formatPrice';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail_url?: string;
  category_name?: string;
  stock_quantity: number;
  images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

export function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/products?limit=10");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-gray-700 font-semibold text-lg">Sản Phẩm Dành Cho Bạn</h2>
        </div>

        {/* Products Grid */}
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border border-gray-100 rounded-lg hover:shadow-xl hover:border-primary-600 transition-all overflow-hidden group bg-white"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.thumbnail_url || product.images?.find(img => img.is_primary)?.image_url || '/images/products/placeholder.jpg'}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                  {product.stock_quantity < 10 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                      Còn {product.stock_quantity}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết sản phẩm
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs text-primary-600 font-semibold mb-1 uppercase">
                    {product.category_name || 'Sản phẩm'}
                  </div>
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 h-10 font-medium">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary-600 font-bold text-lg">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center py-6 border-t border-gray-200">
          <Link href="/products">
            <button className="px-12 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Xem thêm
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
