interface GHNProvince {
    ProvinceID: number;
    ProvinceName: string;
    Code: string;
}
interface GHNDistrict {
    DistrictID: number;
    DistrictName: string;
    ProvinceID: number;
}
interface GHNWard {
    WardCode: string;
    WardName: string;
    DistrictID: number;
}
interface AvailableService {
    service_id: number;
    short_name: string;
    service_type_id: number;
}
interface GHNResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}
interface GetDistrictRequest {
    provinceId: number;
}
interface GetWardRequest {
    districtId: number;
}
interface CalculateFeeRequest {
    serviceId: number;
    serviceTypeId: number;
    toDistrictId: number;
    toWardCode: string;
    height: number;
    length: number;
    weight: number;
    width: number;
    insuranceValue?: number;
    codFailedAmount?: number;
    coupon?: string | null;
}
interface GetServiceRequest {
    fromDistrict: number;
    toDistrict: number;
}
interface GetLeadTimeRequest {
    fromDistrictId: number;
    fromWardCode: string;
    toDistrictId: number;
    toWardCode: string;
    serviceId: number;
}
interface CreateOrderRequest {
    paymentTypeId: number;
    note?: string;
    requiredNote?: string;
    fromName: string;
    fromPhone: string;
    fromAddress: string;
    fromWardName: string;
    fromDistrictName: string;
    fromProvinceName: string;
    toName: string;
    toPhone: string;
    toAddress: string;
    toWardCode: string;
    toDistrictId: number;
    codAmount?: number;
    content?: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    pickStationId?: number | null;
    deliverStationId?: number | null;
    insuranceValue?: number;
    serviceId: number;
    serviceTypeId: number;
    coupon?: string | null;
    pickShift?: number[];
    items?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}
interface GetOrderInfoRequest {
    orderCode: string;
}
interface CancelOrderRequest {
    orderCodes: string[];
}
interface UpdateCODRequest {
    orderCode: string;
    codAmount: number;
}
interface PreviewOrderRequest {
    paymentTypeId: number;
    requiredNote?: string;
    fromName: string;
    fromPhone: string;
    fromAddress: string;
    fromWardName: string;
    fromDistrictName: string;
    fromProvinceName: string;
    toName: string;
    toPhone: string;
    toAddress: string;
    toWardCode: string;
    toDistrictId: number;
    codAmount: number;
    content: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    serviceId: number;
    serviceTypeId: number;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}
interface CreateTicketRequest {
    orderCode: string;
    category: string;
    description: string;
    cEmail?: string;
    attachments?: string[];
}
declare class GHNService {
    private baseUrl;
    private token;
    private shopId;
    private client;
    constructor();
    /**
     * Helper để tạo headers đúng cho từng loại API
     * GHN API có sự không nhất quán về format header:
     * - Master Data: Token (chữ hoa)
     * - Get Service: token (chữ thường)
     * - Order APIs: Token (chữ hoa) + ShopId
     * - Return Order: token (chữ thường) + shop_id (chữ thường)
     */
    private getHeaders;
    /**
     * Get all provinces from GHN API
     */
    getProvinceAsync(): Promise<GHNResponse<GHNProvince[]>>;
    /**
     * Get districts by province ID from GHN API
     */
    getDistrictAsync(request: GetDistrictRequest): Promise<GHNResponse<GHNDistrict[]>>;
    /**
     * Get wards by district ID from GHN API
     */
    getWardAsync(request: GetWardRequest): Promise<GHNResponse<GHNWard[]>>;
    /**
     * Calculate shipping fee using GHN API
     */
    calculateFeeAsync(request: CalculateFeeRequest): Promise<GHNResponse<any>>;
    /**
     * Get available services for shipping route
     */
    getServiceAsync(request: GetServiceRequest): Promise<GHNResponse<AvailableService[]>>;
    /**
     * Get lead time for shipping route
     */
    getLeadTimeAsync(request: GetLeadTimeRequest): Promise<GHNResponse<any>>;
    /**
     * Create shipping order on GHN
     */
    createOrderAsync(request: CreateOrderRequest): Promise<GHNResponse<any>>;
    /**
     * Get order info from GHN
     */
    getOrderInfoAsync(request: GetOrderInfoRequest): Promise<GHNResponse<any>>;
    /**
     * Cancel order on GHN
     */
    cancelOrder(request: CancelOrderRequest): Promise<GHNResponse<any>>;
    /**
     * Update COD amount for an order
     */
    updateCODAsync(request: UpdateCODRequest): Promise<GHNResponse<any>>;
    /**
     * Preview order before creating (get estimated fee and time)
     */
    previewOrderAsync(request: PreviewOrderRequest): Promise<GHNResponse<any>>;
    /**
     * Get pick shift dates (ca lấy hàng)
     */
    getPickShiftAsync(): Promise<GHNResponse<any>>;
    /**
     * Create support ticket for order
     */
    createTicketAsync(request: CreateTicketRequest): Promise<GHNResponse<any>>;
    /**
     * Get order info by client order code
     */
    getOrderByClientCodeAsync(clientOrderCode: string): Promise<GHNResponse<any>>;
}
declare const _default: GHNService;
export default _default;
//# sourceMappingURL=GHNServiceImpl.d.ts.map