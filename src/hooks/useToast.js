import { useState } from 'react';

// This is a placeholder hook for a toast notification system.
// In a real app, this would integrate with a library like react-toastify.
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = new Date().getTime();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 3000);
  };

  return { showToast, toasts };
};

export default useToast;
