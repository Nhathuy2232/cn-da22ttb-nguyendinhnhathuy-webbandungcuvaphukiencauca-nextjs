-- Fix product image paths to match actual files
UPDATE product_images SET image_url = '/images/products/can-cau-daiwa.jpg' WHERE product_id = 2 AND is_primary = 1;
UPDATE product_images SET image_url = '/images/products/may-cau-shimano.jpg' WHERE product_id = 3 AND is_primary = 1;
UPDATE product_images SET image_url = '/images/products/may-cau-daiwa.jpg' WHERE product_id = 4 AND is_primary = 1;
UPDATE product_images SET image_url = '/images/products/day-pe-8-loi.jpg' WHERE product_id = 5 AND is_primary = 1;
UPDATE product_images SET image_url = '/images/products/day-carbon.jpg' WHERE product_id = 6 AND is_primary = 1;
UPDATE product_images SET image_url = '/images/products/luoi-cau-assorted.jpg' WHERE product_id = 7 AND is_primary = 1;

-- Add primary images for products that don't have them
INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(1, '/images/products/can-cau-carbon-pro.jpg', 'Cần câu Carbon Pro', 1),
(8, '/images/products/can-cau-jigging.jpg', 'Cần câu Jigging', 1),
(9, '/images/products/can-cau-surf.jpg', 'Cần câu Surf', 1),
(10, '/images/products/can-cau-lure.jpg', 'Cần câu Lure', 1)
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), is_primary = 1;