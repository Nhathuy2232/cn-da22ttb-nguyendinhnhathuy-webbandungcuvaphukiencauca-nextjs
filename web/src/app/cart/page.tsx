'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Trash2, Plus, Minus, Package, MapPin, DollarSign, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/formatPrice';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_thumbnail: string;
  stock_quantity: number;
}

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

interface ShippingFee {
  total: number;
  service_fee: number;
  insurance_fee: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Shipping info
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<number>(0);
  const [selectedDistrict, setSelectedDistrict] = useState<number>(0);
  const [selectedWard, setSelectedWard] = useState<string>('');
  
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [note, setNote] = useState('');
  
  const [shippingFee, setShippingFee] = useState<ShippingFee | null>(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'e_wallet'>('cod');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/cart');
        return;
      }
      fetchCart();
      fetchProvinces();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedProvince > 0) {
      fetchDistricts(selectedProvince);
      setSelectedDistrict(0);
      setSelectedWard('');
      setShippingFee(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict > 0) {
      fetchWards(selectedDistrict);
      setSelectedWard('');
      setShippingFee(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict > 0 && selectedWard && cartItems.length > 0) {
      calculateShippingFee();
    }
  }, [selectedDistrict, selectedWard, cartItems]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:4000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.data?.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/shipping/provinces');
      if (response.ok) {
        const data = await response.json();
        setProvinces(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/shipping/districts/${provinceId}`);
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/shipping/wards/${districtId}`);
      if (response.ok) {
        const data = await response.json();
        setWards(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const calculateShippingFee = async () => {
    console.log('🚚 Bắt đầu tính phí vận chuyển...');
    console.log('- selectedDistrict:', selectedDistrict);
    console.log('- selectedWard:', selectedWard);
    console.log('- cartItems.length:', cartItems.length);

    setCalculatingFee(true);
    try {
      // Tính tổng trọng lượng (giả định mỗi sản phẩm 500g)
      const totalWeight = cartItems.reduce((sum, item) => sum + (item.quantity * 500), 0);
      const totalValue = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

      console.log('- totalWeight:', totalWeight);
      console.log('- totalValue:', totalValue);

      const requestBody = {
        toDistrictId: selectedDistrict,
        toWardCode: selectedWard,
        weight: totalWeight,
        insuranceValue: totalValue,
      };

      console.log('📤 Sending request:', requestBody);

      const response = await fetch('http://localhost:4000/api/shipping/calculate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Response data:', data);
        if (data.success && data.data) {
          setShippingFee(data.data);
          console.log('✅ Tính phí thành công:', data.data.total);
        } else {
          console.error('❌ Lỗi tính phí vận chuyển:', data.message);
          alert('Không thể tính phí vận chuyển: ' + (data.message || 'Lỗi không xác định'));
          setShippingFee(null);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Lỗi tính phí vận chuyển:', errorData.message || 'Không thể tính phí');
        alert('Không thể tính phí vận chuyển: ' + (errorData.message || 'Vui lòng kiểm tra lại thông tin địa chỉ'));
        setShippingFee(null);
      }
    } catch (error) {
      console.error('❌ Error calculating shipping fee:', error);
      alert('Lỗi kết nối: ' + error);
    } finally {
      setCalculatingFee(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:4000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (!recipientName) {
      alert('Vui lòng nhập họ và tên người nhận');
      return;
    }
    if (!recipientPhone) {
      alert('Vui lòng nhập số điện thoại người nhận');
      return;
    }
    if (!selectedProvince) {
      alert('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }
    if (!selectedDistrict) {
      alert('Vui lòng chọn Quận/Huyện');
      return;
    }
    if (!selectedWard) {
      alert('Vui lòng chọn Phường/Xã');
      return;
    }
    if (!recipientAddress) {
      alert('Vui lòng nhập địa chỉ cụ thể');
      return;
    }
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setProcessingOrder(true);
    try {
      const token = localStorage.getItem('accessToken');
      // Lấy userId từ user context nếu có
      const userId = user?.id;
      if (!userId) {
        alert('Không xác định được người dùng. Vui lòng đăng nhập lại.');
        setProcessingOrder(false);
        return;
      }
      // Tạo đơn hàng giống test-order-ghn.js
      const orderData = {
        userId: userId,
        payment_method: paymentMethod, // SỬA ĐÚNG KEY
        note: note,
        shipping_info: {
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          address: recipientAddress,
          province_id: selectedProvince,
          district_id: selectedDistrict,
          ward_code: selectedWard,
        },
        shipping_fee: shippingFee?.total || 0,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_price,
        })),
      };
      const orderResponse = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        if (orderData.success) {
          alert('Đặt hàng thành công! Mã đơn hàng: ' + orderData.data.id);
          // Xóa giỏ hàng sau khi đặt hàng thành công
          await fetch('http://localhost:4000/api/cart', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          router.push('/');
        } else {
          alert('Lỗi: ' + (orderData.message || 'Không thể tạo đơn hàng'));
        }
      } else {
        const errorData = await orderResponse.json().catch(() => ({}));
        alert('Lỗi: ' + (errorData.message || 'Không thể tạo đơn hàng'));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setProcessingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  const total = subtotal + (shippingFee?.total || 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product_thumbnail || '/images/products/placeholder.jpg'}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.product_name}</h3>
                      <p className="text-blue-600 font-bold text-xl mb-4">
                        {formatPrice(item.product_price)}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                            disabled={item.quantity >= item.stock_quantity}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping & Checkout */}
            <div className="space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Thông tin giao hàng
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0901234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>Chọn Tỉnh/Thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.ProvinceID} value={province.ProvinceID}>
                          {province.ProvinceName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedProvince}
                    >
                      <option value={0}>Chọn Quận/Huyện</option>
                      {districts.map((district) => (
                        <option key={district.DistrictID} value={district.DistrictID}>
                          {district.DistrictName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedDistrict}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>

                  {/* Nút tính phí vận chuyển */}
                  {selectedDistrict > 0 && selectedWard && (
                    <div>
                      <button
                        type="button"
                        onClick={calculateShippingFee}
                        disabled={calculatingFee}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
                      >
                        <Truck className="w-5 h-5" />
                        {calculatingFee ? 'Đang tính phí...' : 'Tính phí vận chuyển'}
                      </button>
                      {shippingFee && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-medium">
                            ✅ Phí vận chuyển: {formatPrice(shippingFee.total)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức thanh toán
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">💵 Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </label>
                      
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                        <input
                          type="radio"
                          name="payment_method"
                          value="bank_transfer"
                          disabled
                          className="w-4 h-4 text-gray-400"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-500">🏦 Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-400">Tính năng đang phát triển</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                        <input
                          type="radio"
                          name="payment_method"
                          value="e_wallet"
                          disabled
                          className="w-4 h-4 text-gray-400"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-500">📱 Ví điện tử</div>
                          <div className="text-sm text-gray-400">Tính năng đang phát triển</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Tổng cộng
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Phí vận chuyển
                    </span>
                    <span>
                      {calculatingFee ? (
                        <span className="text-sm">Đang tính...</span>
                      ) : shippingFee ? (
                        formatPrice(shippingFee.total)
                      ) : (
                        <span className="text-sm text-gray-400">Chọn địa chỉ</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!shippingFee || processingOrder || !recipientName || !recipientPhone || !recipientAddress}
                  className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                >
                  {processingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
