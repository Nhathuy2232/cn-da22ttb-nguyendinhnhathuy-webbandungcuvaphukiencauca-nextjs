"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, X, FileText } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  author_name?: string;
  view_count: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    thumbnail: "",
    is_published: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // Không filter isPublished để hiển thị tất cả bài viết trong admin
      const response = await fetch("http://localhost:4000/api/admin/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blogs data:', data); // Debug log
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (blog?: Blog) => {
    if (blog) {
      // Lấy chi tiết đầy đủ của blog
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:4000/api/admin/blogs/${blog.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEditingBlog(data);
          setFormData({
            title: data.title,
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category || "",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
            thumbnail: data.thumbnail || "",
            is_published: data.is_published || false,
          });
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        thumbnail: "",
        is_published: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingBlog
        ? `http://localhost:4000/api/admin/blogs/${editingBlog.id}`
        : "http://localhost:4000/api/admin/blogs";

      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      const response = await fetch(url, {
        method: editingBlog ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingBlog ? "Cập nhật bài viết thành công" : "Thêm bài viết thành công");
        handleCloseModal();
        fetchBlogs();
      } else {
        const error = await response.json();
        alert(error.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Có lỗi xảy ra khi lưu bài viết");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:4000/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Xóa bài viết thành công");
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Có lỗi xảy ra");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Blog</h1>
          <p className="text-gray-600 mt-1">Tổng {blogs.length} bài viết</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm bài viết
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt xem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {blog.title}
                      </div>
                      {blog.excerpt && (
                        <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {blog.excerpt}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {blog.category && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {blog.view_count}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      blog.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {blog.is_published ? "Đã xuất bản" : "Nháp"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(blog)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBlog ? "Sửa bài viết" : "Thêm bài viết mới"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="slug-bai-viet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Slug tự động được tạo từ tiêu đề
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn về bài viết..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={12}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung đầy đủ của bài viết..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ HTML và Markdown
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ví dụ: Kỹ thuật câu, Đánh giá sản phẩm..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Phân cách bằng dấu phẩy</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL ảnh thumbnail
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="/images/blog/ten-bai-viet.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Xuất bản ngay lập tức
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingBlog ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
