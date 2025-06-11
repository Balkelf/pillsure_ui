import { ReactNode, createContext, useContext } from 'react';
import { useDeviceEvents, BoxEvent, ButtonEvent, BatteryEvent, PillEvent, DeviceConnectionStatus } from '@/hooks/use-device-events';

type DeviceEventsContextType = {
  lastBoxEvent: BoxEvent | null;
  lastButtonEvent: ButtonEvent | null;
  lastBatteryEvent: BatteryEvent | null;
  lastPillEvent: PillEvent | null;
  connectionStatus: DeviceConnectionStatus;
  connected: boolean;
  sendMessage: (message: any) => void;
};

const DeviceEventsContext = createContext<DeviceEventsContextType>({
  lastBoxEvent: null,
  lastButtonEvent: null,
  lastBatteryEvent: null,
  lastPillEvent: null,
  connectionStatus: { connected: false, reconnectAttempts: 0 },
  connected: false,
  sendMessage: () => {},
});

type DeviceEventsProviderProps = {
  children: ReactNode;
  websocketUrl?: string;
};

export function DeviceEventsProvider({ 
  children, 
  websocketUrl = "ws://35.246.27.69:1880/ws/events" 
}: DeviceEventsProviderProps) {
  const { 
    lastBoxEvent, 
    lastButtonEvent, 
    lastBatteryEvent, 
    lastPillEvent, 
    connectionStatus, 
    connected, 
    sendMessage 
  } = useDeviceEvents(websocketUrl);

  return (
    <DeviceEventsContext.Provider value={{ 
      lastBoxEvent, 
      lastButtonEvent, 
      lastBatteryEvent, 
      lastPillEvent, 
      connectionStatus, 
      connected, 
      sendMessage 
    }}>
      {children}
    </DeviceEventsContext.Provider>
  );
}

export function useDeviceEventsContext() {
  const context = useContext(DeviceEventsContext);
  if (!context) {
    throw new Error('useDeviceEventsContext must be used within a DeviceEventsProvider');
  }
  return context;
} 