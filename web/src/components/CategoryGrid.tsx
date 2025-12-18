'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Fish, 
  Waves, 
  Anchor, 
  Compass, 
  Ship,
  Settings,
  Package,
  Zap,
  Target,
  Scissors,
  Box,
  Boxes,
  Shirt,
  Backpack,
  Sun,
  Wind
} from "lucide-react";

// Danh sách danh mục mặc định với icon
const defaultCategories = [
  { icon: Fish, name: "Cần Câu", color: "#ee4d2d", href: "" },
  { icon: Waves, name: "Máy Câu", color: "#f05d40", href: "" },
  { icon: Anchor, name: "Dây Cước", color: "#1e9d74", href: "" },
  { icon: Compass, name: "Lưỡi Câu", color: "#0088ff", href: "" },
  { icon: Ship, name: "Mồi Câu", color: "#f69113", href: "" },
  { icon: Settings, name: "Phụ Kiện Cần", color: "#c61a1f", href: "#" },
  { icon: Package, name: "Hộp Đựng Đồ", color: "#0cb35b", href: "#" },
  { icon: Zap, name: "Máy Nổi Câu", color: "#8b37c9", href: "#" },
  { icon: Target, name: "Chì Câu", color: "#ee4d2d", href: "#" },
  { icon: Scissors, name: "Kéo & Dao", color: "#0088ff", href: "#" },
  { icon: Box, name: "Giỏ Đựng Cá", color: "#f05d40", href: "#" },
  { icon: Boxes, name: "Túi Đồ Nghề", color: "#1e9d74", href: "#" },
  { icon: Shirt, name: "Quần Áo Câu", color: "#f69113", href: "#" },
  { icon: Backpack, name: "Balo & Túi", color: "#c61a1f", href: "#" },
  { icon: Sun, name: "Mũ & Kính", color: "#0cb35b", href: "#" },
  { icon: Wind, name: "Dụng Cụ Khác", color: "#8b37c9", href: "#" }
];

interface Category {
  id: number;
  name: string;
  description?: string;
}

export function CategoryGrid() {
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setDbCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Map tên danh mục từ database với href
  const getCategoryHref = (categoryName: string): string => {
    const dbCategory = dbCategories.find(c => c.name === categoryName || c.name.includes(categoryName.split(' ')[0]));
    return dbCategory ? `/products?category=${dbCategory.id}` : "#";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-center text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-gray-700 font-semibold text-lg mb-4">Danh Mục Sản Phẩm</h2>
        <div className="grid grid-cols-8 gap-4">
          {defaultCategories.map((category, index) => {
            const Icon = category.icon;
            const href = getCategoryHref(category.name);
            
            return (
              <Link
                key={index}
                href={href as any}
                className="flex flex-col items-center gap-3 p-4 hover:shadow-lg hover:scale-105 transition-all rounded-lg border border-gray-100 group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                  <Icon 
                    className="w-8 h-8 group-hover:scale-110 transition-transform" 
                    style={{ color: category.color }}
                  />
                </div>
                <span className="text-xs text-center text-gray-700 line-clamp-2 font-medium">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
