'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Eye, Tag } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  view_count: number;
  published_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      let url = 'http://localhost:4000/api/blogs?isPublished=true';
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Blog Câu Cá</h1>
          <p className="text-xl text-blue-100">Khám phá kiến thức, kỹ thuật và kinh nghiệm câu cá từ cộng đồng</p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h2>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Tất cả bài viết
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category!)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4 text-lg">Đang tải bài viết...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-500">Hãy quay lại sau để đọc những bài viết mới nhất</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug || blog.id}`}>
                <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
                  {/* Thumbnail */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={blog.thumbnail || '/images/blog/placeholder.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/blog/placeholder.jpg';
                      }}
                    />
                    {blog.category && (
                      <span className="absolute top-4 left-4 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {blog.title}
                    </h2>
                    
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{new Date(blog.published_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{blog.view_count.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
