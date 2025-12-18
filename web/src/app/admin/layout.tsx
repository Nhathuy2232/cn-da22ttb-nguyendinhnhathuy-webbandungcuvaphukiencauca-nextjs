"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Tag,
  FileText,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Package, label: "Quản lý Sản phẩm", href: "/admin/products" },
    { icon: FolderTree, label: "Quản lý Danh mục", href: "/admin/categories" },
    { icon: ShoppingCart, label: "Quản lý Đơn hàng", href: "/admin/orders" },
    { icon: Tag, label: "Quản lý Mã giảm giá", href: "/admin/coupons" },
    { icon: FileText, label: "Quản lý Blog", href: "/admin/blogs" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">Fishing Shop</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors mb-1"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
