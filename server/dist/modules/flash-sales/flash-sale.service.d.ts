declare class FlashSaleService {
    createFlashSale(data: {
        product_id: number;
        discount_percentage: number;
        start_time: Date | string;
        end_time: Date | string;
        status?: 'active' | 'inactive';
    }): Promise<import("../../infrastructure/repositories/flashSaleRepositoryImpl").FlashSaleRecord>;
    getActiveFlashSales(): Promise<import("../../infrastructure/repositories/flashSaleRepositoryImpl").FlashSaleWithProduct[]>;
    getAllFlashSales(filter?: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: import("../../infrastructure/repositories/flashSaleRepositoryImpl").FlashSaleWithProduct[];
        total: number;
    }>;
    getFlashSaleById(id: number): Promise<import("../../infrastructure/repositories/flashSaleRepositoryImpl").FlashSaleRecord>;
    updateFlashSale(id: number, data: {
        discount_percentage?: number;
        start_time?: Date | string;
        end_time?: Date | string;
        status?: 'active' | 'inactive' | 'expired';
    }): Promise<import("../../infrastructure/repositories/flashSaleRepositoryImpl").FlashSaleRecord | null>;
    deleteFlashSale(id: number): Promise<{
        message: string;
    }>;
}
declare const _default: FlashSaleService;
export default _default;
//# sourceMappingURL=flash-sale.service.d.ts.map