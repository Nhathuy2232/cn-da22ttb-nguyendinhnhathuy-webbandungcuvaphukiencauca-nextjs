"use strict";
/**
 * Use Case: Tạo đơn hàng mới
 * Xử lý toàn bộ quy trình tạo đơn hàng, tích hợp GHN và gửi email
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderUseCase = void 0;
class CreateOrderUseCase {
    orderRepository;
    productRepository;
    ghnService;
    emailService;
    constructor(orderRepository, productRepository, ghnService, emailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.ghnService = ghnService;
        this.emailService = emailService;
    }
    async execute(dto) {
        // 1. Kiểm tra tồn kho cho tất cả sản phẩm
        const itemsWithPrice = await Promise.all(dto.items.map(async (item) => {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new Error(`Sản phẩm ID ${item.productId} không tồn tại`);
            }
            const hasStock = await this.productRepository.checkStock(item.productId, item.quantity);
            if (!hasStock) {
                throw new Error(`Sản phẩm "${product.name}" không đủ số lượng`);
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                name: product.name,
            };
        }));
        // 2. Tính tổng tiền
        const subtotal = itemsWithPrice.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // 3. Tính phí vận chuyển từ GHN
        const shippingFeeResponse = await this.ghnService.calculateFeeAsync({
            serviceId: 53320,
            toDistrictId: dto.shippingInfo.districtId,
            toWardCode: dto.shippingInfo.wardCode,
            weight: itemsWithPrice.reduce((sum, item) => sum + item.quantity * 500, 0),
        });
        if (!shippingFeeResponse.success || !shippingFeeResponse.data) {
            throw new Error('Không thể tính phí vận chuyển');
        }
        const shippingFee = shippingFeeResponse.data.total;
        const totalAmount = subtotal + shippingFee;
        // 4. Tạo đơn hàng trên GHN
        const ghnOrderResponse = await this.ghnService.createOrderAsync({
            paymentTypeId: dto.paymentMethod === 'cod' ? 2 : 1,
            note: dto.note || '',
            requiredNote: 'KHONGCHOXEMHANG',
            fromName: 'Shop Câu Cá',
            fromPhone: '0376911677',
            fromAddress: 'Trà Vinh',
            fromWardName: 'Phường 6',
            fromDistrictName: 'Thành phố Trà Vinh',
            fromProvinceName: 'Trà Vinh',
            toName: dto.shippingInfo.recipientName,
            toPhone: dto.shippingInfo.recipientPhone,
            toAddress: dto.shippingInfo.address,
            toWardCode: dto.shippingInfo.wardCode,
            toDistrictId: dto.shippingInfo.districtId,
            weight: itemsWithPrice.reduce((sum, item) => sum + item.quantity * 500, 0),
            length: 15,
            width: 15,
            height: 10,
            serviceId: 53320,
            serviceTypeId: 2,
            codAmount: dto.paymentMethod === 'cod' ? totalAmount : 0,
            insuranceValue: subtotal > 5000000 ? 5000000 : subtotal,
            items: itemsWithPrice.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        });
        if (!ghnOrderResponse.success || !ghnOrderResponse.data) {
            throw new Error(`Không thể tạo đơn hàng GHN: ${ghnOrderResponse.message}`);
        }
        // 5. Lưu đơn hàng vào database
        const orderData = {
            userId: dto.userId,
            totalAmount,
            shippingFee,
            paymentMethod: dto.paymentMethod,
            items: itemsWithPrice,
            recipientName: dto.shippingInfo.recipientName,
            recipientPhone: dto.shippingInfo.recipientPhone,
            recipientAddress: dto.shippingInfo.address,
            provinceId: dto.shippingInfo.provinceId,
            districtId: dto.shippingInfo.districtId,
            wardCode: dto.shippingInfo.wardCode,
            ...(dto.note && { note: dto.note }),
        };
        const order = await this.orderRepository.createOrder(orderData);
        // 6. Cập nhật mã đơn GHN
        await this.orderRepository.updateGHNOrderCode(order.id, ghnOrderResponse.data.order_code);
        // 7. Cập nhật tồn kho
        await Promise.all(itemsWithPrice.map((item) => this.productRepository.updateStock(item.productId, -item.quantity)));
        // 8. Gửi email xác nhận
        try {
            await this.emailService.sendOrderConfirmationToCustomer({
                customerEmail: dto.shippingInfo.recipientName, // TODO: Get from user
                orderNumber: order.id.toString(),
                orderDate: order.createdAt,
                customerName: dto.shippingInfo.recipientName,
                items: itemsWithPrice,
                subtotal,
                shippingFee,
                total: totalAmount,
                paymentMethod: dto.paymentMethod,
                shippingAddress: dto.shippingInfo.address,
                ghnOrderCode: ghnOrderResponse.data.order_code,
            });
        }
        catch (error) {
            console.error('Lỗi gửi email:', error);
            // Không throw error vì đơn hàng đã được tạo thành công
        }
        return order;
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
//# sourceMappingURL=CreateOrderUseCase.js.map