import { ProductFilter, ProductRecord } from '../../infrastructure/repositories/productRepositoryImpl';
declare class ProductService {
    list(filter?: ProductFilter): Promise<{
        items: ProductRecord[];
        page: number;
        limit: number;
        total: number;
    }>;
    findById(id: number): Promise<ProductRecord | null>;
    create(data: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRecord>;
    update(id: number, data: Partial<Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<ProductRecord | null>;
    delete(id: number): Promise<void>;
}
declare const productService: ProductService;
export default productService;
//# sourceMappingURL=product.service.d.ts.map