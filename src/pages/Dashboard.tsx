import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import CareNetworkCard from "@/components/dashboard/CareNetworkCard";
import MotivationalWidget from "@/components/dashboard/MotivationalWidget";
import DeviceStatusCard from "@/components/dashboard/DeviceStatusCard";
import DailyCompartments from "@/components/dashboard/DailyCompartments";
import InsightCard from "@/components/dashboard/InsightCard";
import { useDeviceEventsContext } from "@/providers/DeviceEventsProvider";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeviceNotifications } from "@/hooks/useDeviceNotifications";
import { useToastQueue } from "@/hooks/useToastQueue";
import ButtonEventNotification from "@/components/dashboard/ButtonEventNotification";
import SensorDataNotification from "@/components/dashboard/SensorDataNotification";

const Dashboard = () => {
  const { 
    lastBoxEvent, 
    lastButtonEvent, 
    lastReloadEvent, 
    lastTiltEvent, 
    lastSensorDataEvent,
    lastBatteryEvent,
    connected 
  } = useDeviceEventsContext();
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  
  // ✅ Initialize toast queue for stacking notifications
  const { addToast } = useToastQueue();
  
  // Initialize device notifications (handles button press toasts automatically)
  useDeviceNotifications();
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    avatarUrl: string;
  } | null>(null);

  // Load profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse profile data from localStorage');
      }
    }
  }, []);

  const [dismissedEvents, setDismissedEvents] = useState<Set<string>>(new Set());

  // ✅ Handle box events with proper stacking
  useEffect(() => {
    if (lastBoxEvent && !dismissedEvents.has(`box-${lastBoxEvent.timestamp}`)) {
      addToast(
        'info',
        `Box ${lastBoxEvent.boxId} ${lastBoxEvent.event}`,
        `Compartment ${lastBoxEvent.boxId} was ${lastBoxEvent.event} at ${new Date(lastBoxEvent.timestamp).toLocaleTimeString()}`,
        100 // 100ms delay for stacking rapid events
      );
      
      // Mark event as dismissed
      setDismissedEvents(prev => new Set(prev).add(`box-${lastBoxEvent.timestamp}`));
    }
  }, [lastBoxEvent, dismissedEvents, addToast]);

  // ✅ Handle reload events with stacking
  useEffect(() => {
    if (lastReloadEvent && !dismissedEvents.has(`reload-${lastReloadEvent.timestamp}`)) {
      addToast(
        'info',
        "Device Reloaded",
        `The device was reloaded at ${new Date(lastReloadEvent.timestamp).toLocaleTimeString()}`,
        100
      );
      
      setDismissedEvents(prev => new Set(prev).add(`reload-${lastReloadEvent.timestamp}`));
    }
  }, [lastReloadEvent, dismissedEvents, addToast]);

  // ✅ Handle tilt events with stacking
  useEffect(() => {
    if (lastTiltEvent && !dismissedEvents.has(`tilt-${lastTiltEvent.timestamp}`)) {
      addToast(
        'warning',
        "Device Tilted",
        `The device was tilted at ${new Date(lastTiltEvent.timestamp).toLocaleTimeString()}`,
        100
      );
      
      setDismissedEvents(prev => new Set(prev).add(`tilt-${lastTiltEvent.timestamp}`));
    }
  }, [lastTiltEvent, dismissedEvents, addToast]);

  // ✅ Handle battery events with stacking
  useEffect(() => {
    if (lastBatteryEvent && !dismissedEvents.has(`battery-${lastBatteryEvent.timestamp}`)) {
      addToast(
        'info',
        "Battery Update",
        `Battery: ${lastBatteryEvent.batteryLevel}%${lastBatteryEvent.isCharging ? ' (Charging)' : ''}`,
        100
      );
      
      setDismissedEvents(prev => new Set(prev).add(`battery-${lastBatteryEvent.timestamp}`));
    }
  }, [lastBatteryEvent, dismissedEvents, addToast]);

  // Handle sensor data events (including battery data from inject button)
  useEffect(() => {
    if (lastSensorDataEvent && !dismissedEvents.has(`sensor-${lastSensorDataEvent.timestamp}`)) {
      const sensorInfo = [];
      
      // **BATTERY INFO FROM SENSOR DATA** - Show battery if available
      if (lastSensorDataEvent.battery) {
        sensorInfo.push(`Battery: ${lastSensorDataEvent.battery.percentage}%`);
      }
      
      if (lastSensorDataEvent.temperature !== undefined) {
        sensorInfo.push(`Temp: ${lastSensorDataEvent.temperature.toFixed(1)}°C`);
      }
      
      if (lastSensorDataEvent.humidity !== undefined) {
        sensorInfo.push(`Humidity: ${lastSensorDataEvent.humidity.toFixed(1)}%`);
      }

      if (sensorInfo.length > 0) {
        addToast(
          'info',
          "Sensor Data",
          sensorInfo.join(', '),
          100
        );
        
        setDismissedEvents(prev => new Set(prev).add(`sensor-${lastSensorDataEvent.timestamp}`));
      }
    }
  }, [lastSensorDataEvent, dismissedEvents, addToast]);

  const handleDismissEvent = (eventId: string) => {
    setDismissedEvents(prev => new Set(prev).add(eventId));
  };

  // Get the user's first name for greeting
  const firstName = profileData?.name ? profileData.name.split(' ')[0] : "Maria";

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Hi, {firstName}</h1>
          <Link to="/profile">
            {profileData?.avatarUrl ? (
              <Avatar className="h-9 w-9">
                <AvatarImage src={profileData.avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            )}
          </Link>
        </div>

        <DeviceStatusCard />

        <DailyCompartments />

        <InsightCard />

        <MotivationalWidget />

        <CareNetworkCard />

        {/* Event Notifications */}
        {lastButtonEvent && !dismissedEvents.has(`button-${lastButtonEvent.timestamp}`) && (
          <ButtonEventNotification
            deviceId={lastButtonEvent.deviceId || "Unknown"}
            timestamp={lastButtonEvent.timestamp}
          />
        )}

        {lastSensorDataEvent && !dismissedEvents.has(`sensor-${lastSensorDataEvent.timestamp}`) && (
          <SensorDataNotification
            sensorData={lastSensorDataEvent}
            onDismiss={() => handleDismissEvent(`sensor-${lastSensorDataEvent.timestamp}`)}
          />
        )}

        {/* Connection Status */}
        {!connected && (
          <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-lg shadow">
            <p className="text-sm font-medium">Device disconnected</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
