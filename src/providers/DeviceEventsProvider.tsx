import { ReactNode, createContext, useContext } from 'react';
import { useDeviceEvents, BoxEvent, ButtonEvent } from '@/hooks/use-device-events';

type DeviceEventsContextType = {
  lastBoxEvent: BoxEvent | null;
  lastButtonEvent: ButtonEvent | null;
  connected: boolean;
};

const DeviceEventsContext = createContext<DeviceEventsContextType>({
  lastBoxEvent: null,
  lastButtonEvent: null,
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
  const { lastBoxEvent, lastButtonEvent, connected } = useDeviceEvents(websocketUrl);

  return (
    <DeviceEventsContext.Provider value={{ lastBoxEvent, lastButtonEvent, connected }}>
      {children}
    </DeviceEventsContext.Provider>
  );
}

export const useDeviceEventsContext = () => useContext(DeviceEventsContext); 