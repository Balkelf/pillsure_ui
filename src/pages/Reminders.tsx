
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Volume2, Smartphone, Edit, Plus, CalendarClock, CalendarDays } from "lucide-react";
import { reminders } from "@/lib/data";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import PillReminderCard from "@/components/reminders/PillReminderCard";

const Reminders = () => {
  const [activeReminders, setActiveReminders] = useState(reminders);
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  
  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

  // Mock notification settings
  const notificationSettings = [
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
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground">Manage your medication alerts</p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-1 rounded-full">
                {deviceMode === "daily" ? (
                  <CalendarClock className="h-5 w-5 text-blue-600" />
                ) : (
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  {deviceMode === "daily" ? "Daily Refill Mode" : "Multi-Day Refill Mode"}
                </h3>
                <p className="text-xs text-blue-700">
                  {deviceMode === "daily"
                    ? "Your device is configured for daily refills. You'll get reminders to fill your device once per day."
                    : "Your device is configured for 3-day refills. You'll get reminders to fill your device every 3 days."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="schedules">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedules" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Daily reminders</h2>
              <Button size="sm" variant="ghost" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            {activeReminders.map((reminder) => (
              <PillReminderCard 
                key={reminder.id} 
                reminder={reminder}
                onToggle={(id, active) => {
                  setActiveReminders(
                    activeReminders.map(r => 
                      r.id === id ? { ...r, active } : r
                    )
                  );
                  toast({
                    title: active ? "Reminder activated" : "Reminder deactivated",
                    description: `The reminder has been ${active ? 'activated' : 'deactivated'}`
                  });
                }}
                onEdit={(id) => {
                  toast({
                    title: "Edit reminder",
                    description: "Reminder editing functionality coming soon"
                  });
                }}
              />
            ))}
            
            {/* Special Refill Reminder based on device mode */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {deviceMode === "daily" ? (
                        <CalendarClock className="h-5 w-5 text-primary" />
                      ) : (
                        <CalendarDays className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {deviceMode === "daily" ? "Daily Device Refill" : "3-Day Device Refill"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {deviceMode === "daily" ? "Every day at 9:00 PM" : "Every 3 days at 9:00 PM"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notification preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <setting.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{setting.title}</h3>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Reminders;
