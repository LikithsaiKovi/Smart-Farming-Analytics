const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // No demo fallbacks; enforce real backend usage
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }


  // Authentication methods
  async sendOTP(email: string): Promise<ApiResponse<{ expiresIn: number }>> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse<{
    token: string;
    user: {
      email: string;
      name: string;
      farmSize: number;
    };
  }>> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async register(name: string, email: string, farmSize: number): Promise<ApiResponse<{ message: string; data?: { expiresIn: number } }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, farmSize }),
    });
  }

  async verifyRegistration(email: string, otp: string): Promise<ApiResponse<{
    token: string;
    user: {
      email: string;
      name: string;
      farmSize: number;
    };
  }>> {
    return this.request('/auth/verify-registration', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Weather methods
  async getCurrentWeather(lat: number, lon: number): Promise<ApiResponse<{
    location: string;
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    description: string;
    icon: string;
    timestamp: string;
  }>> {
    return this.request(`/weather/current?lat=${lat}&lon=${lon}`);
  }

  async getWeatherForecast(lat: number, lon: number): Promise<ApiResponse<Array<{
    datetime: string;
    temperature: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
  }>>> {
    return this.request(`/weather/forecast?lat=${lat}&lon=${lon}`);
  }

  async geocode(query: string): Promise<ApiResponse<Array<{
    name: string;
    country: string;
    state: string;
    lat: number;
    lon: number;
  }>>> {
    return this.request(`/weather/geocode?q=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
