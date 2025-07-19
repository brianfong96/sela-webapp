import React from 'react';
import { FormatContext } from './context';
import { FormatContextType } from './types';

interface FormatContextProviderProps {
  value: FormatContextType;
  children: React.ReactNode;
}

/**
 * Context provider component for sharing format state
 */
export const FormatContextProvider: React.FC<FormatContextProviderProps> = ({ 
  value, 
  children 
}) => {
  return (
    <FormatContext.Provider value={value}>
      {children}
    </FormatContext.Provider>
  );
};
