export interface FlashSaleRecord {
    id: number;
    product_id: number;
    discount_percentage: number;
    start_time: Date;
    end_time: Date;
    status: 'active' | 'inactive' | 'expired';
    created_at: Date;
    updated_at: Date;
}
export interface FlashSaleWithProduct extends FlashSaleRecord {
    product_name: string;
    product_price: number;
    product_thumbnail: string | null;
    discounted_price: number;
}
declare class FlashSaleRepository {
    create(data: {
        product_id: number;
        discount_percentage: number;
        start_time: Date;
        end_time: Date;
        status?: 'active' | 'inactive';
    }): Promise<FlashSaleRecord>;
    findById(id: number): Promise<FlashSaleRecord | null>;
    findByProductId(productId: number): Promise<FlashSaleRecord | null>;
    listActive(): Promise<FlashSaleWithProduct[]>;
    listAll(filter?: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: FlashSaleWithProduct[];
        total: number;
    }>;
    update(id: number, data: {
        discount_percentage?: number;
        start_time?: Date;
        end_time?: Date;
        status?: 'active' | 'inactive' | 'expired';
    }): Promise<FlashSaleRecord | null>;
    delete(id: number): Promise<boolean>;
    deleteByProductId(productId: number): Promise<boolean>;
}
declare const _default: FlashSaleRepository;
export default _default;
//# sourceMappingURL=flashSaleRepositoryImpl.d.ts.map