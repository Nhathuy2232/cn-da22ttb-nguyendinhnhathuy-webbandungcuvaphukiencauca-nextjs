'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fish, Award, Users, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Cần Thủ Shop
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Điểm đến tin cậy của mọi người yêu câu cá
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Câu Chuyện Của Chúng Tôi
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <strong>Cần Thủ Shop</strong> được thành lập với niềm đam mê câu cá và mong muốn
                    mang đến cho cộng đồng những sản phẩm câu cá chất lượng cao với giá cả hợp lý.
                  </p>
                  <p>
                    Chúng tôi hiểu rằng câu cá không chỉ là một môn thể thao, mà còn là niềm vui,
                    sở thích và đam mê của hàng triệu người. Vì vậy, chúng tôi cam kết cung cấp
                    đầy đủ các sản phẩm từ cần câu, máy câu, mồi câu đến phụ kiện câu cá với
                    chất lượng tốt nhất.
                  </p>
                  <p>
                    Với đội ngũ nhân viên là những người yêu thích câu cá, chúng tôi luôn sẵn sàng
                    tư vấn và chia sẻ kinh nghiệm để giúp bạn có những chuyến câu thành công và
                    đáng nhớ.
                  </p>
                </div>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/banners/fishing-store.jpg"
                  alt="Cửa hàng Cần Thủ Shop"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.className += ' bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center';
                    const div = document.createElement('div');
                    div.className = 'text-white text-center p-8';
                    div.innerHTML = '<Fish class="w-24 h-24 mx-auto mb-4 opacity-50" /><p class="text-xl">Cần Thủ Shop</p>';
                    target.parentElement!.appendChild(div);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chất Lượng Hàng Đầu
                </h3>
                <p className="text-gray-600">
                  Tất cả sản phẩm đều được chọn lọc kỹ càng từ các thương hiệu uy tín,
                  đảm bảo chất lượng và độ bền cao.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tư Vấn Chuyên Nghiệp
                </h3>
                <p className="text-gray-600">
                  Đội ngũ nhân viên giàu kinh nghiệm sẵn sàng tư vấn và hỗ trợ bạn
                  chọn được sản phẩm phù hợp nhất.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Fish className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Đam Mê Câu Cá
                </h3>
                <p className="text-gray-600">
                  Chúng tôi không chỉ bán hàng, mà còn chia sẻ niềm đam mê và
                  kinh nghiệm câu cá với cộng đồng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
                <div className="text-blue-100">Năm Kinh Nghiệm</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Khách Hàng Hài Lòng</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1,000+</div>
                <div className="text-blue-100">Sản Phẩm</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Hỗ Trợ Khách Hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Thông Tin Liên Hệ
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Địa Chỉ</h3>
                      <p className="text-gray-600">
                        123 Đường Nguyễn Văn Linh, Quận 7<br />
                        TP. Hồ Chí Minh, Việt Nam
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Điện Thoại</h3>
                      <p className="text-gray-600">
                        Hotline: 0123 456 789<br />
                        Zalo/Viber: 0987 654 321
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600">
                        info@canthushop.vn<br />
                        support@canthushop.vn
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Giờ Mở Cửa</h3>
                      <p className="text-gray-600">
                        Thứ 2 - Thứ 7: 8:00 - 20:00<br />
                        Chủ Nhật: 9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Google Maps */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Vị Trí Cửa Hàng</h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3735.66677070706!2d106.34394437479253!3d9.923451590178079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0175ea296facb%3A0x55ded92e29068221!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBUcsOgIFZpbmg!5e1!3m2!1svi!2s!4v1766731466417!5m2!1svi!2s" 
                    width="100%" 
                    height="500" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sẵn Sàng Cho Chuyến Câu Tiếp Theo?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Khám phá bộ sưu tập sản phẩm câu cá chất lượng cao của chúng tôi
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem Sản Phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
