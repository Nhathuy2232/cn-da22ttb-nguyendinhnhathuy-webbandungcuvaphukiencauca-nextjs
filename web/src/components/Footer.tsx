import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Nội dung chính của Footer */}
        <div className="grid grid-cols-5 gap-8 pb-8 border-b border-gray-200">
          {/* Dịch vụ khách hàng */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              CHĂM SÓC KHÁCH HÀNG
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary-600">Trung Tâm Trợ Giúp</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Hướng Dẫn Mua Hàng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Hướng Dẫn Chọn Sản Phẩm</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Thanh Toán</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Vận Chuyển</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Trả Hàng & Hoàn Tiền</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Chăm Sóc Khách Hàng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Chính Sách Bảo Hành</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Bảo Quản Dụng Cụ</Link></li>
            </ul>
          </div>

          {/* Giới thiệu */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              VỀ CHÚNG TÔI
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary-600">Giới Thiệu Cửa Hàng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Tuyển Dụng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Điều Khoản Sử Dụng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Chính Sách Bảo Mật</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Sản Phẩm Chính Hãng</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Kênh Đại Lý</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Khuyến Mãi</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Blog Câu Cá</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Thanh toán */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              THANH TOÁN
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8" alt="COD" className="w-full" />
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16" alt="Credit" className="w-full" />
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08" alt="ATM" className="w-full" />
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/bc2a874caeee705449c164be385b796c" alt="Shopee Pay" className="w-full" />
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/2c46b83d84111ddc32cfd3b5995d9281" alt="Installment" className="w-full" />
              </div>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="https://down-vn.img.susercontent.com/file/5e3f0bee86058637ff23cfdf2e14ca09" alt="SPayLater" className="w-full" />
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase mt-6">
              ĐƠN VỊ VẬN CHUYỂN
            </h3>
              <div className="bg-white border border-gray-200 rounded p-1">
                <img src="images/products/Ghn.jpg" alt="GHN" className="w-full" />
              </div>
              
          
          </div>

          {/* Theo dõi chúng tôi */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              THEO DÕI CHÚNG TÔI TRÊN
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="https://www.facebook.com/profile.php?id=61571178752304" className="flex items-center gap-2 hover:text-primary-600">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-primary-600">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-primary-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  TikTok
                </Link>
              </li>
            </ul>
          </div>

          {/* Tải ứng dụng */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="bg-white border border-gray-200 rounded p-2 w-20 h-20">
                  <img src="images/products/qr_facebook.jpg" alt="QR Code" className="w-full h-full" />
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Phần cuối Footer */}
        <div className="pt-6 text-center text-xs text-gray-500">
          <p className="mb-4">
            © 2024 Cần Thủ Shop. Tất cả các quyền được bảo lưu.
          </p>
          <p className="mb-2">
            Chuyên cung cấp dụng cụ & phụ kiện câu cá chất lượng cao cho cần thủ Việt Nam
          </p>
          <div className="flex justify-center items-center gap-4 text-gray-400">
            <span>CHÍNH SÁCH BẢO MẬT</span>
            <span>|</span>
            <span>QUY CHẾ HOẠT ĐỘNG</span>
            <span>|</span>
            <span>CHÍNH SÁCH VẬN CHUYỂN</span>
            <span>|</span>
            <span>CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
