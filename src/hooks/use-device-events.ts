import { useState, useEffect, useRef } from 'react';

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

export function useDeviceEvents(websocketUrl: string) {
  const [lastBoxEvent, setLastBoxEvent] = useState<BoxEvent | null>(null);
  const [lastButtonEvent, setLastButtonEvent] = useState<ButtonEvent | null>(null);
  const [lastBatteryEvent, setLastBatteryEvent] = useState<BatteryEvent | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket(websocketUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected to Node-RED');
          setConnected(true);
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'boxEvent') {
              setLastBoxEvent(data);
            } else if (data.type === 'buttonEvent') {
              setLastButtonEvent(data);
            } else if (data.type === 'batteryEvent') {
              console.log('Received battery event via WebSocket:', data);
              setLastBatteryEvent(data);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected from Node-RED');
          setConnected(false);
          // Attempt to reconnect after a delay
          setTimeout(connect, 3000);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
        
        wsRef.current = ws;
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setConnected(false);
      }
    }

    connect();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [websocketUrl]);

  return { lastBoxEvent, lastButtonEvent, lastBatteryEvent, connected };
} 