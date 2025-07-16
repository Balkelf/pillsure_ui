import { toast } from '@/hooks/use-toast';
import { Hand } from 'lucide-react';

export interface ButtonPressEventData {
  deviceId: string;
  timestamp: number;
}

export const showButtonPressToast = (eventData: ButtonPressEventData) => {
  const timeString = new Date(eventData.timestamp).toLocaleTimeString();
  
  toast({
    title: "Button Pressed",
    description: `Device ${eventData.deviceId} button pressed at ${timeString}`,
    variant: "info",
    duration: 4000, // Toast will auto-dismiss after 4 seconds
  });
};

// Legacy component for backward compatibility (if needed)
// Use showButtonPressToast function instead for new implementations
export const ButtonEventNotification = ({ deviceId, timestamp }: ButtonPressEventData) => {
  // Automatically trigger toast when component is rendered
  showButtonPressToast({ deviceId, timestamp });
  
  // Return null since we're using toast instead of rendering component
  return null;
};

export default ButtonEventNotification; 