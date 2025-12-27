/**
 * Interface Repository cho Order
 * Định nghĩa các phương thức truy xuất dữ liệu đơn hàng
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'e_wallet';
export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    productName?: string;
    thumbnailUrl?: string;
}
export interface Order {
    id: number;
    userId: number;
    addressId: number | null;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    shippingFee: number;
    ghnOrderCode?: string;
    recipientName?: string;
    recipientPhone?: string;
    recipientAddress?: string;
    provinceId?: number;
    districtId?: number;
    wardCode?: string;
    note: string | null;
    items?: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateOrderData {
    userId: number;
    addressId?: number | null;
    totalAmount: number;
    shippingFee?: number;
    paymentMethod: PaymentMethod;
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
}
export interface IOrderRepository {
    /**
     * Tạo đơn hàng mới
     */
    createOrder(data: CreateOrderData): Promise<Order>;
    /**
     * Tìm đơn hàng theo ID
     */
    findById(id: number): Promise<Order | null>;
    /**
     * Tìm đơn hàng theo ID kèm danh sách sản phẩm
     */
    findByIdWithItems(id: number): Promise<Order | null>;
    /**
     * Lấy danh sách đơn hàng của người dùng
     */
    listByUser(userId: number): Promise<Order[]>;
    /**
     * Lấy tất cả đơn hàng (admin)
     */
    listAll(limit?: number, offset?: number): Promise<Order[]>;
    /**
     * Cập nhật trạng thái đơn hàng
     */
    updateStatus(orderId: number, status: OrderStatus): Promise<boolean>;
    /**
     * Cập nhật mã đơn GHN
     */
    updateGHNOrderCode(orderId: number, ghnOrderCode: string): Promise<boolean>;
    /**
     * Xóa đơn hàng
     */
    delete(orderId: number): Promise<boolean>;
}
//# sourceMappingURL=IOrderRepository.d.ts.map