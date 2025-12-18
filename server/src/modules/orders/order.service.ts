import cartRepository from '../../infrastructure/repositories/cartRepository';
import orderRepository from '../../infrastructure/repositories/orderRepository';
import ghnService from '../../infrastructure/services/ghnService';

class OrderService {
  async checkout(input: {
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
  }) {
    let cartItems;
    let itemsPayload;
    
    // Nếu có items truyền vào trực tiếp (từ API mới), dùng items đó
    if (input.items && input.items.length > 0) {
      itemsPayload = input.items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
    } else {
      // Nếu không, lấy từ giỏ hàng (logic cũ)
      cartItems = await cartRepository.getItemsByUser(input.userId);
      if (!cartItems.length) {
        throw new Error('Giỏ hàng đang trống');
      }
      itemsPayload = cartItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price ?? 0,
      }));
    }

    const subtotal = itemsPayload.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    
    const shippingFee = input.shipping_fee || 0;
    const totalAmount = subtotal + shippingFee;

    // Tạo đơn hàng trong database
    const order = await orderRepository.createOrder({
      userId: input.userId,
      addressId: input.addressId || null,
      totalAmount,
      shippingFee,
      paymentMethod: input.paymentMethod,
      note: input.note,
      items: itemsPayload,
      recipientName: input.shipping_info?.recipient_name,
      recipientPhone: input.shipping_info?.recipient_phone,
      recipientAddress: input.shipping_info?.address,
      provinceId: input.shipping_info?.province_id,
      districtId: input.shipping_info?.district_id,
      wardCode: input.shipping_info?.ward_code,
    });

    // Tạo đơn hàng trên GHN nếu có đủ thông tin
    if (input.shipping_info) {
      try {
        console.log('Đang tạo đơn GHN với thông tin:', {
          to_name: input.shipping_info.recipient_name,
          to_phone: input.shipping_info.recipient_phone,
          to_address: input.shipping_info.address,
          to_ward_code: input.shipping_info.ward_code,
          to_district_id: input.shipping_info.district_id,
          weight: itemsPayload.reduce((sum, item) => sum + (item.quantity * 500), 0),
        });

        const ghnOrder = await ghnService.createOrder({
          to_name: input.shipping_info.recipient_name,
          to_phone: input.shipping_info.recipient_phone,
          to_address: input.shipping_info.address,
          to_ward_code: input.shipping_info.ward_code,
          to_district_id: input.shipping_info.district_id,
          weight: itemsPayload.reduce((sum, item) => sum + (item.quantity * 500), 0), // 500g mỗi sản phẩm
          service_id: 53320, // Service ID mặc định
          service_type_id: 2, // E-commerce delivery
          payment_type_id: input.paymentMethod === 'cod' ? 2 : 1,
          required_note: 'CHOXEMHANGKHONGTHU',
          items: itemsPayload.map((item) => ({
            name: `Product ${item.productId}`,
            quantity: item.quantity,
            price: item.price,
          })),
          cod_amount: input.paymentMethod === 'cod' ? totalAmount : 0,
          insurance_value: subtotal,
          note: input.note,
        });

        console.log('✅ Tạo đơn GHN thành công:', ghnOrder.order_code);

        // Cập nhật mã đơn GHN vào order
        await orderRepository.updateGHNOrderCode(order.id, ghnOrder.order_code);
        
        order.ghn_order_code = ghnOrder.order_code;
      } catch (ghnError: any) {
        console.error('❌ Lỗi tạo đơn GHN:', ghnError.response?.data || ghnError.message);
        // Không throw error để vẫn tạo được đơn hàng trong hệ thống
      }
    }

    // Xóa giỏ hàng sau khi đặt hàng thành công (chỉ nếu dùng giỏ hàng)
    if (!input.items) {
      await cartRepository.clear(input.userId);
    }

    return order;
  }

  listUserOrders(userId: number) {
    return orderRepository.listByUser(userId);
  }

  getOrderById(orderId: number, userId: number) {
    return orderRepository.findByIdWithItems(orderId);
  }

  updateOrderStatus(
    orderId: number,
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  ) {
    return orderRepository.updateStatus(orderId, status);
  }
}

const orderService = new OrderService();

export default orderService;

