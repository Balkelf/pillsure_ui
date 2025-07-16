import { useEffect } from 'react';
import { useDeviceEventsContext } from '@/providers/DeviceEventsProvider';
import { showButtonPressToast } from '@/components/dashboard/ButtonEventNotification';

export const useDeviceNotifications = () => {
  const { lastButtonEvent } = useDeviceEventsContext();

  // Handle button press events with toast notifications
  useEffect(() => {
    if (lastButtonEvent) {
      showButtonPressToast({
        deviceId: lastButtonEvent.deviceId,
        timestamp: lastButtonEvent.timestamp
      });
    }
  }, [lastButtonEvent]);

  return {
    // Could add more notification controls here if needed
  };
}; 