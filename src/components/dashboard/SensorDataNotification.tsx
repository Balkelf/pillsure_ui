import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Thermometer, Droplets, Activity, Smartphone, Battery, Clock } from 'lucide-react';
import { SensorDataEvent } from '@/hooks/use-device-events';

interface SensorDataNotificationProps {
  sensorData: SensorDataEvent;
  onDismiss: () => void;
}

export const SensorDataNotification: React.FC<SensorDataNotificationProps> = ({
  sensorData,
  onDismiss
}) => {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
  };

  const formatHumidity = (humidity: number): string => {
    return `${humidity.toFixed(1)}%`;
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Device Data Received
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Device Info */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-blue-800">
            <strong>Device:</strong> {sensorData.serialNumber}
          </div>
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimestamp(sensorData.timestamp)}
          </div>
        </div>

        {/* Sensor Data Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Battery */}
          {sensorData.battery && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Battery className="h-3 w-3 text-green-600" />
              <span className="text-blue-900">
                <strong>Battery:</strong> {sensorData.battery.percentage}%
                {sensorData.battery.voltage && ` (${sensorData.battery.voltage.toFixed(2)}V)`}
              </span>
            </div>
          )}

          {/* Temperature */}
          {sensorData.temperature !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Thermometer className="h-3 w-3 text-red-500" />
              <span className="text-blue-900">
                <strong>Temp:</strong> {formatTemperature(sensorData.temperature)}
              </span>
            </div>
          )}

          {/* Humidity */}
          {sensorData.humidity !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="text-blue-900">
                <strong>Humidity:</strong> {formatHumidity(sensorData.humidity)}
              </span>
            </div>
          )}

          {/* Steps */}
          {sensorData.steps !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-blue-900">
                <strong>Steps:</strong> {sensorData.steps}
              </span>
            </div>
          )}

          {/* Tilt */}
          {sensorData.tilt !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Smartphone className="h-3 w-3 text-purple-500" />
              <span className="text-blue-900">
                <strong>Tilt:</strong> {sensorData.tilt}
              </span>
            </div>
          )}

          {/* Pill Time */}
          {sensorData.pillTime !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Clock className="h-3 w-3 text-orange-500" />
              <span className="text-blue-900">
                <strong>Pill Time:</strong> {sensorData.pillTime}
              </span>
            </div>
          )}

          {/* RSSI */}
          {sensorData.rssi !== undefined && (
            <div className="flex items-center gap-1.5 p-2 bg-white/60 rounded">
              <Activity className="h-3 w-3 text-gray-500" />
              <span className="text-blue-900">
                <strong>Signal:</strong> {sensorData.rssi} dBm
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorDataNotification; 