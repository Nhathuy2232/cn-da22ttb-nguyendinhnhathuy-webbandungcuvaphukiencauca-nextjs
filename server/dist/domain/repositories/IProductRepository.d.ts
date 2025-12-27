/**
 * Interface Repository cho Product
 * Định nghĩa các phương thức truy xuất dữ liệu sản phẩm
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    stockQuantity: number;
    thumbnailUrl: string;
    images: string[];
    averageRating?: number;
    totalReviews?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductFilter {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
    limit?: number;
    offset?: number;
}
export interface IProductRepository {
    /**
     * Tìm sản phẩm theo ID
     */
    findById(id: number): Promise<Product | null>;
    /**
     * Lấy danh sách sản phẩm với bộ lọc
     */
    findAll(filter: ProductFilter): Promise<{
        products: Product[];
        total: number;
    }>;
    /**
     * Tạo sản phẩm mới
     */
    create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    /**
     * Cập nhật thông tin sản phẩm
     */
    update(id: number, data: Partial<Product>): Promise<boolean>;
    /**
     * Xóa sản phẩm
     */
    delete(id: number): Promise<boolean>;
    /**
     * Cập nhật số lượng tồn kho
     */
    updateStock(id: number, quantity: number): Promise<boolean>;
    /**
     * Kiểm tra tồn kho
     */
    checkStock(id: number, quantity: number): Promise<boolean>;
}
//# sourceMappingURL=IProductRepository.d.ts.map