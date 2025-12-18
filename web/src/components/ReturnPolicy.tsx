export default function ReturnPolicy() {
  return (
    <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Chính sách đổi trả</h2>

      <div className="space-y-6">
        {/* Điều kiện đổi trả */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-blue-600">✓</span>
            Điều kiện đổi trả
          </h3>
          <ul className="space-y-2 text-gray-700 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Còn đầy đủ hộp, phụ kiện đi kèm</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Có hóa đơn mua hàng từ Fishing Shop</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Không bị trầy xước, hư hỏng do người dùng</span>
            </li>
          </ul>
        </div>

        {/* Thời gian đổi trả */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-green-600">⏰</span>
            Thời gian đổi trả
          </h3>
          <ul className="space-y-2 text-gray-700 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Đổi hàng:</strong> Trong vòng 7 ngày kể từ ngày nhận hàng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Trả hàng hoàn tiền:</strong> Trong vòng 3 ngày kể từ ngày nhận hàng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Sản phẩm lỗi do nhà sản xuất:</strong> Đổi trả trong vòng 30 ngày</span>
            </li>
          </ul>
        </div>

        {/* Quy trình đổi trả */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-purple-600">📋</span>
            Quy trình đổi trả
          </h3>
          <div className="space-y-3 ml-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Liên hệ với chúng tôi</p>
                <p className="text-sm text-gray-600">
                  Gọi hotline 1900-xxxx hoặc gửi email về support@fishingshop.vn
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Gửi sản phẩm về shop</p>
                <p className="text-sm text-gray-600">
                  Đóng gói cẩn thận và gửi qua đơn vị vận chuyển
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Kiểm tra sản phẩm</p>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ kiểm tra và xác nhận trong vòng 1-2 ngày làm việc
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <p className="font-medium">Đổi hàng hoặc hoàn tiền</p>
                <p className="text-sm text-gray-600">
                  Gửi sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chi phí đổi trả */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-orange-600">💰</span>
            Chi phí đổi trả
          </h3>
          <ul className="space-y-2 text-gray-700 ml-6">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span><strong>Lỗi do nhà sản xuất:</strong> Fishing Shop chịu toàn bộ chi phí</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span><strong>Đổi size/màu:</strong> Khách hàng chịu phí vận chuyển 2 chiều</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 mt-1">•</span>
              <span><strong>Đổi ý không muốn mua:</strong> Khách hàng chịu phí vận chuyển + 10% phí xử lý</span>
            </li>
          </ul>
        </div>

        {/* Lưu ý */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span>⚠️</span>
            Lưu ý quan trọng
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Không áp dụng đổi trả với sản phẩm đang khuyến mãi/giảm giá sâu</li>
            <li>• Sản phẩm đã qua sử dụng hoặc hư hỏng do người dùng sẽ không được đổi trả</li>
            <li>• Vui lòng quay video mở hộp để làm bằng chứng khi sản phẩm có vấn đề</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Cần hỗ trợ?</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p>📞 Hotline: <strong className="text-blue-600">1900-xxxx</strong> (8:00 - 21:00)</p>
            <p>✉️ Email: <strong className="text-blue-600">support@fishingshop.vn</strong></p>
            <p>📍 Địa chỉ: Trà Vinh, Phường 6, Thành phố Trà Vinh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
