'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/formatPrice';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail_url?: string;
  stock_quantity: number;
  category_id: number;
  images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

export default function RelatedProducts({ productId, categoryId }: { productId: number; categoryId: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const loadRelatedProducts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/products?category=${categoryId}&limit=4`);
      const data = await response.json();
      if (data.success && data.data) {
        // Kiểm tra cấu trúc response - có thể là data.data.products hoặc data.data
        const productList = data.data.products || data.data || [];
        // Lọc bỏ sản phẩm hiện tại
        const filtered = productList.filter((p: Product) => p.id !== productId);
        setProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm liên quan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.thumbnail_url || product.images?.find(img => img.is_primary)?.image_url || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
              {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                <p className="text-sm text-orange-600 mt-1">
                  Chỉ còn {product.stock_quantity} sản phẩm
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
