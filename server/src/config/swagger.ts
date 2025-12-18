import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fishing Shop API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống cửa hàng câu cá',
      contact: {
        name: 'Fishing Shop',
        email: 'support@fishing-shop.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token để xác thực',
        },
      },
      schemas: {
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            full_name: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
            phone: { type: 'string', example: '0901234567' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Product schemas
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Cần câu carbon' },
            description: { type: 'string', example: 'Cần câu carbon cao cấp' },
            price: { type: 'number', example: 500000 },
            sku: { type: 'string', example: 'CAN-001' },
            stock_quantity: { type: 'integer', example: 50 },
            category_id: { type: 'integer', example: 1 },
            thumbnail_url: { type: 'string', example: '/images/products/can-cau.jpg' },
            status: { type: 'string', enum: ['draft', 'active', 'inactive'], example: 'active' },
            category_name: { type: 'string', example: 'Cần câu' },
            images: {
              type: 'array',
              items: { $ref: '#/components/schemas/ProductImage' },
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ProductImage: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            image_url: { type: 'string', example: '/images/products/image1.jpg' },
            alt_text: { type: 'string', example: 'Ảnh sản phẩm' },
            is_primary: { type: 'boolean', example: true },
          },
        },
        // Category schema
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Cần câu' },
            description: { type: 'string', example: 'Các loại cần câu' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Cart schemas
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
            product_name: { type: 'string', example: 'Cần câu carbon' },
            product_price: { type: 'number', example: 500000 },
            product_thumbnail: { type: 'string', example: '/images/products/can-cau.jpg' },
          },
        },
        // Order schemas
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            address_id: { type: 'integer', example: 1 },
            total_amount: { type: 'number', example: 1500000 },
            payment_method: { type: 'string', enum: ['cod', 'bank_transfer', 'e_wallet'], example: 'cod' },
            status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], example: 'pending' },
            note: { type: 'string', example: 'Giao hàng giờ hành chính' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // Blog schemas
        Blog: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Kỹ thuật câu cá lóc' },
            slug: { type: 'string', example: 'ky-thuat-cau-ca-loc' },
            excerpt: { type: 'string', example: 'Hướng dẫn câu cá lóc hiệu quả' },
            content: { type: 'string', example: '<p>Nội dung bài viết...</p>' },
            category: { type: 'string', example: 'Kỹ thuật câu cá' },
            tags: { type: 'array', items: { type: 'string' }, example: ['cá lóc', 'kỹ thuật'] },
            thumbnail: { type: 'string', example: '/images/blog/thumbnail.jpg' },
            author_name: { type: 'string', example: 'Admin' },
            view_count: { type: 'integer', example: 100 },
            is_published: { type: 'boolean', example: true },
            published_at: { type: 'string', format: 'date-time' },
          },
        },
        // Error schema
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Error details' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Xác thực và quản lý người dùng' },
      { name: 'Products', description: 'Quản lý sản phẩm' },
      { name: 'Categories', description: 'Quản lý danh mục' },
      { name: 'Cart', description: 'Quản lý giỏ hàng' },
      { name: 'Orders', description: 'Quản lý đơn hàng' },
      { name: 'Blogs', description: 'Quản lý bài viết blog' },
      { name: 'Admin', description: 'Các API dành cho admin' },
      { name: 'Shipping', description: 'Tích hợp vận chuyển GHN' },
    ],
  },
  apis: ['./src/api/*.ts', './src/interfaces/http/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
