interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}
interface OrderEmailData {
    orderNumber: string;
    orderDate: Date;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    shippingAddress: string;
    ghnOrderCode?: string;
}
interface AdminOrderEmailData extends OrderEmailData {
    customerEmail: string;
    customerPhone: string;
}
interface CustomerOrderEmailData extends OrderEmailData {
    customerEmail: string;
}
declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    private formatCurrency;
    private formatDate;
    private getPaymentMethodText;
    private generateOrderEmailHTML;
    sendNewOrderNotificationToAdmin(data: AdminOrderEmailData): Promise<void>;
    sendOrderConfirmationToCustomer(data: CustomerOrderEmailData): Promise<void>;
}
declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map