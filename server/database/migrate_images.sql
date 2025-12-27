-- Migration: Cập nhật đường dẫn hình ảnh từ /images/products/ sang /public/images/
-- Ngày tạo: 27/12/2025

-- Cập nhật đường dẫn hình ảnh trong bảng product_images
UPDATE product_images
SET image_url = REPLACE(image_url, '/images/products/', '/public/images/')
WHERE image_url LIKE '/images/products/%';

-- Kiểm tra kết quả
SELECT COUNT(*) as updated_count FROM product_images WHERE image_url LIKE '/public/images/%';

-- Stored procedure for inserting new uploaded images
DROP PROCEDURE IF EXISTS InsertProductImage;
DELIMITER //

CREATE PROCEDURE InsertProductImage(IN p_product_id INT, IN p_image_url VARCHAR(255))
BEGIN
    INSERT INTO product_images (product_id, image_url) VALUES (p_product_id, p_image_url);
END //

DELIMITER ;