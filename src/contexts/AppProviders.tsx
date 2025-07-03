import React from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { ToastProvider } from './ToastContext';
import { NotificationProvider } from './NotificationContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <ToastProvider>
              {children}
          </ToastProvider>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
};
