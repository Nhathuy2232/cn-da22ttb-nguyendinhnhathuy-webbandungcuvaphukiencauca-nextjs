export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    created_at: Date;
}
export interface ProductRecord {
    id: number;
    category_id: number | null;
    name: string;
    description: string | null;
    price: number;
    sku: string;
    stock_quantity: number;
    thumbnail_url?: string | null;
    status: 'draft' | 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
    category_name?: string;
    images?: ProductImage[];
}
export interface ProductFilter {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
}
declare class ProductRepository {
    list(filter?: ProductFilter): Promise<{
        items: ProductRecord[];
        total: number;
    }>;
    findById(id: number): Promise<ProductRecord | null>;
    create(data: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRecord>;
    update(id: number, data: Partial<Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<ProductRecord | null>;
    delete(id: number): Promise<void>;
    saveProductImages(productId: number, images: Omit<ProductImage, 'id' | 'product_id' | 'created_at'>[]): Promise<void>;
    getTopSelling(limit?: number): Promise<any[]>;
}
declare const productRepository: ProductRepository;
export default productRepository;
//# sourceMappingURL=productRepositoryImpl.d.ts.map