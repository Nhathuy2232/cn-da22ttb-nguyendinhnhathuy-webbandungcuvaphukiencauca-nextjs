"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { Plus, Edit, Trash2, Percent, DollarSign } from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/admin/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Xóa mã giảm giá thành công");
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Có lỗi xảy ra");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Mã giảm giá</h1>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          Thêm mã giảm giá
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điều kiện
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sử dụng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-bold rounded">
                      {coupon.code}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    {coupon.discount_type === "percentage" ? (
                      <>
                        <Percent className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-semibold">{coupon.discount_value}%</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        <span className="font-semibold">
                          {formatPrice(coupon.discount_value)}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Đơn tối thiểu: {formatPrice(coupon.min_order_value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {coupon.used_count}/{coupon.usage_limit || "∞"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(coupon.start_date).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(coupon.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.is_active ? "Kích hoạt" : "Vô hiệu"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
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
    </div>
  );
}
