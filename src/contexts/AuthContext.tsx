import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as api from '../services/api';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Omit<User, 'imageUrl' | 'joinedDate'> & { profession?: string }) => Promise<{success: boolean; error?: string}>;
  updateCurrentUser: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('tradieStopUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Could not parse saved user:", e);
      localStorage.removeItem('tradieStopUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (userId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userWithToken = await api.apiLogin(userId, password);
      if (userWithToken) {
        setCurrentUser(userWithToken);
        localStorage.setItem('tradieStopUser', JSON.stringify(userWithToken));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('tradieStopUser');
  }, []);
  
  const signup = useCallback(async (userData: Omit<User, 'imageUrl' | 'joinedDate'> & { profession?: string }): Promise<{success: boolean, error?: string}> => {
    setIsLoading(true);
    try {
      const newUser = await api.createUser(userData);
      if (newUser && newUser.password) {
        // Automatically log in the new user
        const loginSuccess = await login(newUser.id, newUser.password);
        return { success: loginSuccess };
      }
      return { success: false, error: "Failed to create user." };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  }, [login]);
  
  const updateCurrentUser = (updates: Partial<User>) => {
      if(currentUser) {
          const storedUser = JSON.parse(localStorage.getItem('tradieStopUser') || '{}');
          const updatedUser = { ...storedUser, ...updates };
          setCurrentUser(updatedUser);
          localStorage.setItem('tradieStopUser', JSON.stringify(updatedUser));
      }
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, signup, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};