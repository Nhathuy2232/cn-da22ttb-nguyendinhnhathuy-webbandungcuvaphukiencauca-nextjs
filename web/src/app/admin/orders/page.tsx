"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { Eye, Package, X, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

interface Order {
  id: number;
  user_name: string;
  user_email?: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  note?: string;
}

interface OrderDetail extends Order {
  items?: any[];
  address?: any;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const url =
        filter === "all"
          ? "http://localhost:4000/api/admin/orders"
          : `http://localhost:4000/api/admin/orders?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:4000/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:4000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        alert("Cập nhật trạng thái thành công");
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setShowDetailModal(false);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra");
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      paid: CheckCircle,
      shipped: Truck,
      completed: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Chờ xử lý",
      paid: "Đã thanh toán",
      shipped: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      cod: "Thanh toán khi nhận hàng",
      bank_transfer: "Chuyển khoản ngân hàng",
      e_wallet: "Ví điện tử",
    };
    return methods[method] || method;
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <p className="text-gray-600 mt-1">Tổng {orders.length} đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "Tất cả" },
            { value: "pending", label: "Chờ xử lý" },
            { value: "paid", label: "Đã thanh toán" },
            { value: "shipped", label: "Đang giao" },
            { value: "completed", label: "Hoàn thành" },
            { value: "cancelled", label: "Đã hủy" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.user_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.total_amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => fetchOrderDetail(order.id)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Khách hàng</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.user_name}</p>
                  {selectedOrder.user_email && (
                    <p className="text-sm text-gray-600">{selectedOrder.user_email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <div className="mt-1">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="shipped">Đang giao</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {getPaymentMethodText(selectedOrder.payment_method)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày đặt</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {selectedOrder.note && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.note}
                  </p>
                </div>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                            Sản phẩm
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                            Đơn giá
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">
                            Số lượng
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item: any) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm">{item.product_name}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-right">
                              {formatPrice(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                            Tổng cộng:
                          </td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-primary-600">
                            {formatPrice(selectedOrder.total_amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
