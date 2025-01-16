import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../mocks/data';

export function useAuth() {
  const { setUser } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find mock user
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      setUser(user);
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  }, [setUser]);

  return { login };
}