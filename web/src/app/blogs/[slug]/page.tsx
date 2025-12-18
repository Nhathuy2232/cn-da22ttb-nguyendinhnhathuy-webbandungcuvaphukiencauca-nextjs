'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Eye, Tag, ArrowLeft } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  author_name?: string;
  view_count: number;
  published_at: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // Thử lấy theo slug trước, nếu là số thì lấy theo ID
      const isNumeric = /^\d+$/.test(slug);
      const url = isNumeric 
        ? `http://localhost:4000/api/blogs/${slug}`
        : `http://localhost:4000/api/blogs?slug=${slug}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const blogData = isNumeric ? data : data.blogs?.[0] || null;
        setBlog(blogData);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại danh sách blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách blog
          </Link>
        </div>

        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="relative aspect-[21/9] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/blog/placeholder.jpg';
                }}
              />
              {/* Category Badge */}
              {blog.category && (
                <span className="absolute top-6 left-6 px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-xl">
                  {blog.category}
                </span>
              )}
            </div>
          )}

          <div className="px-8 py-10 md:px-12 md:py-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
              {blog.author_name && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {blog.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tác giả</div>
                    <div className="font-semibold text-gray-900">{blog.author_name}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium">
                  {new Date(blog.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{blog.view_count.toLocaleString()} lượt xem</span>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-xl text-gray-700 leading-relaxed mb-10 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-600">
                <p className="italic">{blog.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-10"
              style={{
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Thẻ (Tags)</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-sm font-medium rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
