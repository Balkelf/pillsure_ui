
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    
    if (accessToken) {
      localStorage.setItem("pillsureMode", deviceMode);
      navigate("/");
    }
  }, [deviceMode, navigate]);

  const handleSkip = () => {
    localStorage.setItem("pillsureMode", deviceMode);
    toast({
      title: "Test mode activated",
      description: "Skipped login for testing purposes"
    });
    navigate("/");
  };

  const handleContinue = async () => {
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

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (error) {
        toast({
          title: "Error creating account",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
    }
    
    localStorage.setItem("pillsureMode", deviceMode);
    
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
    
    localStorage.setItem("pillsureMode", deviceMode);
    navigate("/");
  };
  
  const handleAppleLogin = () => {
    toast({
      title: "Apple login",
      description: "Apple authentication would be triggered here"
    });
    
    localStorage.setItem("pillsureMode", deviceMode);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PillSure</h1>
          <p className="text-muted-foreground font-light mt-2">Your personal medication assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Device Configuration</CardTitle>
            <CardDescription>
              Choose how you want to organize your medication schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 Recommendation for New Users
                </p>
                <p className="text-sm text-blue-800">
                  If you're just starting out, we recommend the Daily Dispensing mode. 
                  Daily refills help build a consistent medication routine and make it 
                  easier to track your progress. You can always switch to a 3-Day Supply 
                  mode later as you become more comfortable with your medication schedule.
                </p>
              </div>

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

              <div className="bg-secondary/5 p-3 rounded-md">
                <p className="text-sm text-muted-foreground font-light">
                  {deviceMode === "daily"
                    ? "✓ Perfect for building habits - refill compartments each day for your daily medication needs. Ideal for new users and those building medication routines."
                    : "✓ Each compartment holds a 3-day supply of medications. Fewer refills required, best for experienced users with established routines."}
                </p>
              </div>

              {/* Add a skip button for testing purposes */}
              <Button variant="outline" className="w-full mt-4" onClick={handleSkip}>
                Skip Login (Testing Only)
              </Button>
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
                    <span className="px-2 bg-background text-muted-foreground font-light">Or continue with</span>
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
