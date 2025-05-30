import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Hand } from 'lucide-react';

interface ButtonEventNotificationProps {
  deviceId: string;
  timestamp: number;
  onDismiss?: () => void;
}

export const ButtonEventNotification: React.FC<ButtonEventNotificationProps> = ({
  deviceId,
  timestamp,
  onDismiss
}) => {
  const timeString = new Date(timestamp).toLocaleTimeString();
  
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800">
      <Hand className="h-4 w-4" />
      <AlertDescription>
        <div className="flex justify-between items-center">
          <span>
            <strong>Button pressed</strong> on device {deviceId} at {timeString}
          </span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-blue-600 hover:text-blue-800 ml-4"
            >
              ×
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ButtonEventNotification; 