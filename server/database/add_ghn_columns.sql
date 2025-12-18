-- ============================================
-- THÊM CÁC CỘT GHN VÀO BẢNG ORDERS
-- Chạy file này trong phpMyAdmin hoặc MySQL client
-- ============================================

USE fishing_shop;

-- Thêm các cột GHN vào bảng orders
ALTER TABLE orders 
  ADD COLUMN shipping_fee DECIMAL(12,2) DEFAULT 0 COMMENT 'Phí vận chuyển',
  ADD COLUMN ghn_order_code VARCHAR(50) COMMENT 'Mã đơn hàng GHN',
  ADD COLUMN recipient_name VARCHAR(120) COMMENT 'Tên người nhận',
  ADD COLUMN recipient_phone VARCHAR(20) COMMENT 'SĐT người nhận',
  ADD COLUMN recipient_address TEXT COMMENT 'Địa chỉ chi tiết',
  ADD COLUMN province_id INT COMMENT 'ID tỉnh/thành GHN',
  ADD COLUMN district_id INT COMMENT 'ID quận/huyện GHN',
  ADD COLUMN ward_code VARCHAR(20) COMMENT 'Mã phường/xã GHN';

-- Kiểm tra kết quả
DESCRIBE orders;
