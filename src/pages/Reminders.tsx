import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Volume2, Smartphone, Edit, Plus, CalendarClock, CalendarDays, MapPin } from "lucide-react";
import { reminders } from "@/lib/data";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import PillReminderCard from "@/components/reminders/PillReminderCard";
import SmartReminderCard from "@/components/reminders/SmartReminderCard";
import { SmartReminder } from "@/lib/types/reminders";

const Reminders = () => {
  const [activeReminders, setActiveReminders] = useState(reminders);
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [smartReminders] = useState<SmartReminder[]>([
    {
      id: "smart1",
      medicationId: "med1",
      time: "08:00",
      active: true,
      type: "daily",
      smartType: "both",
      location: {
        name: "Home",
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 100
      }
    },
    {
      id: "smart2",
      medicationId: "med2",
      time: "20:00",
      active: true,
      type: "daily",
      smartType: "location",
      location: {
        name: "Office",
        latitude: 37.7833,
        longitude: -122.4167,
        radius: 100
      }
    }
  ]);

  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground font-light">Manage your medication alerts</p>
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

        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Smart reminders</h2>
            <Button size="sm" variant="ghost" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          
          {smartReminders.map((reminder) => (
            <SmartReminderCard 
              key={reminder.id} 
              reminder={reminder}
              onToggle={(id, active) => {
                toast({
                  title: active ? "Smart reminder activated" : "Smart reminder deactivated",
                  description: `The smart reminder has been ${active ? 'activated' : 'deactivated'}`
                });
              }}
              onEdit={(id) => {
                toast({
                  title: "Edit smart reminder",
                  description: "Smart reminder editing functionality coming soon"
                });
              }}
            />
          ))}

          <div className="flex justify-between items-center mt-6">
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
                    <p className="text-sm text-muted-foreground font-light">
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
        </div>
      </div>
    </MobileLayout>
  );
};

export default Reminders;
