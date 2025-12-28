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
  fromDistrictId: number;
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

interface PickShiftRequest {
  // Không cần params, API tự động trả về
}

class GHNService {
  private baseUrl: string;
  private token: string;
  private shopId: string;
  private client: AxiosInstance;

  constructor() {
    this.baseUrl = env.ghn.baseUrl;
    this.token = env.ghn.token;
    this.shopId = env.ghn.shopId;

    if (!this.token) {
      console.warn('GHN_TOKEN is not set in environment variables');
    }

    // Base client không set token mặc định vì mỗi API yêu cầu format khác nhau
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Helper để tạo headers đúng cho từng loại API
   * GHN API có sự không nhất quán về format header:
   * - Master Data: Token (chữ hoa)
   * - Get Service: token (chữ thường)
   * - Order APIs: Token (chữ hoa) + ShopId
   * - Return Order: token (chữ thường) + shop_id (chữ thường)
   */
  private getHeaders(apiType: 'master-data' | 'get-service' | 'order' | 'return' = 'order') {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    switch (apiType) {
      case 'master-data':
        // Master Data API: chỉ cần Token (chữ hoa)
        headers['Token'] = this.token;
        break;
      case 'get-service':
        // Get Service API: sử dụng token (chữ thường)
        headers['token'] = this.token;
        break;
      case 'return':
        // Return Order API: sử dụng token (chữ thường) và shop_id (chữ thường)
        headers['token'] = this.token;
        headers['shop_id'] = this.shopId;
        break;
      case 'order':
      default:
        // Order APIs: sử dụng Token (chữ hoa) và ShopId
        headers['Token'] = this.token;
        headers['ShopId'] = this.shopId;
        break;
    }

    return headers;
  }

  /**
   * Get all provinces from GHN API
   */
  async getProvinceAsync(): Promise<GHNResponse<GHNProvince[]>> {
    try {
      const response = await this.client.get('/shiip/public-api/master-data/province', {
        headers: this.getHeaders('master-data'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getProvinceAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Get districts by province ID from GHN API
   */
  async getDistrictAsync(request: GetDistrictRequest): Promise<GHNResponse<GHNDistrict[]>> {
    try {
      const response = await this.client.get('/shiip/public-api/master-data/district', {
        params: {
          province_id: request.provinceId,
        },
        headers: this.getHeaders('master-data'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getDistrictAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Get wards by district ID from GHN API
   */
  async getWardAsync(request: GetWardRequest): Promise<GHNResponse<GHNWard[]>> {
    try {
      const response = await this.client.get('/shiip/public-api/master-data/ward', {
        params: {
          district_id: request.districtId,
        },
        headers: this.getHeaders('master-data'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getWardAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Calculate shipping fee using GHN API
   */
  async calculateFeeAsync(request: CalculateFeeRequest): Promise<GHNResponse<any>> {
    try {
      let serviceId = request.serviceId;
      let serviceTypeId = request.serviceTypeId;

      // If serviceId is not provided, get available services first
      if (!serviceId) {
        const serviceResponse = await this.getServiceAsync({
          fromDistrict: request.fromDistrictId,
          toDistrict: request.toDistrictId,
        });

        if (serviceResponse.success && serviceResponse.data && serviceResponse.data.length > 0 && serviceResponse.data[0]) {
          serviceId = serviceResponse.data[0].service_id;
          serviceTypeId = serviceResponse.data[0].service_type_id;
        } else {
          return {
            success: false,
            data: null,
            message: 'No available shipping service for this route',
          };
        }
      }

      const requestData = {
        service_id: serviceId,
        service_type_id: serviceTypeId,
        from_district_id: request.fromDistrictId,
        to_district_id: request.toDistrictId,
        to_ward_code: request.toWardCode,
        height: request.height,
        length: request.length,
        weight: request.weight,
        width: request.width,
        insurance_value: request.insuranceValue || 0,
        cod_failed_amount: request.codFailedAmount || 0,
        coupon: request.coupon || null,
      };

      const response = await this.client.post('/shiip/public-api/v2/shipping-order/fee', requestData, {
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN calculateFeeAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Get available services for shipping route
   */
  async getServiceAsync(request: GetServiceRequest): Promise<GHNResponse<AvailableService[]>> {
    try {
      const requestData = {
        shop_id: parseInt(this.shopId),
        from_district: request.fromDistrict,
        to_district: request.toDistrict,
      };

      const response = await this.client.post('/shiip/public-api/v2/shipping-order/available-services', requestData, {
        headers: this.getHeaders('get-service'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getServiceAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Get lead time for shipping route
   */
  async getLeadTimeAsync(request: GetLeadTimeRequest): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        from_district_id: request.fromDistrictId,
        from_ward_code: request.fromWardCode,
        to_district_id: request.toDistrictId,
        to_ward_code: request.toWardCode,
        service_id: request.serviceId,
      };

      const response = await this.client.post('/shiip/public-api/v2/shipping-order/leadtime', requestData, {
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getLeadTimeAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Create shipping order on GHN
   */
  async createOrderAsync(request: CreateOrderRequest): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        payment_type_id: request.paymentTypeId,
        note: request.note || '',
        required_note: request.requiredNote || 'KHONGCHOXEMHANG',
        from_name: request.fromName,
        from_phone: request.fromPhone,
        from_address: request.fromAddress,
        from_ward_name: request.fromWardName,
        from_district_name: request.fromDistrictName,
        from_province_name: request.fromProvinceName,
        to_name: request.toName,
        to_phone: request.toPhone,
        to_address: request.toAddress,
        to_ward_code: request.toWardCode,
        to_district_id: request.toDistrictId,
        cod_amount: request.codAmount || 0,
        content: request.content || '',
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        pick_station_id: request.pickStationId,
        deliver_station_id: request.deliverStationId,
        insurance_value: request.insuranceValue || 0,
        service_id: request.serviceId,
        service_type_id: request.serviceTypeId,
        coupon: request.coupon || null,
        pick_shift: request.pickShift || [2],
        items: request.items || [],
      };

      const response = await this.client.post('/shiip/public-api/v2/shipping-order/create', requestData, {
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN createOrderAsync error:');
      console.error('Error message:', error.message);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
      // Chỉ log requestData nếu biến này tồn tại trong phạm vi
      try {
        if (typeof request !== 'undefined') {
          console.error('Request data was:', JSON.stringify(request, null, 2));
        }
      } catch (e) {}
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Error when CreateOrder GHN API',
      };
    }
  }

  /**
   * Get order info from GHN
   */
  async getOrderInfoAsync(request: GetOrderInfoRequest): Promise<GHNResponse<any>> {
    try {
      const response = await this.client.get('/shiip/public-api/v2/shipping-order/detail', {
        params: {
          order_code: request.orderCode,
        },
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getOrderInfoAsync error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GetOrderInfo GHN API',
      };
    }
  }

  /**
   * Cancel order on GHN
   */
  async cancelOrder(request: CancelOrderRequest): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        order_codes: request.orderCodes,
      };

      const response = await this.client.post('/shiip/public-api/v2/switching-status/cancel', requestData, {
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN cancelOrder error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when calling GHN API',
      };
    }
  }

  /**
   * Update COD amount for an order
   */
  async updateCODAsync(request: UpdateCODRequest): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        order_code: request.orderCode,
        cod_amount: request.codAmount,
      };

      const response = await this.client.post(
        '/shiip/public-api/v2/shipping-order/updateCOD',
        requestData,
        {
          headers: this.getHeaders('order'),
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN updateCOD error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when updating COD',
      };
    }
  }

  /**
   * Preview order before creating (get estimated fee and time)
   */
  async previewOrderAsync(request: PreviewOrderRequest): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        payment_type_id: request.paymentTypeId,
        required_note: request.requiredNote || 'KHONGCHOXEMHANG',
        from_name: request.fromName,
        from_phone: request.fromPhone,
        from_address: request.fromAddress,
        from_ward_name: request.fromWardName,
        from_district_name: request.fromDistrictName,
        from_province_name: request.fromProvinceName,
        to_name: request.toName,
        to_phone: request.toPhone,
        to_address: request.toAddress,
        to_ward_code: request.toWardCode,
        to_district_id: request.toDistrictId,
        cod_amount: request.codAmount,
        content: request.content,
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        service_id: request.serviceId,
        service_type_id: request.serviceTypeId,
        items: request.items,
      };

      const response = await this.client.post(
        '/shiip/public-api/v2/shipping-order/preview',
        requestData,
        {
          headers: this.getHeaders('order'),
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN previewOrder error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when previewing order',
      };
    }
  }

  /**
   * Get pick shift dates (ca lấy hàng)
   */
  async getPickShiftAsync(): Promise<GHNResponse<any>> {
    try {
      const response = await this.client.get('/shiip/public-api/v2/shift/date', {
        headers: this.getHeaders('order'),
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getPickShift error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when getting pick shift',
      };
    }
  }

  /**
   * Create support ticket for order
   */
  async createTicketAsync(request: CreateTicketRequest): Promise<GHNResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('order_code', request.orderCode);
      formData.append('category', request.category);
      formData.append('description', request.description);
      
      if (request.cEmail) {
        formData.append('c_email', request.cEmail);
      }
      
      if (request.attachments && request.attachments.length > 0) {
        formData.append('attachments', request.attachments.join(','));
      }

      const response = await this.client.post(
        '/shiip/public-api/ticket/create',
        formData,
        {
          headers: {
            ...this.getHeaders('order'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN createTicket error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when creating ticket',
      };
    }
  }

  /**
   * Get order info by client order code
   */
  async getOrderByClientCodeAsync(clientOrderCode: string): Promise<GHNResponse<any>> {
    try {
      const requestData = {
        client_order_code: clientOrderCode,
      };

      const response = await this.client.post(
        '/shiip/public-api/v2/shipping-order/detail-by-client-code',
        requestData,
        {
          headers: this.getHeaders('order'),
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Success',
      };
    } catch (error: any) {
      console.error('GHN getOrderByClientCode error:', error.response?.data || error.message);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error when getting order by client code',
      };
    }
  }
}

// Export singleton instance
export default new GHNService();
