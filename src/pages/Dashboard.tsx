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
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { lastBoxEvent, lastButtonEvent } = useDeviceEventsContext();
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
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

  // Show toast notification when a box is opened
  useEffect(() => {
    if (lastBoxEvent?.event === "opened") {
      toast.info(`Box ${lastBoxEvent.boxId} was opened`, {
        description: `Box ${lastBoxEvent.boxId} has been opened in your smart dispenser.`,
      });
    }
  }, [lastBoxEvent]);

  // Show toast notification when a button is pressed
  useEffect(() => {
    if (lastButtonEvent) {
      const time = new Date(lastButtonEvent.timestamp).toLocaleTimeString();
      toast.success(`Button Press Detected`, {
        description: `A button was pressed on device ${lastButtonEvent.deviceId} at ${time}`,
        duration: 5000,
      });
    }
  }, [lastButtonEvent]);

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

        <InsightCard />

        <DailyCompartments deviceMode={deviceMode} />

        <MotivationalWidget />

        <CareNetworkCard />
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
