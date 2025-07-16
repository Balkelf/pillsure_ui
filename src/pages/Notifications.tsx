import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Volume2, Smartphone, Bell, CalendarClock, CalendarDays, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useDeviceEventsContext } from "@/providers/DeviceEventsProvider";
import { SensorDataNotification } from "@/components/dashboard/SensorDataNotification";

const Notifications = () => {
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [showSensorNotification, setShowSensorNotification] = useState(true);
  const { lastSensorDataEvent } = useDeviceEventsContext();

  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

  // Show notification again when new sensor data arrives
  useEffect(() => {
    if (lastSensorDataEvent) {
      setShowSensorNotification(true);
    }
  }, [lastSensorDataEvent]);

  const notificationSettings = [
    {
      id: "location",
      icon: MapPin,
      title: "Location alerts",
      description: "Get reminders based on your location",
      enabled: true,
    },
    {
      id: "sound",
      icon: Volume2,
      title: "Sound alerts",
      description: "Play a sound with medication reminders",
      enabled: true,
    },
    {
      id: "push",
      icon: Smartphone,
      title: "Push notifications",
      description: "Receive alerts on your device",
      enabled: true,
    },
    {
      id: "caregivers",
      icon: Bell,
      title: "Caregiver notifications",
      description: "Alert your care team of missed doses",
      enabled: true,
    },
    {
      id: "refills",
      icon: deviceMode === "daily" ? CalendarClock : CalendarDays,
      title: deviceMode === "daily" ? "Daily refill reminders" : "3-day refill reminders",
      description: deviceMode === "daily" 
        ? "Reminder to refill your device daily" 
        : "Reminder to refill your device every 3 days",
      enabled: true,
    },
  ];

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="heading-1 text-foreground">Notifications</h1>
          <p className="body-1 text-muted-foreground">Manage your notification preferences</p>
        </div>

        {/* Sensor Data Notification */}
        {lastSensorDataEvent && showSensorNotification && (
          <SensorDataNotification
            sensorData={lastSensorDataEvent}
            onDismiss={() => setShowSensorNotification(false)}
          />
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="heading-2 leading-tight">Notification preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="label">{setting.title}</h3>
                    <p className="body-2 text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Notifications; 