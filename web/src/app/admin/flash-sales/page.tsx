"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail_url?: string;
  images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

interface FlashSale {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_thumbnail: string;
  discount_percentage: number;
  discounted_price: number;
  start_time: string;
  end_time: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

export default function AdminFlashSalesPage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);
  const [formData, setFormData] = useState({
    product_id: "",
    discount_percentage: "",
    start_time: "",
    end_time: "",
    status: "active" as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchFlashSales();
    fetchProducts();
  }, []);

  const fetchFlashSales = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:4000/api/flash-sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setFlashSales(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching flash sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:4000/api/admin/products?limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpenModal = (flashSale?: FlashSale) => {
    if (flashSale) {
      setEditingFlashSale(flashSale);
      setFormData({
        product_id: flashSale.product_id.toString(),
        discount_percentage: flashSale.discount_percentage.toString(),
        start_time: new Date(flashSale.start_time).toISOString().slice(0, 16),
        end_time: new Date(flashSale.end_time).toISOString().slice(0, 16),
        status: flashSale.status === 'expired' ? 'inactive' : flashSale.status,
      });
    } else {
      setEditingFlashSale(null);
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      setFormData({
        product_id: "",
        discount_percentage: "",
        start_time: now.toISOString().slice(0, 16),
        end_time: tomorrow.toISOString().slice(0, 16),
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFlashSale(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const url = editingFlashSale
        ? `http://localhost:4000/api/flash-sales/${editingFlashSale.id}`
        : "http://localhost:4000/api/flash-sales";

      const payload = {
        product_id: parseInt(formData.product_id),
        discount_percentage: parseFloat(formData.discount_percentage),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        status: formData.status,
      };

      const response = await fetch(url, {
        method: editingFlashSale ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Lưu flash sale thành công!");
        handleCloseModal();
        fetchFlashSales();
      } else {
        alert(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error saving flash sale:", error);
      alert("Có lỗi xảy ra khi lưu flash sale!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa flash sale này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:4000/api/flash-sales/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Xóa flash sale thành công!");
        fetchFlashSales();
      } else {
        alert(result.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error deleting flash sale:", error);
      alert("Có lỗi xảy ra khi xóa flash sale!");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      expired: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Flash Sale</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
        >
          <Plus className="h-5 w-5" />
          Thêm Flash Sale
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Giá gốc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Giảm giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Giá sau giảm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {flashSales.map((flashSale) => (
                <tr key={flashSale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={flashSale.product_thumbnail || "/images/placeholder.png"}
                        alt={flashSale.product_name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <span className="ml-3 font-medium">{flashSale.product_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatPrice(flashSale.product_price)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                    -{flashSale.discount_percentage}%
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {formatPrice(flashSale.discounted_price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{new Date(flashSale.start_time).toLocaleString('vi-VN')}</div>
                    <div className="text-xs">đến</div>
                    <div>{new Date(flashSale.end_time).toLocaleString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(
                        flashSale.status
                      )}`}
                    >
                      {flashSale.status === 'active' ? 'Đang hoạt động' : 
                       flashSale.status === 'expired' ? 'Hết hạn' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(flashSale)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Sửa"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(flashSale.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flashSales.length === 0 && (
            <p className="p-6 text-center text-gray-500">Chưa có flash sale nào</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingFlashSale ? "Chỉnh sửa Flash Sale" : "Thêm Flash Sale mới"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sản phẩm *
                </label>
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  disabled={!!editingFlashSale}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phần trăm giảm giá (%) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_percentage: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Ví dụ: 20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                >
                  {editingFlashSale ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
