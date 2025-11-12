import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export const useToast = () => {
  return useContext(ToastContext);
};
