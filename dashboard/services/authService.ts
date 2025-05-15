// Define the base URL for your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'; // Management service

// Define interfaces for login and registration payloads based on backend DTOs
export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
}

// Define the expected response from the login endpoint
export interface LoginResponse {
  access_token: string;
}

// Define the expected response from the register endpoint (adjust based on actual backend response)
// Assuming it returns the user object without the password
export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  // Add other fields that the backend might return upon registration or for a user profile
}

export const authService = {
  login: async (credentials: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }
    return response.json();
  },

  register: async (userData: RegisterPayload): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();
  },

  // Optional: Function to fetch user profile if you have a protected route like /auth/profile or /users/me
  // getProfile: async (token: string): Promise<UserProfile> => {
  //   const response = await fetch(`${API_BASE_URL}/auth/profile`, { // Or e.g., /users/me
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch profile');
  //   }
  //   return response.json();
  // }
}; 