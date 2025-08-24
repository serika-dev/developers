import axios from 'axios';
import { APIKey, APIUsageResponse, Character, GenerationRequest, ImageGenerationRequest, ModelsResponse } from '../types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beta-api.serika.dev';
const API_PATH = '/api/openai/v1';
const AUTH_PATH = '/api/auth';

// Create two axios instances - one for API endpoints and one for auth endpoints
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: `${API_BASE_URL}${AUTH_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests
api.interceptors.request.use((config) => {
  // Use JWT auth for /keys and /usage endpoints
  if (config.url?.includes('/keys') || config.url?.includes('/usage')) {
    const token = getAuthToken();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
  } else {
    // Use API key auth for OpenAI endpoints
    const apiKey = getStoredApiKey();
    if (apiKey) {
      config.headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }
  return config;
});

authApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth functions
export const login = async (email: string, password: string) => {
  const response = await authApi.post('/login', {
    email,
    password,
  });
  
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const logout = () => {
  removeAuthToken();
  removeStoredApiKey();
};

export const getCurrentUser = async () => {
  const response = await authApi.get('/user');
  return response.data;
};

// Upload profile picture
export const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axios.put(
    `${API_BASE_URL}/api/cdn/user/${userId}`,
    formData,
    {
      headers: {
        'x-auth-token': getAuthToken(),
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// API Key storage
export const setStoredApiKey = (apiKey: string) => {
  if (typeof window !== 'undefined') {
    Cookies.set('api_key', apiKey, { expires: 7 }); // 7 days
  }
};

export const getStoredApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    const apiKey = Cookies.get('api_key');
    return apiKey !== undefined ? apiKey : null;
  }
  return null;
};

export const removeStoredApiKey = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('api_key');
  }
};

// Token management
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    Cookies.set('auth_token', token, { expires: 7 }); // 7 days
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('auth_token');
    return token !== undefined ? token : null;
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('auth_token');
  }
};

// API Keys management - these use JWT auth but are under API path
export const createApiKey = async (name: string): Promise<APIKey> => {
  const response = await api.post('/keys', { name });
  return response.data;
};

export const getApiKeys = async (): Promise<APIKey[]> => {
  const response = await api.get('/keys');
  return response.data;
};

export const getApiKeyById = async (id: string): Promise<APIKey> => {
  const response = await api.get(`/keys/${id}`);
  return response.data;
};

export const regenerateApiKey = async (id: string): Promise<APIKey> => {
  const response = await api.post(`/keys/${id}/regenerate`);
  return response.data;
};

export const deleteApiKey = async (id: string) => {
  const response = await api.delete(`/keys/${id}`);
  return response.data;
};

export const enableApiKey = async (id: string) => {
  const response = await api.post(`/keys/${id}/enable`);
  return response.data;
};

export const disableApiKey = async (id: string) => {
  const response = await api.put(`/keys/${id}/disable`);
  return response.data;
};

export const updateApiKeyPermissions = async (id: string, permissions: string[]) => {
  const response = await api.put(`/keys/${id}/permissions`, { permissions });
  return response.data;
};

// OpenAI API endpoints - these use API key auth
export const getApiUsage = async (startDate?: string, endDate?: string): Promise<APIUsageResponse> => {
  const params = { startDate, endDate };
  const response = await axios.get(`${API_BASE_URL}${API_PATH}/usage`, {
    params,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': getAuthToken(),
    },
  });
  return response.data;
};

export const getModels = async (): Promise<ModelsResponse> => {
  const response = await api.get('/models');
  return response.data;
};

export const getCharacters = async (): Promise<Character[]> => {
  const response = await api.get('/characters');
  return response.data;
};

export const generateText = async (data: GenerationRequest) => {
  const response = await api.post('/chat/completions', data);
  return response.data;
};

export const generateImage = async (data: ImageGenerationRequest) => {
  const response = await api.post('/images/generations', data);
  return response.data;
};

export async function setupBilling() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_PATH}/billing/setup`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': getAuthToken()
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error setting up billing:', error);
    throw new Error(axios.isAxiosError(error) ? error.response?.data?.msg || 'Failed to setup billing' : 'Failed to setup billing');
  }
}

export default api; 