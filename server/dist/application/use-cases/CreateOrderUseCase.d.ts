/**
 * Use Case: Tạo đơn hàng mới
 * Xử lý toàn bộ quy trình tạo đơn hàng, tích hợp GHN và gửi email
 */
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IGHNService } from '../../domain/services/IGHNService';
import { IEmailService } from '../../domain/services/IEmailService';
export interface CreateOrderDTO {
    userId: number;
    paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
    note?: string;
    shippingInfo: {
        recipientName: string;
        recipientPhone: string;
        address: string;
        provinceId: number;
        districtId: number;
        wardCode: string;
    };
    items: Array<{
        productId: number;
        quantity: number;
    }>;
}
export declare class CreateOrderUseCase {
    private orderRepository;
    private productRepository;
    private ghnService;
    private emailService;
    constructor(orderRepository: IOrderRepository, productRepository: IProductRepository, ghnService: IGHNService, emailService: IEmailService);
    execute(dto: CreateOrderDTO): Promise<import("../../domain/repositories/IOrderRepository").Order>;
}
//# sourceMappingURL=CreateOrderUseCase.d.ts.map