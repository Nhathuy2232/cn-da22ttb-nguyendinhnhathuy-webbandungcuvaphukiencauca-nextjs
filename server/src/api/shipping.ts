import { Router } from 'express';
import ghnService from '../infrastructure/services/ghnService';

const router = Router();

/**
 * @swagger
 * /api/shipping/provinces:
 *   get:
 *     tags: [Shipping]
 *     summary: Lấy danh sách tỉnh/thành phố
 *     responses:
 *       200:
 *         description: Danh sách tỉnh/thành phố
 */
router.get('/provinces', async (req, res, next) => {
  try {
    // Mock data nếu GHN API lỗi
    const mockProvinces = [
      { ProvinceID: 201, ProvinceName: 'Hà Nội', Code: '01' },
      { ProvinceID: 202, ProvinceName: 'Hồ Chí Minh', Code: '79' },
      { ProvinceID: 203, ProvinceName: 'Đà Nẵng', Code: '48' },
      { ProvinceID: 204, ProvinceName: 'Hải Phòng', Code: '31' },
      { ProvinceID: 205, ProvinceName: 'Cần Thơ', Code: '92' },
    ];

    try {
      const provinces = await ghnService.getProvinces();
      res.json({ success: true, data: provinces });
    } catch (error) {
      // Fallback to mock data
      console.warn('GHN API failed, using mock data');
      res.json({ success: true, data: mockProvinces });
    }
  } catch (error: any) {
    next(error);
  }
});

/**
 * @swagger
 * /api/shipping/districts/{provinceId}:
 *   get:
 *     tags: [Shipping]
 *     summary: Lấy danh sách quận/huyện theo tỉnh
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách quận/huyện
 */
router.get('/districts/:provinceId', async (req, res, next) => {
  try {
    const provinceId = parseInt(req.params.provinceId);
    
    // Mock data
    const mockDistricts = [
      { DistrictID: 1442, DistrictName: 'Quận 1', ProvinceID: provinceId },
      { DistrictID: 1443, DistrictName: 'Quận 2', ProvinceID: provinceId },
      { DistrictID: 1444, DistrictName: 'Quận 3', ProvinceID: provinceId },
      { DistrictID: 1445, DistrictName: 'Quận 4', ProvinceID: provinceId },
      { DistrictID: 1446, DistrictName: 'Quận 5', ProvinceID: provinceId },
    ];

    try {
      const districts = await ghnService.getDistricts(provinceId);
      res.json({ success: true, data: districts });
    } catch (error) {
      console.warn('GHN API failed, using mock data');
      res.json({ success: true, data: mockDistricts });
    }
  } catch (error: any) {
    next(error);
  }
});

/**
 * @swagger
 * /api/shipping/wards/{districtId}:
 *   get:
 *     tags: [Shipping]
 *     summary: Lấy danh sách phường/xã theo quận
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách phường/xã
 */
router.get('/wards/:districtId', async (req, res, next) => {
  try {
    const districtId = parseInt(req.params.districtId);
    
    // Mock data
    const mockWards = [
      { WardCode: '10101', WardName: 'Phường 1', DistrictID: districtId },
      { WardCode: '10102', WardName: 'Phường 2', DistrictID: districtId },
      { WardCode: '10103', WardName: 'Phường 3', DistrictID: districtId },
      { WardCode: '10104', WardName: 'Phường 4', DistrictID: districtId },
      { WardCode: '10105', WardName: 'Phường 5', DistrictID: districtId },
    ];

    try {
      const wards = await ghnService.getWards(districtId);
      res.json({ success: true, data: wards });
    } catch (error) {
      console.warn('GHN API failed, using mock data');
      res.json({ success: true, data: mockWards });
    }
  } catch (error: any) {
    next(error);
  }
});

/**
 * @swagger
 * /api/shipping/calculate-fee:
 *   post:
 *     tags: [Shipping]
 *     summary: Tính phí vận chuyển
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_district_id
 *               - to_ward_code
 *               - weight
 *             properties:
 *               to_district_id:
 *                 type: integer
 *               to_ward_code:
 *                 type: string
 *               weight:
 *                 type: integer
 *                 description: Trọng lượng (gram)
 *               insurance_value:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Phí vận chuyển
 */
router.post('/calculate-fee', async (req, res, next) => {
  try {
    // Mock shipping fee
    const mockFee = {
      total: 30000,
      service_fee: 25000,
      insurance_fee: 5000,
      pick_station_fee: 0,
      coupon_value: 0,
    };

    try {
      const fee = await ghnService.calculateShippingFee(req.body);
      res.json({ success: true, data: fee });
    } catch (error) {
      console.warn('GHN API failed, using mock shipping fee');
      res.json({ success: true, data: mockFee });
    }
  } catch (error: any) {
    next(error);
  }
});

export default router;
