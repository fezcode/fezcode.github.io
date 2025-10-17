
import { useContext } from 'react';
import { ToastContext } from '../components/ToastProvider';

export const useToast = () => {
  return useContext(ToastContext);
};
