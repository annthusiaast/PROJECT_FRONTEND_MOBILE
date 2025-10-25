import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Toast from '@/components/common/toast';

// Toast context to show app-wide toasts that persist across screen changes
// Usage:
//  const { showToast, hideToast } = useToast();
//  showToast({ message: 'Saved', type: 'success', duration: 2200, position: 'bottom' });

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const timerRef = useRef(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info', duration: 2200, position: 'bottom' });

  const hideToast = useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(({ message, type = 'info', duration = 2200, position = 'bottom' }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast({ visible: true, message, type, duration, position });
    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Global toast overlay */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        duration={toast.duration}
        position={toast.position}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
