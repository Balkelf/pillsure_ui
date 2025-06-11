import { useState, useEffect, useRef } from 'react';

// Device Event Constants (matching the DailyCompartments component)
export const DEVICE_EVENTS = {
  LID_1_OPEN: 0x0001,
  LID_1_CLOSE: 0x0002,
  LID_2_OPEN: 0x0004,
  LID_2_CLOSE: 0x0008,
  LID_3_OPEN: 0x0010,
  LID_3_CLOSE: 0x0020,
  RELOAD_EVENT: 0x0040,
  TILT_EVENT: 0x0080,
  BUTTON_EVENT: 0x0100,
  PILL_MISS_EVENT: 0x0200,
  PILL_TAKE_EVENT: 0x0400,
} as const;

export type BoxEvent = {
  type: string;
  boxId: number;
  event: 'opened' | 'closed';
  timestamp: number;
};

export type ButtonEvent = {
  type: string;
  deviceId: string;
  timestamp: number;
};

export type BatteryEvent = {
  type: string;
  batteryLevel: number;
  isCharging: boolean;
  timestamp: number;
};

// New pill-specific event types
export type PillEvent = {
  type: 'pillEvent';
  eventCode: number;
  compartmentId: number;
  eventName: 'PILL_TAKE_EVENT' | 'PILL_MISS_EVENT' | 'LID_OPEN' | 'LID_CLOSE' | 'RELOAD_EVENT' | 'OTHER';
  timestamp: number;
  rawData?: any;
};

export type DeviceConnectionStatus = {
  connected: boolean;
  lastSeen?: Date;
  reconnectAttempts: number;
};

