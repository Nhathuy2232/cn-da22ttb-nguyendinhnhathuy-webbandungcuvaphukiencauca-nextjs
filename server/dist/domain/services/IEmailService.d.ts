/**
 * Interface Service Email
 * Định nghĩa các phương thức gửi email
 */
export interface OrderEmailData {
    orderNumber: string;
    orderDate: Date;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    shippingAddress: string;
    ghnOrderCode?: string;
}
export interface IEmailService {
    /**
     * Gửi email xác nhận đơn hàng cho khách hàng
     */
    sendOrderConfirmationToCustomer(data: OrderEmailData & {
        customerEmail: string;
    }): Promise<void>;
    /**
     * Gửi email thông báo đơn hàng mới cho admin
     */
    sendNewOrderNotificationToAdmin(data: OrderEmailData & {
        customerEmail: string;
        customerPhone: string;
    }): Promise<void>;
    /**
     * Gửi email reset password
     */
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    /**
     * Gửi email chào mừng người dùng mới
     */
    sendWelcomeEmail(email: string, name: string): Promise<void>;
}
//# sourceMappingURL=IEmailService.d.ts.map