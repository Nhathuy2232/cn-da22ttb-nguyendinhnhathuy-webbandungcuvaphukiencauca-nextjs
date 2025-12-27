const mysql = require('mysql2/promise');

async function migrateImages() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'fishing_shop'
    });

    // Lấy tất cả products chưa có images
    const [products] = await conn.execute(
      'SELECT id, name FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images)'
    );

    console.log(`Found ${products.length} products without images`);

    // Tạo images cho mỗi product
    for (const product of products) {
      // Tạo 1-3 images cho mỗi product
      const numImages = Math.floor(Math.random() * 3) + 1;

      for (let i = 1; i <= numImages; i++) {
        const imageUrl = `/images/products/${product.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}.jpg`;
        const isPrimary = i === 1 ? 1 : 0;
        const altText = `${product.name} - Image ${i}`;

        await conn.execute(
          'INSERT INTO product_images (product_id, image_url, alt_text, is_primary, created_at) VALUES (?, ?, ?, ?, NOW())',
          [product.id, imageUrl, altText, isPrimary]
        );
      }
    }

    console.log('Migration completed successfully!');

    // Kiểm tra kết quả
    const [finalStats] = await conn.execute('SELECT COUNT(*) as total_images, COUNT(DISTINCT product_id) as products_with_images FROM product_images');
    console.log(`Final stats: ${finalStats[0].total_images} images for ${finalStats[0].products_with_images} products`);

  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

migrateImages();