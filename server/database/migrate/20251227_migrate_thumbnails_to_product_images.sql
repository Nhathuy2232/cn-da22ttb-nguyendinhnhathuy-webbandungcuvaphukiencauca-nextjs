-- Migration: move product thumbnails into product_images
-- Created: 2025-12-27
-- Usage: run this against the `fishing_shop` database (mysql CLI or phpMyAdmin)

START TRANSACTION;

-- Insert thumbnail_url from products into product_images (mark as primary)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, created_at)
SELECT p.id, p.thumbnail_url, NULL, 1, NOW()
FROM products p
WHERE p.thumbnail_url IS NOT NULL
  AND TRIM(p.thumbnail_url) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM product_images pi
    WHERE pi.product_id = p.id AND pi.image_url = p.thumbnail_url
  );

-- Clear migrated thumbnail_url fields on products
UPDATE products p
SET p.thumbnail_url = NULL
WHERE p.thumbnail_url IS NOT NULL
  AND TRIM(p.thumbnail_url) <> ''
  AND EXISTS (
    SELECT 1 FROM product_images pi
    WHERE pi.product_id = p.id AND pi.image_url = p.thumbnail_url
  );

COMMIT;

-- Optional: verify with
-- SELECT * FROM product_images WHERE image_url LIKE '/images/products/%';
-- SELECT id, thumbnail_url FROM products WHERE thumbnail_url IS NOT NULL;
