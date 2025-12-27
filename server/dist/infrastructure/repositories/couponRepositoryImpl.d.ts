export interface CouponRecord {
    id: number;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_discount?: number;
    usage_limit?: number;
    used_count: number;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
interface CouponFilters {
    isActive?: boolean;
    search?: string;
}
declare class CouponRepository {
    list(filters?: CouponFilters, page?: number, limit?: number): Promise<CouponRecord[]>;
    findById(id: number): Promise<CouponRecord | null>;
    findByCode(code: string): Promise<CouponRecord | null>;
    create(data: Partial<CouponRecord>): Promise<number>;
    update(id: number, data: Partial<CouponRecord>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    incrementUsedCount(id: number): Promise<boolean>;
    validateCoupon(code: string, orderValue: number): Promise<{
        valid: boolean;
        message?: string;
        coupon?: CouponRecord;
    }>;
}
declare const _default: CouponRepository;
export default _default;
//# sourceMappingURL=couponRepositoryImpl.d.ts.map