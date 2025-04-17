
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Volume2, Smartphone, Edit, Plus } from "lucide-react";
import { reminders } from "@/lib/data";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PillReminderCard from "@/components/reminders/PillReminderCard";

const Reminders = () => {
  const [activeReminders, setActiveReminders] = useState(reminders);

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
  ];

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground">Manage your medication alerts</p>
        </div>

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