export function useDeviceEvents(websocketUrl: string) {
  const [lastBoxEvent, setLastBoxEvent] = useState<BoxEvent | null>(null);
  const [lastButtonEvent, setLastButtonEvent] = useState<ButtonEvent | null>(null);
  const [lastBatteryEvent, setLastBatteryEvent] = useState<BatteryEvent | null>(null);
  const [lastPillEvent, setLastPillEvent] = useState<PillEvent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<DeviceConnectionStatus>({
    connected: false,
    reconnectAttempts: 0,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastOpenedCompartmentRef = useRef<number | null>(null);
  const lastOpenedTimestampRef = useRef<number | null>(null);

  // Helper function to get the last opened compartment (with recency check)
  const getLastOpenedCompartment = (): number | null => {
    const compartment = lastOpenedCompartmentRef.current;
    const timestamp = lastOpenedTimestampRef.current;
    
    // Only use compartment if it was opened within the last 2 minutes (reasonable sequence time)
    if (compartment && timestamp && (Date.now() - timestamp) < 120000) {
      return compartment;
    }
    
    // Clear stale data
    if (timestamp && (Date.now() - timestamp) >= 120000) {
      console.log(`⏱️ Clearing stale compartment context (${compartment}) after 2 minutes`);
      lastOpenedCompartmentRef.current = null;
      lastOpenedTimestampRef.current = null;
    }
    
    return null;
  };

  // Helper function to track compartment opens
  const trackCompartmentOpen = (compartmentId: number): void => {
    lastOpenedCompartmentRef.current = compartmentId;
    lastOpenedTimestampRef.current = Date.now();
    console.log(`📂 Tracking compartment ${compartmentId} opened at ${new Date().toLocaleTimeString()}`);
  };

  // Extract compartment ID from device event bit patterns
  const extractCompartmentFromEvent = (eventValue: number): number | null => {
    // Direct compartment detection from LID events
    if (eventValue & (DEVICE_EVENTS.LID_1_OPEN | DEVICE_EVENTS.LID_1_CLOSE)) return 1; // Morning
    if (eventValue & (DEVICE_EVENTS.LID_2_OPEN | DEVICE_EVENTS.LID_2_CLOSE)) return 2; // Lunch  
    if (eventValue & (DEVICE_EVENTS.LID_3_OPEN | DEVICE_EVENTS.LID_3_CLOSE)) return 3; // Evening
    
    // For PILL_TAKE_EVENT/PILL_MISS_EVENT: Use compartment from device sequence
    // Device sends: LID_OPEN → TILT → LID_CLOSE → BUTTON → PILL_TAKE_EVENT
    if (eventValue & (DEVICE_EVENTS.PILL_TAKE_EVENT | DEVICE_EVENTS.PILL_MISS_EVENT)) {
      const compartment = getLastOpenedCompartment();
      if (compartment) {
        console.log(`💊 ${eventValue & DEVICE_EVENTS.PILL_TAKE_EVENT ? 'PILL_TAKEN' : 'PILL_MISSED'} from compartment ${compartment}`);
        return compartment;
      }
      console.warn(`⚠️ PILL_EVENT without compartment context - sequence may be incomplete`);
      return null;
    }
    
    return null;
  };

  // Helper function to parse pill events from raw device data
  const parsePillEvent = (eventCode: number, rawData: any): PillEvent => {
    let eventName: PillEvent['eventName'] = 'OTHER';
    let compartmentId = extractCompartmentFromEvent(eventCode) || 0;

    // Determine event type
    if (eventCode & DEVICE_EVENTS.PILL_TAKE_EVENT) {
      eventName = 'PILL_TAKE_EVENT';
    } else if (eventCode & DEVICE_EVENTS.PILL_MISS_EVENT) {
      eventName = 'PILL_MISS_EVENT';
    } else if (eventCode & DEVICE_EVENTS.RELOAD_EVENT) {
      eventName = 'RELOAD_EVENT';
      compartmentId = 0; // RELOAD_EVENT affects all compartments
    } else if (eventCode & (DEVICE_EVENTS.LID_1_OPEN | DEVICE_EVENTS.LID_2_OPEN | DEVICE_EVENTS.LID_3_OPEN)) {
      eventName = 'LID_OPEN';
      // Track which compartment was opened for PILL_TAKE_EVENT fallback
      if (compartmentId) {
        trackCompartmentOpen(compartmentId);
      }
    } else if (eventCode & (DEVICE_EVENTS.LID_1_CLOSE | DEVICE_EVENTS.LID_2_CLOSE | DEVICE_EVENTS.LID_3_CLOSE)) {
      eventName = 'LID_CLOSE';
    }

    return {
      type: 'pillEvent',
      eventCode,
      compartmentId,
      eventName,
      timestamp: Date.now(),
      rawData,
    };
  };

  useEffect(() => {
    function connect() {
      // Don't connect if URL is empty (dev mode)
      if (!websocketUrl || websocketUrl.trim() === "") {
        console.log('🔧 Device connection disabled (dev mode)');
        setConnectionStatus({
          connected: false,
          reconnectAttempts: 0,
        });
        return;
      }

      try {
        setConnectionStatus(prev => ({
          ...prev,
          reconnectAttempts: prev.reconnectAttempts + 1,
        }));

        const ws = new WebSocket(websocketUrl);
        
        ws.onopen = () => {
          console.log('🔌 WebSocket connected to Pillsure device');
          setConnectionStatus({
            connected: true,
            lastSeen: new Date(),
            reconnectAttempts: 0,
          });
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Update last seen timestamp
            setConnectionStatus(prev => ({
              ...prev,
              lastSeen: new Date(),
            }));

            // Handle existing event types
            if (data.type === 'boxEvent') {
              setLastBoxEvent(data);
            } else if (data.type === 'buttonEvent') {
              setLastButtonEvent(data);
            } else if (data.type === 'batteryEvent') {
              console.log('📱 Received battery event via WebSocket:', data);
              setLastBatteryEvent(data);
            } 
            // Handle new pill events
            else if (data.type === 'pillEvent' || data.eventCode !== undefined) {
              const pillEvent = parsePillEvent(data.eventCode, data);
              console.log('💊 Received pill event:', pillEvent);
              setLastPillEvent(pillEvent);
            }
            // Handle raw device events (for backward compatibility)
            else if (data.eventCode || data.event_code) {
              const eventCode = data.eventCode || data.event_code;
              const pillEvent = parsePillEvent(eventCode, data);
              console.log('🔧 Parsed raw device event:', pillEvent);
              setLastPillEvent(pillEvent);
            }
          } catch (err) {
            console.error('❌ Error parsing WebSocket message:', err);
          }
        };
        
        ws.onclose = () => {
          console.log('🔌 WebSocket disconnected from Pillsure device');
          setConnectionStatus(prev => ({
            ...prev,
            connected: false,
          }));
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Attempt to reconnect after a delay (exponential backoff)
          const delay = Math.min(3000 * Math.pow(1.5, connectionStatus.reconnectAttempts), 30000);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        };
        
        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          ws.close();
        };
        
        wsRef.current = ws;
      } catch (err) {
        console.error('❌ WebSocket connection error:', err);
        setConnectionStatus(prev => ({
          ...prev,
          connected: false,
        }));
      }
    }

    connect();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [websocketUrl]);

  return { 
    // Existing events
    lastBoxEvent, 
    lastButtonEvent, 
    lastBatteryEvent,
    // New pill events
    lastPillEvent,
    // Connection status
    connectionStatus,
    connected: connectionStatus.connected, // Backward compatibility
    // Utility functions
    sendMessage: (message: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      }
    },
    // Exported helper functions for use in components
    extractCompartmentFromEvent
  };
} 