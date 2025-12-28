import cartRepository from '../../infrastructure/repositories/cartRepositoryImpl';
import orderRepository from '../../infrastructure/repositories/orderRepositoryImpl';
import productRepository from '../../infrastructure/repositories/productRepositoryImpl';
import userRepository from '../../infrastructure/repositories/userRepositoryImpl';
import ghnService from '../../infrastructure/external-services/GHNServiceImpl';
import emailService from '../../infrastructure/external-services/EmailServiceImpl';

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
    console.log('🚀 ==== BẮT ĐẦU XỬ LÝ ĐƠN HÀNG ====');
    console.log('Input received:', JSON.stringify({
      userId: input.userId,
      paymentMethod: input.paymentMethod,
      hasShippingInfo: !!input.shipping_info,
      hasItems: !!(input.items && input.items.length > 0),
      shipping_info: input.shipping_info,
    }, null, 2));

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

    // Validate stock availability
    for (const item of itemsPayload) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ số lượng trong kho. Còn lại: ${product.stock_quantity}, yêu cầu: ${item.quantity}`);
      }
    }

    const subtotal = itemsPayload.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    
    const shippingFee = input.shipping_fee || 0;
    const totalAmount = subtotal + shippingFee;

    // Nếu có shipping_info thì phải tạo GHN trước, thành công mới lưu DB
    if (input.shipping_info) {
      try {
        // Lấy thông tin tên sản phẩm
        const productDetails = await Promise.all(
          itemsPayload.map(async (item) => {
            const product = await productRepository.findById(item.productId);
            return {
              name: product?.name || `Sản phẩm #${item.productId}`,
              quantity: item.quantity,
              price: parseInt(item.price.toString()),
            };
          })
        );

        // Xử lý COD: Nếu đơn hàng > 5 triệu hoặc > hạn mức GHN thì không thu COD
        const maxCodLimit = 5000000; // Hạn mức COD tối đa
        let codAmount = 0;
        let paymentTypeId = 1; // Người gửi trả phí
        if (input.paymentMethod === 'cod' && totalAmount <= maxCodLimit) {
          codAmount = totalAmount;
          paymentTypeId = 2; // Người nhận trả phí (COD)
        }

        const ghnResult = await ghnService.createOrderAsync({
          paymentTypeId: paymentTypeId,
          note: input.note || '',
          requiredNote: 'KHONGCHOXEMHANG',
          fromName: 'nhathuy',
          fromPhone: '0376911677',
          fromAddress: 'Trà Vinh',
          fromWardName: 'Phường 6',
          fromDistrictName: 'Thành phố Trà Vinh',
          fromProvinceName: 'Trà Vinh',
          toName: input.shipping_info.recipient_name,
          toPhone: input.shipping_info.recipient_phone,
          toAddress: input.shipping_info.address,
          toWardCode: input.shipping_info.ward_code,
          toDistrictId: input.shipping_info.district_id,
          weight: itemsPayload.reduce((sum, item) => sum + (item.quantity * 500), 0),
          length: 15,
          width: 15,
          height: 10,
          serviceId: 53320,
          serviceTypeId: 2,
          codAmount: codAmount,
          insuranceValue: subtotal > 5000000 ? 5000000 : subtotal,
          content: 'Dụng cụ câu cá',
          items: productDetails,
        });

        if (!ghnResult.success || !ghnResult.data) {
          throw new Error('Không thể tạo đơn hàng trên GHN: ' + (ghnResult.message || 'Unknown error'));
        }

        // Nếu thành công, mới tạo đơn trong DB
        const order = await orderRepository.createOrder({
          userId: input.userId,
          addressId: input.addressId || null,
          totalAmount,
          shippingFee,
          paymentMethod: input.paymentMethod,
          ...(input.note && { note: input.note }),
          items: itemsPayload,
          recipientName: input.shipping_info?.recipient_name,
          recipientPhone: input.shipping_info?.recipient_phone,
          recipientAddress: input.shipping_info?.address,
          provinceId: input.shipping_info?.province_id,
          districtId: input.shipping_info?.district_id,
          wardCode: input.shipping_info?.ward_code,
        });

        // Cập nhật mã đơn GHN vào order
        await orderRepository.updateGHNOrderCode(order.id, ghnResult.data.order_code);
        order.ghn_order_code = ghnResult.data.order_code;

        // Gửi email thông báo đơn hàng mới
        try {
          const user = await userRepository.findById(input.userId);
          if (user && user.email) {
            await emailService.sendOrderConfirmationToCustomer({
              customerEmail: user.email,
              customerName: user.full_name || input.shipping_info?.recipient_name || 'Khách hàng',
              orderNumber: order.id.toString(),
              orderDate: order.created_at || new Date(),
              items: productDetails,
              subtotal: subtotal,
              shippingFee: shippingFee,
              total: totalAmount,
              paymentMethod: input.paymentMethod,
              shippingAddress: input.shipping_info ? `${input.shipping_info.address}` : 'Chưa có thông tin',
              ghnOrderCode: order.ghn_order_code || '',
            });
            console.log('✅ Đã gửi email xác nhận đến khách hàng:', user.email);
          }
          await emailService.sendNewOrderNotificationToAdmin({
            orderNumber: order.id.toString(),
            orderDate: order.created_at || new Date(),
            customerName: user?.full_name || input.shipping_info?.recipient_name || 'Khách hàng',
            customerEmail: user?.email || 'Không có',
            customerPhone: input.shipping_info?.recipient_phone || 'Không có',
            items: productDetails,
            subtotal: subtotal,
            shippingFee: shippingFee,
            total: totalAmount,
            paymentMethod: input.paymentMethod,
            shippingAddress: input.shipping_info ? `${input.shipping_info.address}` : 'Chưa có thông tin',
            ghnOrderCode: order.ghn_order_code || '',
          });
          console.log('✅ Đã gửi email thông báo đến admin');
        } catch (emailError: any) {
          console.error('⚠️ Lỗi gửi email (không ảnh hưởng đơn hàng):', emailError.message);
        }

        // Xóa giỏ hàng sau khi đặt hàng thành công (chỉ nếu dùng giỏ hàng)
        if (!input.items) {
          await cartRepository.clear(input.userId);
        }

        return order;
      } catch (err) {
        // Nếu lỗi GHN thì trả lỗi cho frontend, không lưu đơn
        throw err;
      }
    } else {
      // Trường hợp không có shipping_info (logic cũ, không tạo GHN)
      const order = await orderRepository.createOrder({
        userId: input.userId,
        addressId: input.addressId || null,
        totalAmount,
        shippingFee,
        paymentMethod: input.paymentMethod,
        ...(input.note && { note: input.note }),
        items: itemsPayload,
      });
      if (!input.items) {
        await cartRepository.clear(input.userId);
      }
      return order;
    }
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

  async confirmPayment(orderId: number, userId: number) {
    // Lấy thông tin đơn hàng
    const order = await orderRepository.findByIdWithItems(orderId);
    
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.user_id !== userId) {
      throw new Error('Bạn không có quyền xác nhận đơn hàng này');
    }

    if (order.status === 'paid' || order.status === 'completed') {
      throw new Error('Đơn hàng đã được thanh toán');
    }

    // Cập nhật trạng thái đơn hàng thành paid
    await orderRepository.updateStatus(orderId, 'paid');

    // Giảm số lượng tồn kho cho từng sản phẩm
    for (const item of order.items) {
      const product = await productRepository.findById(item.product_id);
      if (product) {
        const newStock = product.stock_quantity - item.quantity;
        await productRepository.update(item.product_id, { stock_quantity: newStock });
        
        // Nếu hết hàng, cập nhật trạng thái sản phẩm
        if (newStock <= 0) {
          await productRepository.update(item.product_id, { status: 'inactive' });
        }
      }
    }

    // Xóa giỏ hàng của người dùng (các sản phẩm đã thanh toán)
    await cartRepository.clear(userId);

    // Gửi email xác nhận thanh toán
    try {
      const user = await userRepository.findById(userId);
      if (user && user.email) {
        await emailService.sendOrderConfirmationToCustomer({
          orderNumber: order.id.toString(),
          orderDate: order.created_at,
          customerName: user.full_name || 'Khách hàng',
          items: order.items.map(item => ({
            name: item.product_name || `Sản phẩm #${item.product_id}`,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: order.total_amount - (order.shipping_fee || 0),
          shippingFee: order.shipping_fee || 0,
          total: order.total_amount,
          paymentMethod: order.payment_method,
          shippingAddress: order.recipient_address || 'N/A',
          ghnOrderCode: order.ghn_order_code || '',
          customerEmail: user.email,
        });
      }
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
      // Don't fail the payment if email fails
    }

    return {
      order_id: orderId,
      status: 'paid',
      message: 'Thanh toán thành công. Giỏ hàng đã được xóa và tồn kho đã được cập nhật.',
    };
  }
}

const orderService = new OrderService();

export default orderService;

