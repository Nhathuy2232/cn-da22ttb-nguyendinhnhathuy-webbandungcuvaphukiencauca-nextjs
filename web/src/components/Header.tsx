"use client";

import { ShoppingCart, Search, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartItemsCount = cart?.items?.length || 0;
  
  return (
    <header className="bg-primary-600 text-white shadow-md">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8 py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logos/Logo2.png"
                alt="Cần Thủ Shop"
                width={62}
                height={62}
                className="w-[62px] h-[62px] rounded-full object-contain"
                priority
              />
              <span className="text-2xl font-bold">Cần Thủ Shop</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm cần câu, máy câu, mồi câu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded px-4 py-2.5 pr-12 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full bg-orange-500 px-5 hover:bg-orange-600 rounded-r transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white hover:text-orange-300 transition-colors font-medium">
              Trang chủ
            </Link>
            <Link href="/products" className="text-white hover:text-orange-300 transition-colors font-medium">
              Sản phẩm
            </Link>
            <Link href={"/about" as any} className="text-white hover:text-orange-300 transition-colors font-medium">
              Giới thiệu
            </Link>
            <Link href="/blogs" className="text-white hover:text-orange-300 transition-colors font-medium">
              Blog
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="text-orange-300 hover:text-white transition-colors font-bold border border-orange-300 px-3 py-1 rounded">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href={"/cart" as any} className="hover:text-orange-100 transition-colors">
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-primary-600 font-semibold">
                  {cartItemsCount}
                </span>
              </div>
            </Link>
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link href={"/profile" as any} className="hover:text-orange-100 transition-colors flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{user.fullName || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-orange-100 transition-colors flex items-center gap-2"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-orange-100 transition-colors text-sm whitespace-nowrap">
                  Đăng nhập
                </Link>
                <Link href="/register" className="hover:text-orange-100 transition-colors text-sm whitespace-nowrap">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
