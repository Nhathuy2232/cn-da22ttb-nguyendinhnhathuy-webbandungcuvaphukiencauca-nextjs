declare class OrderService {
    checkout(input: {
        userId: number;
        addressId?: number;
        paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
        note?: string;
        shipping_info?: {
            recipient_name: string;
            recipient_phone: string;
            address: string;
            province_id: number;
            district_id: number;
            ward_code: string;
        };
        shipping_fee?: number;
        items?: Array<{
            product_id: number;
            quantity: number;
            price: number;
        }>;
    }): Promise<import("../../infrastructure/repositories/orderRepositoryImpl").OrderRecord>;
    listUserOrders(userId: number): Promise<import("../../infrastructure/repositories/orderRepositoryImpl").OrderRecord[]>;
    getOrderById(orderId: number, userId: number): Promise<import("../../infrastructure/repositories/orderRepositoryImpl").OrderWithItems | null>;
    updateOrderStatus(orderId: number, status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'): Promise<import("../../infrastructure/repositories/orderRepositoryImpl").OrderRecord | null>;
    confirmPayment(orderId: number, userId: number): Promise<{
        order_id: number;
        status: string;
        message: string;
    }>;
}
declare const orderService: OrderService;
export default orderService;
//# sourceMappingURL=order.service.d.ts.map