'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts, useCategories } from '@/hooks/useApi';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/formatPrice';

export default function ProductsPage() {
  const [categoryFromUrl, setCategoryFromUrl] = useState('');
  const [searchFromUrl, setSearchFromUrl] = useState('');
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || '';
    const searchParam = params.get('search') || '';
    setCategoryFromUrl(category);
    setSearchFromUrl(searchParam);
    setSelectedCategory(category);
    setSearch(searchParam);
  }, []);

  // Đặt danh mục từ URL khi component được mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Đặt search từ URL khi component được mount
  useEffect(() => {
    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }
  }, [searchFromUrl]);

  // Reset page khi thay đổi search hoặc category
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  const { data: productsData, loading: productsLoading } = useProducts({
    search,
    category: selectedCategory,
    page,
    limit: 20,
  });

  const { data: categoriesData } = useCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sản Phẩm</h1>

        {/* Bộ lọc */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categoriesData?.data?.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lưới sản phẩm */}
        {productsLoading ? (
          <div className="text-center py-12">
            <p>Đang tải...</p>
          </div>
        ) : productsData?.data?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {productsData?.data?.map((product: any) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="glass flex flex-col rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                      <img 
                        src={product.thumbnail_url || product.images?.find((img: any) => img.is_primary)?.image_url || '/images/products/placeholder.jpg'} 
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/placeholder.jpg';
                        }}
                      />
                      {product.status === 'active' && product.stock_quantity < 10 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Còn {product.stock_quantity}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                      {product.category_name || product.category || 'Sản phẩm'}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 min-h-[2.5rem]">
                      {product.description || 'Sản phẩm chất lượng cao'}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-semibold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <button className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Phân trang */}
            {productsData?.pagination && (
              <div className="flex justify-center gap-2">
                <button
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {page} / {productsData.pagination.totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                  disabled={page >= productsData.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
