const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restConfig } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...restConfig,
      headers: requestHeaders,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Các endpoint xác thực
  async register(data: {
    full_name: string;
    email: string;
    password: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
      requiresAuth: true,
    });
    
    localStorage.removeItem('accessToken');
    return response;
  }

  async getMe() {
    return this.request('/auth/me', {
      requiresAuth: true,
    });
  }

  // Các endpoint sản phẩm
  async getProducts(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.category) queryParams.set('category', params.category);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  // Các endpoint danh mục
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id: number) {
    return this.request(`/categories/${id}`);
  }

  // Các endpoint giỏ hàng
  async getCart() {
    return this.request('/cart', {
      requiresAuth: true,
    });
  }

  async addToCart(data: { product_id: number; quantity: number }) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  }

  async updateCartItem(productId: number, quantity: number) {
    return this.request(`/cart`, {
      method: 'PUT',
      body: JSON.stringify({ product_id: productId, quantity }),
      requiresAuth: true,
    });
  }

  async removeCartItem(id: number) {
    return this.request(`/cart/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
      requiresAuth: true,
    });
  }

  // Các endpoint đơn hàng
  async createOrder(data: {
    address_id: number;
    payment_method: 'cod' | 'bank_transfer' | 'e_wallet';
    note?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  }

  async getOrders() {
    return this.request('/orders', {
      requiresAuth: true,
    });
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`, {
      requiresAuth: true,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
