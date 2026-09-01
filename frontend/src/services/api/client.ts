const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function post<T>(endpoint: string, body: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    body,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
