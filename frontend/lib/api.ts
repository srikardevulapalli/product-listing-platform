import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateAIDescription = async (imageData: string) => {
  const response = await apiClient.post('/products/generate-ai-description', {
    image_data: imageData,
  });
  return response.data;
};

export const createProduct = async (productData: {
  title: string;
  description: string;
  keywords?: string[];
  image_url: string;
  user_id: string;
}) => {
  const response = await apiClient.post('/products/', productData);
  return response.data;
};

export const getMyProducts = async () => {
  const response = await apiClient.get('/products/my-products');
  return response.data;
};

export const updateProduct = async (productId: string, data: any) => {
  const response = await apiClient.patch(`/products/${productId}`, data);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await apiClient.delete(`/products/${productId}`);
  return response.data;
};

export const getAllProducts = async (status?: string) => {
  const params = status ? { status } : {};
  const response = await apiClient.get('/admin/products', { params });
  return response.data;
};

export const updateProductStatus = async (productId: string, status: string) => {
  const response = await apiClient.patch(`/admin/products/${productId}/status`, {
    status,
  });
  return response.data;
};
