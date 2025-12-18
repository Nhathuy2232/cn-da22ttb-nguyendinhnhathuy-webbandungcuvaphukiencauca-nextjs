import axios, { AxiosInstance } from 'axios';
import env from '../../config/env';

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

interface ShippingFeeRequest {
  service_id?: number;
  service_type_id?: number;
  to_district_id: number;
  to_ward_code: string;
  weight: number; // gram
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  insurance_value?: number;
  coupon?: string;
}

interface ShippingFeeResponse {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
}

interface CreateOrderRequest {
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string;
  to_district_id: number;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  service_id?: number;
  service_type_id?: number;
  payment_type_id: number; // 1: Người gửi trả, 2: Người nhận trả
  required_note?: string; // CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  cod_amount?: number; // Tiền thu hộ
  insurance_value?: number;
  note?: string;
}

interface CreateOrderResponse {
  order_code: string;
  sort_code: string;
  trans_type: string;
  ward_encode: string;
  district_encode: string;
  fee: {
    main_service: number;
    insurance: number;
    station_do: number;
    station_pu: number;
    return: number;
    r2s: number;
    return_again: number;
    coupon: number;
    document_return: number;
    double_check: number;
    cod_fee: number;
    pick_remote_areas_fee: number;
    deliver_remote_areas_fee: number;
    cod_failed_fee: number;
  };
  total_fee: number;
  expected_delivery_time: string;
}

class GHNService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.ghn.apiUrl,
      headers: {
        'token': env.ghn.token,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Lấy danh sách tỉnh/thành phố
   */
  async getProvinces(): Promise<GHNProvince[]> {
    const response = await this.client.get('/master-data/province');
    return response.data.data;
  }

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   */
  async getDistricts(provinceId: number): Promise<GHNDistrict[]> {
    const response = await this.client.get('/master-data/district', {
      params: { province_id: provinceId },
    });
    return response.data.data;
  }

  /**
   * Lấy danh sách phường/xã theo quận
   */
  async getWards(districtId: number): Promise<GHNWard[]> {
    const response = await this.client.get('/master-data/ward', {
      params: { district_id: districtId },
    });
    return response.data.data;
  }

  /**
   * Tính phí vận chuyển
   */
  async calculateShippingFee(request: ShippingFeeRequest): Promise<ShippingFeeResponse> {
    const response = await this.client.post('/v2/shipping-order/fee', {
      service_id: request.service_id || 53320,
      service_type_id: request.service_type_id || 2,
      to_district_id: request.to_district_id,
      to_ward_code: request.to_ward_code,
      weight: request.weight,
      length: request.length,
      width: request.width,
      height: request.height,
      insurance_value: request.insurance_value,
      coupon: request.coupon,
    }, {
      headers: { 'ShopId': env.ghn.shopId.toString() },
    });
    return response.data.data;
  }

  /**
   * Tạo đơn hàng GHN
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const payload = {
      payment_type_id: request.payment_type_id,
      note: request.note || '',
      required_note: request.required_note || 'CHOXEMHANGKHONGTHU',
      
      // Thông tin người gửi
      from_name: "Fishing Shop",
      from_phone: "0999999999",
      from_address: "Trà Vinh",
      from_ward_name: "Phường 6",
      from_district_name: "Thành phố Trà Vinh",
      from_province_name: "Trà Vinh",
      
      // Thông tin người nhận
      to_name: request.to_name,
      to_phone: request.to_phone,
      to_address: request.to_address,
      to_ward_code: request.to_ward_code,
      to_district_id: request.to_district_id,
      
      // Thông tin đơn hàng
      cod_amount: request.cod_amount || 0,
      content: 'Dụng cụ câu cá',
      weight: request.weight,
      length: request.length || 15,
      width: request.width || 15,
      height: request.height || 10,
      
      // Dịch vụ
      service_id: request.service_id,
      service_type_id: request.service_type_id || 2,
      insurance_value: request.insurance_value || 0,
      
      // Thông tin khác
      pick_shift: [2],
      items: request.items,
    };
    
    console.log('📦 Payload tạo đơn GHN:', JSON.stringify(payload, null, 2));
    
    const response = await this.client.post('/v2/shipping-order/create', payload, {
      headers: { 'ShopId': env.ghn.shopId.toString() },
    });
    
    console.log('📦 Response từ GHN:', JSON.stringify(response.data, null, 2));
    
    return response.data.data;
  }

  /**
   * Lấy thông tin đơn hàng
   */
  async getOrderInfo(orderCode: string) {
    const response = await this.client.post('/v2/shipping-order/detail', {
      order_code: orderCode,
    });
    return response.data.data;
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderCodes: string[]) {
    const response = await this.client.post('/v2/switch-status/cancel', {
      order_codes: orderCodes,
    });
    return response.data;
  }
}

export default new GHNService();
