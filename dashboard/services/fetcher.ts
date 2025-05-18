import useAuth from "@/hooks/useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'; // Management service

export const fetcher = async<T>(path: string, options: RequestInit = {}): Promise<T> => {
    const data = localStorage.getItem('auth-storage');
    const token = data ? JSON.parse(data)?.state?.token : null;
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch data');

        if (response.status === 401) {
            useAuth.getState().logout();
        }

        throw error;
    }

    return response.json();
}

