'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HelpCircle, ShoppingCart, Package, Users, Shield, Wrench } from 'lucide-react';

export default function SupportPage() {
  const [activeSection, setActiveSection] = useState<string>('help-center');

  useEffect(() => {
    // Get section from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      // Scroll to content
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const sections = [
    { id: 'help-center', title: 'Trung Tâm Trợ Giúp', icon: HelpCircle },
    { id: 'purchase-guide', title: 'Hướng Dẫn Mua Hàng', icon: ShoppingCart },
    { id: 'product-guide', title: 'Hướng Dẫn Chọn Sản Phẩm', icon: Package },
    { id: 'customer-care', title: 'Chăm Sóc Khách Hàng', icon: Users },
    { id: 'warranty-policy', title: 'Chính Sách Bảo Hành', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Hỗ Trợ Khách Hàng</h1>
              <p className="text-xl opacity-90">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeSection === section.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div id="content-section" className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Trung Tâm Trợ Giúp */}
            {activeSection === 'help-center' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Trung Tâm Trợ Giúp</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Câu Hỏi Thường Gặp</h3>
                    <div className="space-y-4">
                      <details className="bg-gray-50 rounded-lg p-4">
                        <summary className="font-medium text-gray-900 cursor-pointer">
                          Làm thế nào để đặt hàng trên website?
                        </summary>
                        <p className="mt-2 text-gray-600">
                          Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng, điền thông tin giao hàng và thanh toán. 
                          Hệ thống sẽ hướng dẫn bạn từng bước một cách chi tiết.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-lg p-4">
                        <summary className="font-medium text-gray-900 cursor-pointer">
                          Thời gian giao hàng là bao lâu?
                        </summary>
                        <p className="mt-2 text-gray-600">
                          Thời gian giao hàng từ 2-5 ngày tùy theo khu vực. Nội thành TP.HCM thường nhận hàng trong 1-2 ngày.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-lg p-4">
                        <summary className="font-medium text-gray-900 cursor-pointer">
                          Tôi có thể đổi trả hàng không?
                        </summary>
                        <p className="mt-2 text-gray-600">
                          Có, bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên tem, chưa qua sử dụng.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-lg p-4">
                        <summary className="font-medium text-gray-900 cursor-pointer">
                          Các hình thức thanh toán nào được chấp nhận?
                        </summary>
                        <p className="mt-2 text-gray-600">
                          Chúng tôi chấp nhận thanh toán COD, chuyển khoản ngân hàng, và ví điện tử.
                        </p>
                      </details>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Liên Hệ Hỗ Trợ</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-1">Hotline</p>
                        <p className="text-blue-600 text-lg font-semibold">0123 456 789</p>
                        <p className="text-sm text-gray-600 mt-1">Thứ 2 - Chủ Nhật: 8:00 - 22:00</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-1">Email</p>
                        <p className="text-green-600 text-lg font-semibold">support@canthushop.vn</p>
                        <p className="text-sm text-gray-600 mt-1">Phản hồi trong 24h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hướng Dẫn Mua Hàng */}
            {activeSection === 'purchase-guide' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hướng Dẫn Mua Hàng</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">1</span>
                      Tìm Kiếm Sản Phẩm
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Sử dụng thanh tìm kiếm hoặc duyệt qua danh mục sản phẩm để tìm những món đồ câu cá bạn cần.
                      Bạn có thể lọc theo giá, thương hiệu, hoặc loại sản phẩm.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">2</span>
                      Xem Chi Tiết Sản Phẩm
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Click vào sản phẩm để xem thông tin chi tiết, hình ảnh, mô tả, giá cả và đánh giá từ khách hàng khác.
                      Đọc kỹ thông số kỹ thuật để chọn sản phẩm phù hợp.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">3</span>
                      Thêm Vào Giỏ Hàng
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Chọn số lượng và nhấn &quot;Thêm vào giỏ hàng&quot;. Bạn có thể tiếp tục mua sắm hoặc vào giỏ hàng để thanh toán.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">4</span>
                      Điền Thông Tin Giao Hàng
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Nhập đầy đủ họ tên, số điện thoại, địa chỉ nhận hàng. Thông tin chính xác giúp giao hàng nhanh chóng.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">5</span>
                      Chọn Phương Thức Thanh Toán
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Chọn thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc ví điện tử. 
                      Mỗi phương thức đều an toàn và bảo mật.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">6</span>
                      Xác Nhận Đơn Hàng
                    </h3>
                    <p className="text-gray-600 ml-10">
                      Kiểm tra lại thông tin và nhấn &quot;Đặt hàng&quot;. Bạn sẽ nhận được email xác nhận và mã đơn hàng.
                      Theo dõi tình trạng đơn hàng qua tài khoản của bạn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hướng Dẫn Chọn Sản Phẩm */}
            {activeSection === 'product-guide' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hướng Dẫn Chọn Sản Phẩm</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chọn Cần Câu</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Chiều dài:</strong> Cần ngắn (1.8-2.1m) cho câu gần bờ, cần dài (3m+) cho câu xa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Độ cứng:</strong> Mềm cho cá nhỏ, cứng cho cá lớn</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Chất liệu:</strong> Carbon nhẹ bền, composite cân bằng, fiberglass giá rẻ</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chọn Máy Câu</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Spinning:</strong> Dễ sử dụng, phù hợp người mới</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Baitcasting:</strong> Chính xác hơn, cho người có kinh nghiệm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Tỉ số truyền:</strong> Cao để thu dây nhanh, thấp cho sức kéo mạnh</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chọn Dây Câu</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>PE:</strong> Bền, không co giãn, phù hợp câu xa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Nylon:</strong> Co giãn, hấp thụ lực tốt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span><strong>Fluorocarbon:</strong> Gần như vô hình dưới nước</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Lời Khuyên</h4>
                    <p className="text-gray-600">
                      Nếu bạn mới bắt đầu, hãy chọn bộ combo cần-máy phù hợp với ngân sách. 
                      Đội ngũ của chúng tôi luôn sẵn sàng tư vấn chi tiết qua hotline hoặc chat.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chăm Sóc Khách Hàng */}
            {activeSection === 'customer-care' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Chăm Sóc Khách Hàng</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Cam Kết Của Chúng Tôi</h3>
                    <p className="text-gray-600 mb-4">
                      Sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi cam kết:
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Sản phẩm chính hãng, chất lượng cao</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Tư vấn nhiệt tình, chuyên nghiệp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Giao hàng nhanh chóng, đúng hẹn</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Hỗ trợ sau bán hàng tận tâm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Giải quyết khiếu nại nhanh chóng</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Các Kênh Liên Hệ</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📞 Điện Thoại</h4>
                        <p className="text-gray-600 text-sm mb-1">Hotline: 0123 456 789</p>
                        <p className="text-gray-500 text-xs">Hỗ trợ 24/7</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">✉️ Email</h4>
                        <p className="text-gray-600 text-sm mb-1">support@canthushop.vn</p>
                        <p className="text-gray-500 text-xs">Phản hồi trong 24h</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">💬 Facebook</h4>
                        <p className="text-gray-600 text-sm mb-1">fb.com/canthushop</p>
                        <p className="text-gray-500 text-xs">Chat trực tuyến</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📱 Zalo</h4>
                        <p className="text-gray-600 text-sm mb-1">0987 654 321</p>
                        <p className="text-gray-500 text-xs">Chat nhanh chóng</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Chương Trình Khách Hàng Thân Thiết</h3>
                    <p className="text-gray-600 mb-3">
                      Tích điểm mỗi lần mua hàng và nhận ưu đãi:
                    </p>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                      <ul className="space-y-2 text-gray-700">
                        <li>🥉 <strong>Đồng:</strong> Giảm 5% cho đơn hàng tiếp theo</li>
                        <li>🥈 <strong>Bạc:</strong> Giảm 10% + Miễn phí vận chuyển</li>
                        <li>🥇 <strong>Vàng:</strong> Giảm 15% + Quà tặng đặc biệt</li>
                        <li>💎 <strong>Kim Cương:</strong> Giảm 20% + Ưu tiên hỗ trợ VIP</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chính Sách Bảo Hành */}
            {activeSection === 'warranty-policy' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Chính Sách Bảo Hành</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Điều Kiện Bảo Hành</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Sản phẩm còn trong thời hạn bảo hành (theo tem bảo hành)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Tem bảo hành còn nguyên vẹn, không rách, không tẩy xóa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Sản phẩm bị lỗi do nhà sản xuất</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Có hóa đơn mua hàng hoặc xác nhận đơn hàng</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Thời Gian Bảo Hành</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Cần Câu & Máy Câu</h4>
                        <p className="text-gray-600">Bảo hành 12 tháng</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Phụ Kiện</h4>
                        <p className="text-gray-600">Bảo hành 6 tháng</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Dây Câu & Mồi</h4>
                        <p className="text-gray-600">Đổi trả trong 30 ngày nếu lỗi</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Túi, Hộp Đựng</h4>
                        <p className="text-gray-600">Bảo hành 3 tháng</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Các Trường Hợp Không Bảo Hành</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Sản phẩm hết hạn bảo hành</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Hư hỏng do sử dụng sai cách, va đập mạnh</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Tự ý sửa chữa, thay đổi kết cấu sản phẩm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Tem bảo hành bị rách, mất, tẩy xóa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Hư hỏng do thiên tai, hỏa hoạn, ngập nước</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Quy Trình Bảo Hành</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <div>
                          <h4 className="font-medium text-gray-900">Liên Hệ</h4>
                          <p className="text-gray-600 text-sm">Gọi hotline hoặc mang sản phẩm đến cửa hàng</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <div>
                          <h4 className="font-medium text-gray-900">Kiểm Tra</h4>
                          <p className="text-gray-600 text-sm">Nhân viên kiểm tra sản phẩm và xác nhận bảo hành</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <div>
                          <h4 className="font-medium text-gray-900">Sửa Chữa/Đổi Mới</h4>
                          <p className="text-gray-600 text-sm">Sửa chữa hoặc đổi sản phẩm mới trong 7-14 ngày</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                        <div>
                          <h4 className="font-medium text-gray-900">Nhận Lại Sản Phẩm</h4>
                          <p className="text-gray-600 text-sm">Nhận sản phẩm đã bảo hành hoặc sản phẩm mới</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">⚠️ Lưu Ý Quan Trọng</h4>
                    <p className="text-gray-600 text-sm">
                      Để được hỗ trợ bảo hành nhanh chóng, vui lòng giữ lại hóa đơn mua hàng và 
                      không tự ý tháo rời, sửa chữa sản phẩm. Mọi thắc mắc xin liên hệ hotline: 0123 456 789.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
