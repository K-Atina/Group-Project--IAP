// lib/api.ts - API client for connecting to PHP backend

const API_BASE_URL = '/api';

export interface User {
  id: number;
  name: string;
  email: string;
  type: 'buyer' | 'creator';
  verified: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image_url: string;
  created_by: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  events?: Event[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string, userType: 'buyer' | 'creator' = 'buyer'): Promise<ApiResponse<User>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async signup(name: string, email: string, password: string, userType: 'buyer' | 'creator' = 'buyer'): Promise<ApiResponse<any>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, userType }),
    });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth', {
      method: 'GET',
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(email: string): Promise<ApiResponse<any>> {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse<{ reset_token: string }>> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<any>> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Events endpoints
  async getEvents(params: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<Event[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    const endpoint = query ? `/events?${query}` : '/events';
    
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async createEvent(eventData: {
    title: string;
    description: string;
    category: string;
    date: string;
    location: string;
    price: number;
    imageUrl?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // New comprehensive event management
  async createFullEvent(eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    status?: string;
    ticket_types: Array<{
      name: string;
      price: number;
      quantity: number;
      description: string;
    }>;
  }): Promise<ApiResponse<{ event_id: number }>> {
    return this.request('/events-new', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getMyEvents(page?: number, limit?: number): Promise<ApiResponse<{
    events: EventDetailed[];
    pagination: any;
  }>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());

    return this.request(`/events-new/my-events?${queryParams.toString()}`, { method: 'GET' });
  }

  async getEventById(id: number): Promise<ApiResponse<{ event: EventDetailed }>> {
    return this.request(`/events-new/${id}`, { method: 'GET' });
  }

  async updateEvent(id: number, eventData: any): Promise<ApiResponse<void>> {
    return this.request(`/events-new/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number): Promise<ApiResponse<void>> {
    return this.request(`/events-new/${id}`, { method: 'DELETE' });
  }

  async updateEventStatus(id: number, status: string): Promise<ApiResponse<void>> {
    return this.request(`/events-new/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Orders API
  async getOrders(page?: number, limit?: number): Promise<ApiResponse<{
    orders: OrderDetailed[];
    pagination: any;
  }>> {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());

    return this.request(`/orders?${queryParams.toString()}`, { method: 'GET' });
  }

  async getOrderById(id: number): Promise<ApiResponse<{ order: OrderDetailed }>> {
    return this.request(`/orders/${id}`, { method: 'GET' });
  }

  async createOrder(orderData: {
    event_id: number;
    ticket_type_id: number;
    quantity: number;
  }): Promise<ApiResponse<{
    order_id: number;
    order_reference: string;
  }>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<void>> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(id: number): Promise<ApiResponse<void>> {
    return this.request(`/orders/${id}/cancel`, { method: 'PUT' });
  }

  async getOrderStatistics(startDate?: string, endDate?: string): Promise<ApiResponse<{
    statistics: {
      total_orders: number;
      total_revenue: number;
      orders_by_status: Record<string, number>;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);

    return this.request(`/orders/statistics?${queryParams.toString()}`, { method: 'GET' });
  }
}

// Extended type definitions
export interface EventDetailed {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  total_capacity: number;
  available_tickets: number;
  status: 'draft' | 'published' | 'sold-out' | 'ended' | 'pending' | 'approved' | 'rejected';
  image_url?: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_email?: string;
  ticket_types: TicketType[];
}

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description: string;
  created_at: string;
}

export interface OrderDetailed {
  id: number;
  user_id: number;
  event_id: number;
  ticket_type_id: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  order_reference: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_venue?: string;
  ticket_type_name?: string;
  user_name?: string;
  user_email?: string;
  tickets: TicketDetailed[];
}

export interface TicketDetailed {
  id: number;
  order_id: number;
  user_id: number;
  event_id: number;
  ticket_type_id: number;
  ticket_number: string;
  qr_code: string;
  status: 'valid' | 'used' | 'cancelled';
  used_at?: string;
  created_at: string;
}

export const apiClient = new ApiClient();
export default apiClient;