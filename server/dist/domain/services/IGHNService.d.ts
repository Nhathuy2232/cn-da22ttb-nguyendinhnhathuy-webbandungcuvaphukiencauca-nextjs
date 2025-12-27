/**
 * Interface Service Giao Hàng Nhanh (GHN)
 * Định nghĩa các phương thức tích hợp với API GHN
 */
export interface GHNProvince {
    ProvinceID: number;
    ProvinceName: string;
    Code: string;
}
export interface GHNDistrict {
    DistrictID: number;
    DistrictName: string;
    ProvinceID: number;
}
export interface GHNWard {
    WardCode: string;
    WardName: string;
    DistrictID: number;
}
export interface GHNResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
}
export interface CreateGHNOrderRequest {
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
    serviceId: number;
    serviceTypeId: number;
    insuranceValue?: number;
    items?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}
export interface IGHNService {
    /**
     * Lấy danh sách tỉnh/thành phố
     */
    getProvinceAsync(): Promise<GHNResponse<GHNProvince[]>>;
    /**
     * Lấy danh sách quận/huyện theo tỉnh
     */
    getDistrictAsync(provinceId: number): Promise<GHNResponse<GHNDistrict[]>>;
    /**
     * Lấy danh sách phường/xã theo quận
     */
    getWardAsync(districtId: number): Promise<GHNResponse<GHNWard[]>>;
    /**
     * Tính phí vận chuyển
     */
    calculateFeeAsync(params: {
        serviceId: number;
        toDistrictId: number;
        toWardCode: string;
        weight: number;
    }): Promise<GHNResponse<any>>;
    /**
     * Lấy danh sách dịch vụ vận chuyển khả dụng
     */
    getServiceAsync(fromDistrict: number, toDistrict: number): Promise<GHNResponse<any>>;
    /**
     * Tạo đơn hàng trên hệ thống GHN
     */
    createOrderAsync(request: CreateGHNOrderRequest): Promise<GHNResponse<any>>;
    /**
     * Lấy thông tin đơn hàng từ GHN
     */
    getOrderInfoAsync(orderCode: string): Promise<GHNResponse<any>>;
    /**
     * Hủy đơn hàng trên GHN
     */
    cancelOrder(orderCodes: string[]): Promise<GHNResponse<any>>;
}
//# sourceMappingURL=IGHNService.d.ts.map