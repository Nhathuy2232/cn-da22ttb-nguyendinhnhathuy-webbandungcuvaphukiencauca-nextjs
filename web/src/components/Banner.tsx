"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    image: "images/banners/Daiwa.jpg",
    alt: "Cần câu cao cấp"
  },
  {
    id: 2,
    image: "images/banners/maycau.jpeg",
    alt: "Máy câu chính hãng"
  },
  {
    id: 3,
    image: "images/banners/cancau.jpg",
    alt: "Phụ kiện câu cá"
  }
];

const smallBanners = [
  "/images/banners/small-banner-1.jpg",
  "/images/banners/small-banner-2.jpg"
];

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="relative group overflow-hidden rounded-lg shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-[300px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Chỉ số chấm trang */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
