"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Star, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import ReviewSection from "@/components/ReviewSection";
import RelatedProducts from "@/components/RelatedProducts";
import ReturnPolicy from "@/components/ReturnPolicy";
import { formatPrice } from '@/lib/formatPrice';

interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  effective_price?: number;
  discount_percentage?: number;
  start_time?: string;
  end_time?: string;
  sku: string;
  stock_quantity: number;
  category_id: number;
  category_name?: string;
  thumbnail_url?: string;
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'policy'>('info');
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.data);
        } else {
          console.error("Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
      fetchReviewStats();
    }
  }, [params.id]);

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/product/${params.id}`);
      const data = await response.json();
      if (data.success && data.data.stats) {
        setReviewStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  useEffect(() => {
    // Kiểm tra sản phẩm có trong wishlist không
    const checkWishlist = async () => {
      if (!isAuthenticated || !product) return;
      
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:4000/api/wishlist/check/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setInWishlist(data.data.in_wishlist);
        }
      } catch (error) {
        console.error('Lỗi kiểm tra wishlist:', error);
      }
    };

    checkWishlist();
  }, [product, isAuthenticated]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!product) return;

    setTogglingWishlist(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = inWishlist
        ? `http://localhost:4000/api/wishlist/${product.id}`
        : 'http://localhost:4000/api/wishlist';
      
      const response = await fetch(url, {
        method: inWishlist ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: inWishlist ? undefined : JSON.stringify({ product_id: product.id }),
      });

      const data = await response.json();
      if (data.success) {
        setInWishlist(!inWishlist);
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi toggle wishlist:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
          <button
            onClick={() => router.push("/products")}
            className="text-primary-600 hover:text-primary-700"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.effective_price || product.price;
  const hasDiscount = product.effective_price && product.effective_price < product.price;
  const discountPercentage = product.discount_percentage || 0;

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [{ id: 0, image_url: "/images/products/placeholder.jpg", is_primary: true }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-primary-600">Trang chủ</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-primary-600">Sản phẩm</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage]?.image_url || productImages[0].image_url}
                  alt={productImages[selectedImage]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/products/placeholder.jpg";
                  }}
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/products/placeholder.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="text-primary-600 font-medium">{product.category_name || "Sản phẩm"}</span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Rating */}
                {reviewStats && reviewStats.total_reviews > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${
                            star <= Math.round(reviewStats.average_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({Number(reviewStats.average_rating || 0).toFixed(1)} - {reviewStats.total_reviews} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary-600">
                    {formatPrice(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-red-600 font-semibold">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm:</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Tình trạng:</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium">
                    Còn hàng ({product.stock_quantity} sản phẩm)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Hết hàng</span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div>
                  <label className="block font-medium text-gray-900 mb-2">Số lượng:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock_quantity) {
                          setQuantity(val);
                        }
                      }}
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg font-medium"
                      min="1"
                      max={product.stock_quantity}
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || addingToCart}
                  className="flex-1 bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                </button>
                <button
                  onClick={toggleWishlist}
                  disabled={togglingWishlist}
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'bg-red-50 border-red-500 text-red-500'
                      : 'border-gray-300 hover:border-primary-600 hover:text-primary-600'
                  } disabled:opacity-50`}
                  title={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Miễn phí vận chuyển</p>
                    <p className="text-xs text-gray-500">Đơn từ 500k</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bảo hành chính hãng</p>
                    <p className="text-xs text-gray-500">12 tháng</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Đổi trả dễ dàng</p>
                    <p className="text-xs text-gray-500">Trong 7 ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              <button 
                onClick={() => setActiveTab('info')}
                className={`pb-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'info'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Thông tin chi tiết
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Đánh giá ({reviewStats?.total_reviews || 0})
              </button>
              <button 
                onClick={() => setActiveTab('policy')}
                className={`pb-4 px-2 border-b-2 font-semibold transition-colors ${
                  activeTab === 'policy'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Chính sách đổi trả
              </button>
            </nav>
          </div>

          {/* Tab: Thông tin chi tiết */}
          {activeTab === 'info' && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin sản phẩm</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Danh mục:</span>
                    <span className="font-medium text-gray-900">{product.category_name || "Chưa phân loại"}</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Mã sản phẩm:</span>
                    <span className="font-medium text-gray-900">{product.sku}</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Tồn kho:</span>
                    <span className="font-medium text-gray-900">{product.stock_quantity} sản phẩm</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Thương hiệu:</span>
                    <span className="font-medium text-gray-900">Chính hãng</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Bảo hành:</span>
                    <span className="font-medium text-gray-900">12 tháng</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Xuất xứ:</span>
                    <span className="font-medium text-gray-900">Nhật Bản</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-40 text-gray-600">Đánh giá:</span>
                    <span className="font-medium text-gray-900">
                      {reviewStats && reviewStats.total_reviews > 0 
                        ? `${Number(reviewStats.average_rating || 0).toFixed(1)} ⭐ (${reviewStats.total_reviews} người)` 
                        : 'Chưa có đánh giá'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Mô tả chi tiết</h4>
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Chất liệu cao cấp, bền bỉ theo thời gian</li>
                  <li>Thiết kế hiện đại, tiện lợi sử dụng</li>
                  <li>Phù hợp cho cả người mới bắt đầu và chuyên nghiệp</li>
                  <li>Đạt tiêu chuẩn chất lượng quốc tế</li>
                  <li>Hỗ trợ kỹ thuật và bảo hành tận tâm</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Đánh giá */}
          {activeTab === 'reviews' && (
            <ReviewSection productId={product.id} />
          )}

          {/* Tab: Chính sách đổi trả */}
          {activeTab === 'policy' && (
            <ReturnPolicy />
          )}
        </div>

        {/* Related Products Section */}
        <RelatedProducts productId={product.id} categoryId={product.category_id} />
      </div>
    </div>
  );
}
