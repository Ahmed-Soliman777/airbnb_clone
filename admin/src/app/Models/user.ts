export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'guest' | 'host' | 'admin' | 'main-host';
  profilePhoto?: string;
  phone?: string;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}
