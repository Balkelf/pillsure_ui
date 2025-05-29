import { ReactNode, createContext, useContext } from 'react';
import { useDeviceEvents, BoxEvent, ButtonEvent, BatteryEvent } from '@/hooks/use-device-events';

type DeviceEventsContextType = {
  lastBoxEvent: BoxEvent | null;
  lastButtonEvent: ButtonEvent | null;
  lastBatteryEvent: BatteryEvent | null;
  connected: boolean;
};

const DeviceEventsContext = createContext<DeviceEventsContextType>({
  lastBoxEvent: null,
  lastButtonEvent: null,
  lastBatteryEvent: null,
  connected: false,
});

type DeviceEventsProviderProps = {
  children: ReactNode;
  websocketUrl?: string;
};

export function DeviceEventsProvider({ 
  children, 
  websocketUrl = "ws://35.246.27.69:1880/ws/events" 
}: DeviceEventsProviderProps) {
  const { lastBoxEvent, lastButtonEvent, lastBatteryEvent, connected } = useDeviceEvents(websocketUrl);

  return (
    <DeviceEventsContext.Provider value={{ lastBoxEvent, lastButtonEvent, lastBatteryEvent, connected }}>
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