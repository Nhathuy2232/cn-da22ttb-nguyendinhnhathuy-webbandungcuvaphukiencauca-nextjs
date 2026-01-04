import { Router, Request, Response, NextFunction } from 'express';
import couponRepository from '../../../infrastructure/repositories/couponRepositoryImpl';

const router = Router();

// Validate và tính toán giảm giá từ coupon
router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, orderValue } = req.body;

    if (typeof code !== 'string' || code.trim().length === 0 || orderValue === undefined || orderValue === null) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã giảm giá và giá trị đơn hàng',
      });
    }

    const orderValueNumber = Number(orderValue);
    if (!Number.isFinite(orderValueNumber) || orderValueNumber < 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá trị đơn hàng không hợp lệ',
      });
    }

    const validation = await couponRepository.validateCoupon(code.trim(), orderValueNumber);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const coupon = validation.coupon!;
    let discountAmount = 0;

    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderValueNumber * coupon.discount_value) / 100;
      // Áp dụng giảm tối đa nếu có
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      // fixed discount
      discountAmount = coupon.discount_value;
    }

    // Đảm bảo discount không vượt quá giá trị đơn hàng
    discountAmount = Math.min(discountAmount, orderValueNumber);

    res.json({
      success: true,
      data: {
        coupon_id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
        final_amount: orderValueNumber - discountAmount,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
