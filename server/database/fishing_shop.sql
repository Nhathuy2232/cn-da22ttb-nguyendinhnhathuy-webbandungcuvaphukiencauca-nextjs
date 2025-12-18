-- ============================================
-- FISHING SHOP - DATABASE SETUP COMPLETE
-- Tạo database hoàn chỉnh với tất cả bảng và dữ liệu mẫu
-- Version: 1.0
-- Date: 2025-12-04
-- ============================================

-- Xóa database cũ nếu tồn tại và tạo mới
DROP DATABASE IF EXISTS fishing_shop;
CREATE DATABASE fishing_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fishing_shop;

-- ============================================
-- BẢNG NGƯỜI DÙNG (USERS)
-- ============================================
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID người dùng',
  full_name VARCHAR(120) NOT NULL COMMENT 'Họ và tên',
  email VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email đăng nhập',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò: khách hàng hoặc quản trị viên',
  phone VARCHAR(20) COMMENT 'Số điện thoại',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng người dùng';

-- ============================================
-- BẢNG DANH MỤC SẢN PHẨM (CATEGORIES)
-- ============================================
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID danh mục',
  name VARCHAR(120) NOT NULL UNIQUE COMMENT 'Tên danh mục',
  description TEXT COMMENT 'Mô tả danh mục',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh mục sản phẩm';

