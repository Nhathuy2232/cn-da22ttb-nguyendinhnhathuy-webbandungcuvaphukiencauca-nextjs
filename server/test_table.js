const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'fishing_shop'
    });
    const [rows] = await conn.query('SHOW TABLES LIKE "product_images"');
    console.log('Table exists:', rows.length > 0);
    conn.end();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();