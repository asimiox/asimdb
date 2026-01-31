import { ApiResponse } from '../types';

const API_BASE_URL = 'https://sychosimdatabase.vercel.app/api/lookup';

export const fetchSimData = async (query: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};