-- ============================================
-- BẢNG SẢN PHẨM (PRODUCTS)
-- ============================================
CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID sản phẩm',
  category_id INT UNSIGNED COMMENT 'ID danh mục',
  name VARCHAR(200) NOT NULL COMMENT 'Tên sản phẩm',
  description TEXT COMMENT 'Mô tả chi tiết',
  price DECIMAL(12, 2) NOT NULL COMMENT 'Giá bán (VNĐ)',
  sku VARCHAR(80) NOT NULL UNIQUE COMMENT 'Mã SKU sản phẩm',
  stock_quantity INT NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho',
  thumbnail_url VARCHAR(255) COMMENT 'URL ảnh đại diện',
  status ENUM('draft', 'active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái: nháp, đang bán, ngừng bán',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng sản phẩm';

-- ============================================
-- BẢNG HÌNH ẢNH SẢN PHẨM (PRODUCT_IMAGES)
-- ============================================
CREATE TABLE product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID hình ảnh',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  image_url VARCHAR(255) NOT NULL COMMENT 'URL hình ảnh',
  alt_text VARCHAR(120) COMMENT 'Mô tả ảnh (alt text)',
  is_primary TINYINT(1) DEFAULT 0 COMMENT 'Là ảnh chính (1) hay không (0)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  CONSTRAINT fk_images_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng hình ảnh sản phẩm';

-- ============================================
-- BẢNG ĐỊA CHỈ GIAO HÀNG (ADDRESSES)
-- ============================================
CREATE TABLE addresses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID địa chỉ',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  label VARCHAR(60) NOT NULL COMMENT 'Nhãn địa chỉ (ví dụ: Nhà riêng, Công ty)',
  full_name VARCHAR(120) NOT NULL COMMENT 'Họ tên người nhận',
  phone VARCHAR(20) NOT NULL COMMENT 'Số điện thoại',
  address_line TEXT NOT NULL COMMENT 'Địa chỉ chi tiết',
  province VARCHAR(80) NOT NULL COMMENT 'Tỉnh/Thành phố',
  district VARCHAR(80) NOT NULL COMMENT 'Quận/Huyện',
  ward VARCHAR(80) NOT NULL COMMENT 'Phường/Xã',
  is_default TINYINT(1) DEFAULT 0 COMMENT 'Địa chỉ mặc định (1) hay không (0)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng địa chỉ giao hàng';

-- ============================================
-- BẢNG GIỎ HÀNG (CARTS)
-- ============================================
CREATE TABLE carts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID giỏ hàng',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng giỏ hàng';

-- ============================================
-- BẢNG CHI TIẾT GIỎ HÀNG (CART_ITEMS)
-- ============================================
CREATE TABLE cart_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID chi tiết giỏ hàng',
  cart_id INT UNSIGNED NOT NULL COMMENT 'ID giỏ hàng',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  quantity INT NOT NULL DEFAULT 1 COMMENT 'Số lượng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  UNIQUE KEY uniq_cart_product (cart_id, product_id),
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id)
    REFERENCES carts (id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết giỏ hàng';

-- ============================================
-- BẢNG ĐƠN HÀNG (ORDERS)
-- ============================================
CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID đơn hàng',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  address_id INT UNSIGNED NOT NULL COMMENT 'ID địa chỉ giao hàng',
  status ENUM('pending','paid','shipped','completed','cancelled') DEFAULT 'pending' COMMENT 'Trạng thái: chờ xử lý, đã thanh toán, đã giao hàng, hoàn thành, đã hủy',
  payment_method ENUM('cod','bank_transfer','e_wallet') DEFAULT 'cod' COMMENT 'Phương thức thanh toán: COD, chuyển khoản, ví điện tử',
  total_amount DECIMAL(12, 2) NOT NULL COMMENT 'Tổng tiền (VNĐ)',
  note TEXT COMMENT 'Ghi chú đơn hàng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id)
    REFERENCES addresses (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng đơn hàng';

-- ============================================
-- BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
-- ============================================
CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID chi tiết đơn hàng',
  order_id INT UNSIGNED NOT NULL COMMENT 'ID đơn hàng',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  quantity INT NOT NULL COMMENT 'Số lượng',
  price DECIMAL(12, 2) NOT NULL COMMENT 'Giá tại thời điểm đặt hàng (VNĐ)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
    REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết đơn hàng';

-- ============================================
-- BẢNG TOKEN LÀM MỚI (REFRESH_TOKENS)
-- ============================================
CREATE TABLE refresh_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID token',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  token VARCHAR(255) NOT NULL COMMENT 'Token làm mới',
  expires_at DATETIME NOT NULL COMMENT 'Thời gian hết hạn',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng token làm mới phiên đăng nhập';

-- ============================================
-- BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITY_LOGS)
-- ============================================
CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID bản ghi',
  user_id INT UNSIGNED COMMENT 'ID người dùng (NULL nếu là hệ thống)',
  action VARCHAR(120) NOT NULL COMMENT 'Hành động (ví dụ: login, create_order, update_product)',
  metadata JSON COMMENT 'Dữ liệu bổ sung dạng JSON',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  INDEX idx_logs_user (user_id),
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng nhật ký hoạt động người dùng và hệ thống';

-- ============================================
-- BẢNG MÃ GIẢM GIÁ (COUPONS)
-- ============================================
CREATE TABLE coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID mã giảm giá',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giảm giá',
  description TEXT COMMENT 'Mô tả khuyến mãi',
  discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage' COMMENT 'Loại giảm: phần trăm hoặc cố định',
  discount_value DECIMAL(10,2) NOT NULL COMMENT 'Giá trị giảm',
  min_order_value DECIMAL(10,2) DEFAULT 0 COMMENT 'Giá trị đơn hàng tối thiểu',
  max_discount DECIMAL(10,2) COMMENT 'Giảm tối đa (cho % discount)',
  usage_limit INT COMMENT 'Số lần sử dụng tối đa',
  used_count INT DEFAULT 0 COMMENT 'Số lần đã sử dụng',
  start_date DATETIME NOT NULL COMMENT 'Ngày bắt đầu',
  end_date DATETIME NOT NULL COMMENT 'Ngày kết thúc',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái kích hoạt',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng mã giảm giá';

-- ============================================
-- BẢNG BLOG (BLOGS)
-- ============================================
CREATE TABLE blogs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID blog',
  title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề bài viết',
  slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL slug',
  excerpt TEXT COMMENT 'Tóm tắt ngắn',
  content LONGTEXT NOT NULL COMMENT 'Nội dung đầy đủ',
  thumbnail VARCHAR(500) COMMENT 'Ảnh đại diện',
  author_id INT UNSIGNED COMMENT 'ID người viết',
  category VARCHAR(100) COMMENT 'Danh mục blog',
  tags JSON COMMENT 'Các tag',
  view_count INT DEFAULT 0 COMMENT 'Số lượt xem',
  is_published BOOLEAN DEFAULT FALSE COMMENT 'Đã xuất bản',
  published_at DATETIME COMMENT 'Thời gian xuất bản',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng blog';

-- ============================================
-- DỮ LIỆU MẪU - DANH MỤC
-- ============================================
INSERT INTO categories (name, description) VALUES
('Cần Câu', 'Các loại cần câu carbon, composite'),
('Máy Câu', 'Máy câu cá các loại spinning, baitcasting'),
('Dây Cước', 'Dây câu PE, Carbon, Nylon'),
('Lưỡi Câu', 'Móc câu các size và loại'),
('Mồi Câu', 'Mồi giả, mồi sống'),
('Phụ Kiện', 'Túi đựng, hộp đồ nghề, găng tay');

-- ============================================
-- DỮ LIỆU MẪU - NGƯỜI DÙNG
-- ============================================
-- Password mặc định cho tất cả: admin123
-- Hash: $2b$10$EKourMjlxZhgXt5XDjF47.9FVqlmryxqvsSojaaMQulAWuRV/NtSi
INSERT INTO users (full_name, email, password_hash, role, phone) VALUES
('Admin', 'admin@fishing-shop.com', '$2b$10$EKourMjlxZhgXt5XDjF47.9FVqlmryxqvsSojaaMQulAWuRV/NtSi', 'admin', '0123456789'),
('Nguyễn Văn A', 'user@example.com', '$2b$10$EKourMjlxZhgXt5XDjF47.9FVqlmryxqvsSojaaMQulAWuRV/NtSi', 'customer', '0987654321');

-- ============================================
-- DỮ LIỆU MẪU - SẢN PHẨM
-- ============================================
INSERT INTO products (category_id, name, description, price, sku, stock_quantity, thumbnail_url, status) VALUES
(1, 'Cần Câu Carbon Pro 2.1m', 'Cần câu carbon cao cấp chuyên dụng cho câu lure và bơi câu. Thân cần được làm từ carbon tổng hợp chất lượng cao, độ bền vượt trội, trọng lượng nhẹ chỉ 185g. Khoen cần sử dụng công nghệ Fuji chống mài mòn tốt, khả năng chịu lực tối đa 8kg. Chiều dài 2.1m cho độ ném xa hiệu quả. Phù hợp cho câu cá tầng giữa và tầng mặt như cá rô, cá lóc, cá trắm. Tay cầm EVA chống trượt, êm tay khi sử dụng lâu dài. Bảo hành chính hãng 12 tháng.', 1500000, 'CC-PRO-21', 50, '/images/products/can-cau-carbon-pro.jpg', 'active'),

(1, 'Cần Câu Daiwa Legalis 1.8m', 'Cần câu Daiwa Legalis nhập khẩu chính hãng từ Nhật Bản. Thiết kế 2 khúc rời tiện lợi cho việc di chuyển và bảo quản. Thân cần carbon composite kết hợp với sợi thủy tinh mang lại độ dẻo dai tối ưu. Chiều dài 1.8m phù hợp cho câu tại hồ, ao nhỏ. Trọng lượng siêu nhẹ 165g giúp giảm mỏi tay. Khả năng chịu lực 6kg, thích hợp cho cá cỡ trung bình. Màu sắc đen bóng sang trọng với logo Daiwa nổi bật. Tay cầm cork tự nhiên thấm hút mồ hôi tốt. Bảo hành chính hãng 12 tháng.', 1200000, 'CC-DAI-18', 35, '/images/products/can-cau-daiwa.jpg', 'active'),

(2, 'Máy Câu Shimano 3000', 'Máy câu spinning Shimano 3000 chính hãng với công nghệ Hagane Body - thân máy liền khối chống xoắn cực tốt. Hệ thống phanh trước với lực kéo tối đa 9kg, điều chỉnh mượt mà 6 cấp độ. Bi ceramic chất lượng cao (5+1BB) quay êm, bền bỉ với thời gian. Tỷ số truyền 5.0:1 cho tốc độ thu dây nhanh. Ổ cối nhôm siêu bền, chống ăn mòn trong môi trường nước mặn. Cò gạt line bail tự động chuyển động nhẹ nhàng. Trọng lượng 280g cân bằng tốt trên cần. Dung lượng dây PE 150m - 1.0. Bảo hành chính hãng 12 tháng. Made in Malaysia.', 2500000, 'MC-SHI-3000', 30, '/images/products/may-cau-shimano.jpg', 'active'),

(2, 'Máy Câu Daiwa BG 4000', 'Máy câu Daiwa BG 4000 chuyên dụng cho câu cá biển và cá nước ngọt cỡ lớn. Thân máy sử dụng vật liệu DS5 Air Rotor siêu nhẹ nhưng cứng cáp tuyệt đối. Hệ thống phanh trước ATD (Automatic Tournament Drag) điều chỉnh mượt mà, lực kéo tối đa lên đến 12kg. Bi stainless steel 6+1BB chống rỉ sét hoàn toàn. Tỷ số truyền 5.6:1 cho tốc độ thu hồi nhanh chóng. Ổ cối Digigear bằng đồng chống biến dạng cao. Dung lượng dây PE 200m - 1.5 hoặc nylon 240m - 16lb. Màu đen/vàng đặc trưng của dòng BG. Trọng lượng 310g. Bảo hành chính hãng 12 tháng.', 3200000, 'MC-DAI-4000', 25, '/images/products/may-cau-daiwa.jpg', 'active'),

(3, 'Dây PE 8 Lõi 150m', 'Dây câu PE 8 lõi cao cấp với sức bền vượt trội. Mỗi lõi được phủ lớp keo chống thấm nước đặc biệt giúp dây luôn khô ráo, không thấm nước. Công nghệ dệt 8 sợi siêu chặt giúp dây có độ tròn đều, mềm mại nhưng cực kỳ bền chắc. Độ chịu lực từ 20-80 lbs tùy size, phù hợp cho nhiều đối tượng cá. Màu sắc đổi màu theo mét (5 màu luân phiên) giúp xác định độ sâu khi câu. Chiều dài 150m đủ dùng cho đa dạng kỹ thuật câu. Độ dãn giãn thấp giúp cảm nhận cú cắn nhạy hơn. Chống mài mòn tốt khi chạm đá, rạn san hô. Sản xuất tại Nhật Bản.', 350000, 'DY-PE8-150', 100, '/images/products/day-pe-8-loi.jpg', 'active'),

(3, 'Dây Carbon Fluorocarbon 50m', 'Dây Fluorocarbon 100% nguyên chất với độ trong suốt tuyệt đối dưới nước, cá không thể nhìn thấy. Chỉ số khúc xạ ánh sáng gần với nước giúp dây "vô hình". Độ chìm nhanh gấp đôi dây nylon thông thường, tốc độ hạ mồi xuống đáy hiệu quả. Độ bền hóa chất cao, không bị ảnh hưởng bởi nước mặn, tia UV hay hóa chất. Độ chịu lực 8-25 lbs tùy đường kính. Chiều dài 50m thích hợp làm dây leader hoặc dây chính cho máy nhỏ. Độ mài mòn thấp giúp giảm sờn dây khi chà xát với vật cản. Không thấm nước nên không cần phơi. Thích hợp cho câu cá cảnh giác như cá trắm, cá chép. Made in Japan.', 280000, 'DY-CF-50', 80, '/images/products/day-carbon.jpg', 'active'),

(4, 'Bộ 100 Lưỡi Câu Assorted', 'Bộ 100 chiếc lưỡi câu đa dạng size từ 1 đến 10 trong hộp nhựa 10 ngăn tiện lợi. Mỗi size có 10 chiếc, đáp ứng mọi nhu cầu câu từ cá nhỏ đến cá lớn. Làm từ thép carbon cao cấp được tôi luyện nhiều lần, độ cứng và độ bền tối ưu. Mũi lưỡi sắc bén được mài kim cương, xuyên thủng môi cá nhanh chóng. Thiết kế gai ngược chống tuột cá hiệu quả. Phủ lớp chống gỉ đặc biệt, sử dụng lâu dài không lo hoen rỉ. Mắt lưỡi to và tròn giúp buộc dây dễ dàng. Phù hợp cho câu nước ngọt và nước mặn. Hộp nhựa trong suốt dễ quan sát, nắp đậy chặt không lo rơi vãi. Trọng lượng cả bộ chỉ 180g, gọn nhẹ.', 150000, 'LC-ASS-100', 200, '/images/products/luoi-cau-assorted.jpg', 'active'),

(4, 'Lưỡi Câu Chuyên Dụng Cá Lớn Size 8/0', 'Lưỡi câu size 8/0 siêu to chuyên dùng cho săn cá lớn như cá tra, cá hú, cá mú. Thân lưỡi làm từ thép hợp kim đặc biệt được gia công nhiệt độ cao, độ cứng đạt chuẩn quốc tế. Đường kính dây thép lên đến 3mm, chịu được lực kéo trên 100kg. Mũi móc cực sắc, hình dáng cong vừa phải để cá khó tuột. Gai ngược lớn giữ chặt cá không lo trượt. Chiều dài tổng thể 7cm, khoảng cách giữa mũi và thân 3.5cm. Lớp phủ đen không phản chiếu ánh sáng, cá không dễ phát hiện. Mắt lưỡi hình chữ O đường kính 8mm, buộc dây leader dễ dàng. Gói 5 chiếc trong túi zip chống ẩm. Made in China với tiêu chuẩn cao.', 80000, 'LC-BIG-80', 150, '/images/products/luoi-cau-ca-lon.jpg', 'active'),

(5, 'Mồi Giả Rapala 12cm', 'Mồi cá giả Rapala Original Floating 12cm - huyền thoại của giới câu lure toàn cầu. Thân mồi bằng gỗ balsa thật nhẹ, tự nổi trên mặt nước. Hành trình lặn 1-2m khi thu dây, tạo chuyển động wobble tự nhiên như cá thật. Hệ thống lắc bi thép bên trong tạo tiếng động hấp dẫn cá. Sơn phủ 7 lớp với họa tiết vảy cá sống động, bền màu theo thời gian. Lưỡi câu treble hooks VMC cao cấp size #6, cực sắc. Mắt mồi 3D holo thu hút ánh sáng. Vòng inox 304 chống gỉ tuyệt đối. Trọng lượng 11g phù hợp cho máy spinning. Thích hợp câu cá rô phi, cá chẽm, cá vược, cá lóc. Màu sắc đa dạng: bạc, vàng, xanh, đỏ. Hộp nhựa sang trọng. Xuất xứ Phần Lan.', 250000, 'MG-RAP-12', 60, '/images/products/moi-gia-rapala.jpg', 'active'),

(5, 'Mồi Mềm Silicon 10 Con', 'Bộ 10 con mồi mềm silicon chuyên dụng cho câu cá lóc, cá rô. Chất liệu silicon y tế không mùi, không độc hại, an toàn tuyệt đối. Độ mềm dẻo vừa phải mô phỏng chuyển động cá mồi thật tự nhiên. Hương vị thơm đặc biệt thu hút cá từ xa. Màu sắc đa dạng: trắng trong, hồng tôm, xanh cá mòi, vàng nhạt, đen bạc - mỗi màu 2 con. Chiều dài 8cm với đuôi xẻ đôi rung động mạnh khi kéo. Bụng mồi có rãnh để gắn Jig Head dễ dàng. Độ bền cao, một con dùng được nhiều lần. Không bị cá cắn đứt ngay như mồi thật. Gói zip trong suốt bảo quản mồi luôn mềm. Trọng lượng mỗi con 5g. Xuất xứ Trung Quốc. Thích hợp cho câu nước ngọt.', 120000, 'MM-SIL-10', 90, '/images/products/moi-mem-silicon.jpg', 'active'),

(6, 'Túi Đựng Cần 2 Ngăn', 'Túi vải canvas bền chắc chuyên dụng đựng cần câu với 2 ngăn riêng biệt. Ngăn chính dài 1.5m có thể chứa 3-4 cần câu, lót mút xốp êm ái bảo vệ cần không bị xước. Ngăn phụ dài 1m chứa cần ngắn hoặc phụ kiện khác. Dây kéo khóa YKK bền bỉ, kéo trơn tru không kẹt. Quai đeo vai rộng 5cm có lót đệm êm vai, điều chỉnh chiều dài linh hoạt. Quai xách bên hông tiện lợi. 4 túi ngoài đựng cuộn máy, hộp phụ kiện, bình nước. Chất liệu canvas 600D chống nước nhẹ, dễ vệ sinh. Đáy túi có lót nhựa cứng chống ướt. Màu xanh rêu/đen/xám lựa chọn. Kích thước 155x25x15cm. Trọng lượng túi 800g. Bảo hành may 6 tháng. Made in Vietnam.', 450000, 'PK-TUI-2N', 40, '/images/products/tui-dung-can.jpg', 'active'),

(6, 'Hộp Đồ Nghề Đa Năng', 'Hộp đựng đồ nghề câu cá 4 tầng với thiết kế module linh hoạt. Thân hộp nhựa ABS cao cấp chắc chắn, chịu lực tốt. 4 tầng có thể tháo rời độc lập, mỗi tầng chia 6-12 ngăn nhỏ tùy chỉnh được. Tổng cộng 40 ngăn chứa lưỡi câu, chì, cóc, vòng xoay, kẹp chì đa dạng. Nắp trong suốt quan sát dễ dàng không cần mở. Khóa cài 4 chiều chắc chắn, không lo bung ra khi va đập. Ron cao su quanh nắp chống nước tuyệt đối. Tay cầm chắc chắn, thoải mái khi di chuyển. Kích thước 32x22x24cm khá lớn đựng được nhiều đồ. Trọng lượng 1.2kg khi rỗng. Chịu được trọng lượng đồ 5kg. Màu xanh dương/cam/xanh lá lựa chọn. Bảo hành 12 tháng. Made in Thailand.', 320000, 'PK-HOP-4T', 50, '/images/products/hop-do-nghe.jpg', 'active');

-- ============================================
-- DỮ LIỆU MẪU - ĐỊA CHỈ
-- ============================================
INSERT INTO addresses (user_id, label, full_name, phone, address_line, province, district, ward, is_default) VALUES
(2, 'Nhà riêng', 'Nguyễn Văn A', '0987654321', '123 Đường ABC', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 1),
(2, 'Công ty', 'Nguyễn Văn A', '0987654321', '456 Đường XYZ', 'Hà Nội', 'Đống Đa', 'Láng Hạ', 0);

-- ============================================
-- DỮ LIỆU MẪU - HÌNH ẢNH SẢN PHẨM
-- ============================================
INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
-- Sản phẩm 1: Cần Câu Carbon Pro 2.1m
(1, '/images/products/can-cau-carbon-pro-1.jpg', 'Cần câu carbon pro góc chính', 1),
(1, '/images/products/can-cau-carbon-pro-2.jpg', 'Chi tiết cần câu', 0),
(1, '/images/products/can-cau-carbon-pro-3.jpg', 'Cần câu trong sử dụng', 0),
(1, '/images/products/can-cau-carbon-pro-4.jpg', 'Chi tiết tay cầm', 0),

-- Sản phẩm 2: Cần Câu Daiwa Legalis 1.8m
(2, '/images/products/can-cau-daiwa-1.jpg', 'Cần câu Daiwa', 1),
(2, '/images/products/can-cau-daiwa-2.jpg', 'Chi tiết cần', 0),
(2, '/images/products/can-cau-daiwa-3.jpg', 'Góc sử dụng', 0),

-- Sản phẩm 3: Máy Câu Shimano 3000
(3, '/images/products/may-cau-shimano-1.jpg', 'Máy câu Shimano 3000', 1),
(3, '/images/products/may-cau-shimano-2.jpg', 'Chi tiết máy câu', 0),
(3, '/images/products/may-cau-shimano-3.jpg', 'Góc cận cảnh', 0),
(3, '/images/products/may-cau-shimano-4.jpg', 'Máy câu trên cần', 0),

-- Sản phẩm 4: Máy Câu Daiwa BG 4000
(4, '/images/products/may-cau-daiwa-1.jpg', 'Máy câu Daiwa BG', 1),
(4, '/images/products/may-cau-daiwa-2.jpg', 'Chi tiết máy', 0),
(4, '/images/products/may-cau-daiwa-3.jpg', 'Cận cảnh', 0),

-- Sản phẩm 5: Dây PE 8 Lõi 150m
(5, '/images/products/day-pe-8-loi-1.jpg', 'Cuộn dây PE', 1),
(5, '/images/products/day-pe-8-loi-2.jpg', 'Chi tiết dây', 0),
(5, '/images/products/day-pe-8-loi-3.jpg', 'Dây trên máy câu', 0),

-- Sản phẩm 6: Dây Carbon Fluorocarbon 50m
(6, '/images/products/day-carbon-1.jpg', 'Cuộn dây carbon', 1),
(6, '/images/products/day-carbon-2.jpg', 'Chi tiết', 0),

-- Sản phẩm 7: Bộ 100 Lưỡi Câu Assorted
(7, '/images/products/luoi-cau-assorted-1.jpg', 'Bộ lưỡi câu đa dạng', 1),
(7, '/images/products/luoi-cau-assorted-2.jpg', 'Chi tiết lưỡi câu', 0),
(7, '/images/products/luoi-cau-assorted-3.jpg', 'Các size khác nhau', 0),

-- Sản phẩm 8: Lưỡi Câu Chuyên Dụng Cá Lớn Size 8/0
(8, '/images/products/luoi-cau-ca-lon-1.jpg', 'Lưỡi câu cỡ lớn', 1),
(8, '/images/products/luoi-cau-ca-lon-2.jpg', 'Chi tiết móc', 0),

-- Sản phẩm 9: Mồi Giả Rapala 12cm
(9, '/images/products/moi-gia-rapala-1.jpg', 'Mồi giả Rapala', 1),
(9, '/images/products/moi-gia-rapala-2.jpg', 'Chi tiết mồi', 0),
(9, '/images/products/moi-gia-rapala-3.jpg', 'Góc khác', 0),
(9, '/images/products/moi-gia-rapala-4.jpg', 'Mồi trong nước', 0),

-- Sản phẩm 10: Mồi Mềm Silicon 10 Con
(10, '/images/products/moi-mem-silicon-1.jpg', 'Bộ mồi mềm silicon', 1),
(10, '/images/products/moi-mem-silicon-2.jpg', 'Chi tiết mồi mềm', 0),
(10, '/images/products/moi-mem-silicon-3.jpg', 'Các màu sắc', 0),

-- Sản phẩm 11: Túi Đựng Cần 2 Ngăn
(11, '/images/products/tui-dung-can-1.jpg', 'Túi đựng cần câu', 1),
(11, '/images/products/tui-dung-can-2.jpg', 'Chi tiết túi', 0),
(11, '/images/products/tui-dung-can-3.jpg', 'Ngăn chứa', 0),

-- Sản phẩm 12: Hộp Đồ Nghề Đa Năng
(12, '/images/products/hop-do-nghe-1.jpg', 'Hộp đồ nghề 4 tầng', 1),
(12, '/images/products/hop-do-nghe-2.jpg', 'Chi tiết các ngăn', 0),
(12, '/images/products/hop-do-nghe-3.jpg', 'Hộp mở ra', 0),
(12, '/images/products/hop-do-nghe-4.jpg', 'Đựng phụ kiện', 0);

-- ============================================
-- DỮ LIỆU MẪU - MÃ GIẢM GIÁ
-- ============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, start_date, end_date, is_active) VALUES
('WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10.00, 500000, 100000, 100, '2025-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('FLASHSALE', 'Flash Sale - Giảm 15%', 'percentage', 15.00, 1000000, 200000, 50, '2025-11-01 00:00:00', '2025-11-30 23:59:59', TRUE),
('FREESHIP', 'Miễn phí vận chuyển - Giảm 50k', 'fixed', 50000, 300000, NULL, 200, '2025-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('VIP2025', 'Giảm 20% cho khách VIP', 'percentage', 20.00, 2000000, 500000, 30, '2025-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('NEWYEAR', 'Tết 2025 - Giảm 200k', 'fixed', 200000, 1500000, NULL, 100, '2025-01-20 00:00:00', '2025-02-10 23:59:59', TRUE);

-- ============================================
-- DỮ LIỆU MẪU - BLOG
-- ============================================
INSERT INTO blogs (title, slug, excerpt, content, thumbnail, author_id, category, tags, view_count, is_published, published_at) VALUES
('Kỹ thuật câu cá lóc hiệu quả', 'ky-thuat-cau-ca-loc-hieu-qua', 'Chia sẻ kinh nghiệm và kỹ thuật câu cá lóc cho người mới bắt đầu', 
'<h2>Giới thiệu về cá lóc</h2><p>Cá lóc là loài cá nước ngọt phổ biến tại Việt Nam, được nhiều người yêu thích...</p><h2>Dụng cụ cần chuẩn bị</h2><p>Cần câu 1.8-2.4m, máy câu ngang size 3000-4000, dây PE 2-4...</p><h2>Kỹ thuật câu</h2><p>Sử dụng mồi giả như con quay, wobler, hoặc mồi tự nhiên như cá rô nhỏ...</p>', 
'/images/blog/ky-thuat-cau-ca-loc.jpg', 1, 'Kỹ thuật câu', '["cá lóc", "kỹ thuật", "hướng dẫn"]', 1250, TRUE, '2025-11-01 10:00:00'),

('Top 5 cần câu tốt nhất 2025', 'top-5-can-cau-tot-nhat-2025', 'Đánh giá và so sánh 5 cần câu được ưa chuộng nhất năm 2025', 
'<h2>1. Shimano Surf Leader 425 BX</h2><p>Thân carbon cao cấp, độ bền vượt trội...</p><h2>2. Daiwa Crossfire</h2><p>Thiết kế đa năng phù hợp nhiều địa hình...</p><h2>3. Abu Garcia Vengeance</h2><p>Giá cả phải chăng, chất lượng tốt...</p>', 
'/images/blog/top-5-can-cau.jpg', 1, 'Đánh giá sản phẩm', '["cần câu", "đánh giá", "top 5"]', 2340, TRUE, '2025-10-15 14:30:00'),

('Bảo quản dụng cụ câu cá đúng cách', 'bao-quan-dung-cu-cau-ca-dung-cach', 'Hướng dẫn cách bảo quản cần câu, máy câu và phụ kiện để sử dụng lâu dài', 
'<h2>Bảo quản cần câu</h2><p>Sau mỗi lần câu, cần rửa sạch bằng nước ngọt, lau khô...</p><h2>Bảo quản máy câu</h2><p>Định kỳ tra dầu, làm sạch bụi bẩn, bảo quản nơi khô ráo...</p><h2>Bảo quản dây cước</h2><p>Tránh ánh nắng trực tiếp, kiểm tra độ sợi thường xuyên...</p>', 
'/images/blog/bao-quan-dung-cu.jpg', 1, 'Hướng dẫn', '["bảo quản", "bảo trì", "dụng cụ"]', 890, TRUE, '2025-10-20 09:00:00');

-- ============================================
-- HOÀN TẤT
-- ============================================
SELECT 'Database fishing_shop đã được tạo thành công!' AS Status,
       (SELECT COUNT(*) FROM users) AS Total_Users,
       (SELECT COUNT(*) FROM categories) AS Total_Categories,
       (SELECT COUNT(*) FROM products) AS Total_Products,
       (SELECT COUNT(*) FROM product_images) AS Total_Images,
       (SELECT COUNT(*) FROM coupons) AS Total_Coupons,
       (SELECT COUNT(*) FROM blogs) AS Total_Blogs;
