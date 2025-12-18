-- ============================================
-- THÊM BẢNG WISHLIST VÀ REVIEWS
-- Chạy file này trong phpMyAdmin hoặc MySQL client
-- ============================================

USE fishing_shop;

-- ============================================
-- BẢNG WISHLIST (Danh sách yêu thích)
-- ============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID wishlist',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian thêm',
  UNIQUE KEY unique_user_product (user_id, product_id),
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh sách yêu thích';

-- ============================================
-- BẢNG PRODUCT REVIEWS (Đánh giá sản phẩm)
-- ============================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID đánh giá',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  user_id INT UNSIGNED NOT NULL COMMENT 'ID người dùng',
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT 'Điểm đánh giá (1-5 sao)',
  comment TEXT COMMENT 'Nội dung đánh giá',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  CONSTRAINT fk_review_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng đánh giá sản phẩm';

-- Tạo index để tăng tốc truy vấn
CREATE INDEX idx_review_product ON product_reviews(product_id);
CREATE INDEX idx_review_user ON product_reviews(user_id);

-- Kiểm tra kết quả
SHOW TABLES LIKE '%wishlist%';
SHOW TABLES LIKE '%review%';

-- Xem cấu trúc bảng
DESCRIBE wishlists;
DESCRIBE product_reviews;
