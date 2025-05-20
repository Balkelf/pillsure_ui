import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Volume2, Smartphone, Bell, CalendarClock, CalendarDays, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const Notifications = () => {
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");

  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

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
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground font-light">Manage your notification preferences</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold leading-tight">Notification preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium leading-tight">{setting.title}</h3>
                    <p className="text-sm text-muted-foreground font-light mt-1">{setting.description}</p>
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