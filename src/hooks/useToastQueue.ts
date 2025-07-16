import { useCallback, useRef } from 'react';
import { toast } from '@/components/ui/sonner';

interface QueuedToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  delay: number;
}

export const useToastQueue = () => {
  const queueRef = useRef<QueuedToast[]>([]);
  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const processQueue = useCallback(() => {
    if (processingRef.current || queueRef.current.length === 0) return;
    
    processingRef.current = true;
    const nextToast = queueRef.current.shift()!;
    
    // Show the toast
    const toastFn = toast[nextToast.type] || toast.info;
    toastFn(nextToast.title, {
      id: nextToast.id,
      description: nextToast.description,
    });
    
    // Schedule next toast if queue not empty
    if (queueRef.current.length > 0) {
      timeoutRef.current = setTimeout(() => {
        processingRef.current = false;
        processQueue();
      }, nextToast.delay);
    } else {
      processingRef.current = false;
    }
  }, []);

  const addToast = useCallback((
    type: QueuedToast['type'],
    title: string,
    description?: string,
    microDelay: number = 100 // Default 100ms delay between rapid toasts
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const queuedToast: QueuedToast = {
      id,
      type,
      title,
      description,
      delay: microDelay,
    };
    
    queueRef.current.push(queuedToast);
    
    // Start processing if not already running
    if (!processingRef.current) {
      processQueue();
    }
    
    return id;
  }, [processQueue]);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    processingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    addToast,
    clearQueue,
    queueLength: queueRef.current.length,
  };
}; 