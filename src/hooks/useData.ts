import { useContext } from 'react';
import { DataContext, DataContextType } from '../contexts/DataContext';

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
