"use client";

import { useEffect, useState } from "react";
import { Package, FolderTree, ShoppingCart, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:4000/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Đã thanh toán", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Đang giao", color: "bg-purple-100 text-purple-800" },
      completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const statCards = [
    {
      icon: Package,
      label: "Tổng Sản phẩm",
      value: stats.totalProducts,
      color: "bg-blue-500",
      iconColor: "text-blue-500",
      link: "/admin/products" as const,
    },
    {
      icon: FolderTree,
      label: "Danh mục",
      value: stats.totalCategories,
      color: "bg-green-500",
      iconColor: "text-green-500",
      link: "/admin/categories" as const,
    },
    {
      icon: ShoppingCart,
      label: "Đơn hàng",
      value: stats.totalOrders,
      color: "bg-purple-500",
      iconColor: "text-purple-500",
      link: "/admin/orders" as const,
    },
    {
      icon: DollarSign,
      label: "Doanh thu",
      value: formatCurrency(stats.totalRevenue),
      color: "bg-orange-500",
      iconColor: "text-orange-500",
      link: undefined,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index}>
            {stat.link ? (
              <Link
                href={stat.link}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mã đơn</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tổng tiền</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">#{order.id}</td>
                  <td className="py-3 px-4 text-sm">{order.user_name}</td>
                  <td className="py-3 px-4 text-sm font-semibold">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sản phẩm bán chạy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topProducts.map((product: any, index: number) => (
            <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                {product.thumbnail_url ? (
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Đã bán: <span className="font-bold text-primary-600">{product.total_sold}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-left"
          >
            <Package className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Quản lý Sản phẩm</h3>
            <p className="text-sm text-gray-600">Thêm, sửa, xóa sản phẩm</p>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-left"
          >
            <ShoppingCart className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Quản lý Đơn hàng</h3>
            <p className="text-sm text-gray-600">Xem và cập nhật đơn hàng</p>
          </Link>

          <Link
            href="/admin/blogs"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-left"
          >
            <FileText className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Quản lý Blog</h3>
            <p className="text-sm text-gray-600">Viết và quản lý bài viết</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
