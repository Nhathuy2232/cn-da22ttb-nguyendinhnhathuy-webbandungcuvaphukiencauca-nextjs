export interface OrderRecord {
    id: number;
    user_id: number;
    address_id: number | null;
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    payment_method: 'cod' | 'bank_transfer' | 'e_wallet';
    total_amount: number;
    shipping_fee?: number;
    ghn_order_code?: string;
    recipient_name?: string;
    recipient_phone?: string;
    recipient_address?: string;
    province_id?: number;
    district_id?: number;
    ward_code?: string;
    note: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface OrderItemRecord {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: Date;
    product_name?: string;
    thumbnail_url?: string | null;
}
export interface OrderWithItems extends OrderRecord {
    items: OrderItemRecord[];
}
declare class OrderRepository {
    createOrder(params: {
        userId: number;
        addressId?: number | null;
        totalAmount: number;
        shippingFee?: number;
        paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
        note?: string;
        items: {
            productId: number;
            quantity: number;
            price: number;
        }[];
        recipientName?: string;
        recipientPhone?: string;
        recipientAddress?: string;
        provinceId?: number;
        districtId?: number;
        wardCode?: string;
    }): Promise<OrderRecord>;
    findById(orderId: number): Promise<OrderRecord | null>;
    findByIdWithItems(orderId: number): Promise<OrderWithItems | null>;
    listByUser(userId: number): Promise<OrderRecord[]>;
    updateStatus(orderId: number, status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'): Promise<OrderRecord | null>;
    list(filters?: {
        status?: string;
    }, page?: number, limit?: number): Promise<{
        orders: OrderRecord[];
        total: number;
    }>;
    getTotalRevenue(): Promise<{
        totalRevenue: number;
    }>;
    getRecentOrders(limit?: number): Promise<any[]>;
    getOrdersByStatus(): Promise<any[]>;
    getRevenueByDay(days?: number): Promise<any[]>;
    updateGHNOrderCode(orderId: number, ghnOrderCode: string): Promise<void>;
}
declare const orderRepository: OrderRepository;
export default orderRepository;
//# sourceMappingURL=orderRepositoryImpl.d.ts.map