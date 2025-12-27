"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GHNServiceImpl_1 = __importDefault(require("../../../infrastructure/external-services/GHNServiceImpl"));
const router = (0, express_1.Router)();
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
        const result = await GHNServiceImpl_1.default.getProvinceAsync();
        if (result.success) {
            res.json(result);
        }
        else {
            // Fallback to mock data
            console.warn('GHN API failed, using mock data');
            res.json({ success: true, data: mockProvinces, message: 'Using mock data' });
        }
    }
    catch (error) {
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
        const result = await GHNServiceImpl_1.default.getDistrictAsync({ provinceId });
        if (result.success) {
            res.json(result);
        }
        else {
            console.warn('GHN API failed, using mock data');
            res.json({ success: true, data: mockDistricts, message: 'Using mock data' });
        }
    }
    catch (error) {
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
        const result = await GHNServiceImpl_1.default.getWardAsync({ districtId });
        if (result.success) {
            res.json(result);
        }
        else {
            console.warn('GHN API failed, using mock data');
            res.json({ success: true, data: mockWards, message: 'Using mock data' });
        }
    }
    catch (error) {
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
/**
 * @swagger
 * /api/shipping/available-services:
 *   post:
 *     tags: [Shipping]
 *     summary: Lấy danh sách dịch vụ vận chuyển khả dụng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from_district
 *               - to_district
 *             properties:
 *               from_district:
 *                 type: integer
 *               to_district:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Danh sách dịch vụ vận chuyển
 */
router.post('/available-services', async (req, res, next) => {
    try {
        const { from_district, to_district } = req.body;
        if (!from_district || !to_district) {
            return res.status(400).json({
                success: false,
                message: 'from_district và to_district là bắt buộc'
            });
        }
        const result = await GHNServiceImpl_1.default.getServiceAsync({ fromDistrict: from_district, toDistrict: to_district });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
router.post('/calculate-fee', async (req, res, next) => {
    try {
        const { serviceId, serviceTypeId, toDistrictId, toWardCode, height, length, weight, width, insuranceValue, codFailedAmount, coupon, } = req.body;
        if (!toDistrictId || !toWardCode || !weight) {
            return res.status(400).json({
                success: false,
                message: 'toDistrictId, toWardCode và weight là bắt buộc',
            });
        }
        const result = await GHNServiceImpl_1.default.calculateFeeAsync({
            serviceId: serviceId || 53320,
            serviceTypeId: serviceTypeId || 2,
            toDistrictId,
            toWardCode,
            height: height || 15,
            length: length || 15,
            weight,
            width: width || 15,
            insuranceValue: insuranceValue || 0,
            codFailedAmount: codFailedAmount || 0,
            coupon: coupon || null,
        });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/leadtime:
 *   post:
 *     tags: [Shipping]
 *     summary: Lấy thời gian dự kiến giao hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from_district_id
 *               - from_ward_code
 *               - to_district_id
 *               - to_ward_code
 *               - service_id
 *             properties:
 *               from_district_id:
 *                 type: integer
 *               from_ward_code:
 *                 type: string
 *               to_district_id:
 *                 type: integer
 *               to_ward_code:
 *                 type: string
 *               service_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thời gian dự kiến giao hàng
 */
router.post('/leadtime', async (req, res, next) => {
    try {
        const { fromDistrictId, fromWardCode, toDistrictId, toWardCode, serviceId, } = req.body;
        if (!fromDistrictId || !fromWardCode || !toDistrictId || !toWardCode || !serviceId) {
            return res.status(400).json({
                success: false,
                message: 'fromDistrictId, fromWardCode, toDistrictId, toWardCode và serviceId là bắt buộc',
            });
        }
        const result = await GHNServiceImpl_1.default.getLeadTimeAsync({
            fromDistrictId,
            fromWardCode,
            toDistrictId,
            toWardCode,
            serviceId,
        });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/create-order:
 *   post:
 *     tags: [Shipping]
 *     summary: Tạo đơn hàng vận chuyển
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_name
 *               - to_phone
 *               - to_address
 *               - to_ward_code
 *               - to_district_id
 *               - weight
 *               - payment_type_id
 *               - items
 *             properties:
 *               to_name:
 *                 type: string
 *               to_phone:
 *                 type: string
 *               to_address:
 *                 type: string
 *               to_ward_code:
 *                 type: string
 *               to_district_id:
 *                 type: integer
 *               weight:
 *                 type: integer
 *               payment_type_id:
 *                 type: integer
 *               items:
 *                 type: array
 *     responses:
 *       200:
 *         description: Đơn hàng đã được tạo
 */
router.post('/create-order', async (req, res, next) => {
    try {
        const result = await GHNServiceImpl_1.default.createOrderAsync(req.body);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/order/{orderCode}:
 *   get:
 *     tags: [Shipping]
 *     summary: Lấy thông tin đơn hàng
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 */
router.get('/order/:orderCode', async (req, res, next) => {
    try {
        const { orderCode } = req.params;
        const result = await GHNServiceImpl_1.default.getOrderInfoAsync({ orderCode });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/cancel-order:
 *   post:
 *     tags: [Shipping]
 *     summary: Hủy đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_codes
 *             properties:
 *               order_codes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Đơn hàng đã được hủy
 */
router.post('/cancel-order', async (req, res, next) => {
    try {
        const { order_codes } = req.body;
        if (!order_codes || !Array.isArray(order_codes) || order_codes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'order_codes là bắt buộc và phải là mảng không rỗng'
            });
        }
        const result = await GHNServiceImpl_1.default.cancelOrder({ orderCodes: order_codes });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/update-cod:
 *   post:
 *     tags: [Shipping]
 *     summary: Cập nhật giá trị COD của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_code
 *               - cod_amount
 *             properties:
 *               order_code:
 *                 type: string
 *               cod_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật COD thành công
 */
router.post('/update-cod', async (req, res, next) => {
    try {
        const { order_code, cod_amount } = req.body;
        if (!order_code || cod_amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'order_code và cod_amount là bắt buộc'
            });
        }
        const result = await GHNServiceImpl_1.default.updateCODAsync({
            orderCode: order_code,
            codAmount: cod_amount,
        });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/preview-order:
 *   post:
 *     tags: [Shipping]
 *     summary: Xem trước đơn hàng (tính phí, thời gian giao hàng dự kiến)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Thông tin preview đơn hàng
 */
router.post('/preview-order', async (req, res, next) => {
    try {
        const result = await GHNServiceImpl_1.default.previewOrderAsync(req.body);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/pick-shift:
 *   get:
 *     tags: [Shipping]
 *     summary: Lấy danh sách ca lấy hàng
 *     responses:
 *       200:
 *         description: Danh sách ca lấy hàng
 */
router.get('/pick-shift', async (req, res, next) => {
    try {
        const result = await GHNServiceImpl_1.default.getPickShiftAsync();
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/create-ticket:
 *   post:
 *     tags: [Shipping]
 *     summary: Tạo ticket hỗ trợ cho đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_code
 *               - category
 *               - description
 *             properties:
 *               order_code:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               c_email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket đã được tạo
 */
router.post('/create-ticket', async (req, res, next) => {
    try {
        const { order_code, category, description, c_email, attachments } = req.body;
        if (!order_code || !category || !description) {
            return res.status(400).json({
                success: false,
                message: 'order_code, category và description là bắt buộc'
            });
        }
        const result = await GHNServiceImpl_1.default.createTicketAsync({
            orderCode: order_code,
            category,
            description,
            cEmail: c_email,
            attachments,
        });
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/order-by-client-code:
 *   post:
 *     tags: [Shipping]
 *     summary: Lấy thông tin đơn hàng theo mã client order code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_order_code
 *             properties:
 *               client_order_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 */
router.post('/order-by-client-code', async (req, res, next) => {
    try {
        const { client_order_code } = req.body;
        if (!client_order_code) {
            return res.status(400).json({
                success: false,
                message: 'client_order_code là bắt buộc'
            });
        }
        const result = await GHNServiceImpl_1.default.getOrderByClientCodeAsync(client_order_code);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /api/shipping/webhook/order-status:
 *   post:
 *     tags: [Shipping]
 *     summary: Webhook nhận thông báo cập nhật trạng thái đơn hàng từ GHN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook đã được xử lý
 */
router.post('/webhook/order-status', async (req, res, next) => {
    try {
        console.log('📦 GHN Webhook - Order Status Update:', JSON.stringify(req.body, null, 2));
        // Xử lý webhook từ GHN
        const webhookData = req.body;
        // TODO: Cập nhật trạng thái đơn hàng trong database
        // TODO: Gửi email/notification cho khách hàng
        // GHN yêu cầu response code 200
        res.status(200).json({
            success: true,
            message: 'Webhook received'
        });
    }
    catch (error) {
        console.error('❌ Error processing webhook:', error);
        // Vẫn trả về 200 để GHN không retry
        res.status(200).json({
            success: false,
            message: 'Error processing webhook'
        });
    }
});
/**
 * @swagger
 * /api/shipping/webhook/ticket:
 *   post:
 *     tags: [Shipping]
 *     summary: Webhook nhận phản hồi ticket từ GHN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook đã được xử lý
 */
router.post('/webhook/ticket', async (req, res, next) => {
    try {
        console.log('🎫 GHN Webhook - Ticket Update:', JSON.stringify(req.body, null, 2));
        // Xử lý webhook từ GHN
        const webhookData = req.body;
        // TODO: Xử lý phản hồi ticket
        // TODO: Gửi thông báo cho admin
        res.status(200).json({
            success: true,
            message: 'Webhook received'
        });
    }
    catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(200).json({
            success: false,
            message: 'Error processing webhook'
        });
    }
});
exports.default = router;
//# sourceMappingURL=shippingRoutes.js.map