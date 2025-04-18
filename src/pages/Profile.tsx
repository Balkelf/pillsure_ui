
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  UserCog,
  Bell,
  Shield,
} from "lucide-react";
import { useState } from "react";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Maria Anderson",
    email: "maria.anderson@example.com"
  });

  const menuItems = [
    {
      icon: Users,
      title: "Care Network",
      description: "Manage your caregivers",
      path: "/care-network",
    },
    {
      icon: UserCog,
      title: "Account Settings",
      description: "Update your information",
      path: "/account-settings",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your alerts",
      path: "/notifications",
    },
    {
      icon: Shield,
      title: "Privacy & Data",
      description: "Control your information",
      path: "/privacy",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get assistance",
      path: "/help",
    },
  ];

  const handleProfileUpdate = (name: string, email: string) => {
    setProfileData({ name, email });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // In a real app with authentication, we would handle actual logout here
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.email}</p>
              </div>
            </div>
            <div className="mt-4">
              <ProfileEditDialog 
                name={profileData.name}
                email={profileData.email}
                onSave={handleProfileUpdate}
                trigger={<Button variant="outline" className="w-full">Edit Profile</Button>}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Device Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Pillsure Smart Dispenser</h3>
                  <p className="text-sm text-muted-foreground">
                    Connected · Last synced: 10 mins ago
                  </p>
                </div>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Card key={item.title} className="overflow-hidden hover:bg-muted/50 transition-colors">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-none h-auto py-4 px-4"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Profile;
