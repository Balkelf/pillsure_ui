
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import LoginSection from "@/components/auth/LoginSection";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { toast } from "@/hooks/use-toast";

const InitialSetup = () => {
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (activeTab === "create") {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "All fields are required",
          description: "Please fill in all fields to continue",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please ensure both passwords match",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Save device mode to localStorage
    localStorage.setItem("pillsureMode", deviceMode);
    
    // In a real app, we would handle account creation here
    toast({
      title: "Setup complete",
      description: activeTab === "create" 
        ? "Your account has been created successfully" 
        : "You have successfully logged in"
    });
    
    navigate("/");
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google login",
      description: "Google authentication would be triggered here"
    });
    
    // In a real app with OAuth, we would handle Google login
    // For demo purposes, we'll save device mode and redirect
    localStorage.setItem("pillsureMode", deviceMode);
    navigate("/");
  };
  
  const handleAppleLogin = () => {
    toast({
      title: "Apple login",
      description: "Apple authentication would be triggered here"
    });
    
    // In a real app with OAuth, we would handle Apple login
    // For demo purposes, we'll save device mode and redirect
    localStorage.setItem("pillsureMode", deviceMode);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PillSure</h1>
          <p className="text-muted-foreground mt-2">Your personal medication assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Device Configuration</CardTitle>
            <CardDescription>
              Select how you want to configure your PillSure device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ToggleGroup
                type="single"
                value={deviceMode}
                onValueChange={(value) => {
                  if (value) setDeviceMode(value as "daily" | "multiday");
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="daily" className="whitespace-nowrap">
                  <span className="text-sm">Daily Dispensing</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="multiday" className="whitespace-nowrap">
                  <span className="text-sm">3-Day Supply</span>
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  {deviceMode === "daily"
                    ? "Daily mode: Refill compartments each day for your daily medication needs."
                    : "3-Day mode: Each compartment holds a 3-day supply of medications. Less frequent refills required."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Account</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button 
                    type="button" 
                    className="w-full"
                    onClick={handleContinue}
                  >
                    Create Account
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <OAuthButtons 
                  onGoogleLogin={handleGoogleLogin}
                  onAppleLogin={handleAppleLogin}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="login" className="mt-4">
            <LoginSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InitialSetup;
