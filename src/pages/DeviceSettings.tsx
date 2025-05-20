import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sun, SunMedium, Moon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const DeviceSettings = () => {
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [deviceName, setDeviceName] = useState("Maria's Pillsure");

  useEffect(() => {
    const savedMode = localStorage.getItem("pillsureMode") as "daily" | "multiday" | null;
    if (savedMode) {
      setDeviceMode(savedMode);
    }
  }, []);

  const handleModeChange = (value: "daily" | "multiday") => {
    setDeviceMode(value);
    localStorage.setItem("pillsureMode", value);
    toast({
      title: "Device mode updated",
      description: `Your device is now set to ${value === "daily" ? "Daily Dispensing" : "3-Day Supply"} mode.`
    });
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pillsure Device</h1>
          <p className="text-muted-foreground font-light">Configure your medication dispenser</p>
        </div>

        {/* Device Name */}
        <div>
          <h3 className="text-lg font-semibold">Device name</h3>
          <p className="text-muted-foreground font-light mb-3">Current device: {deviceName}</p>
          <Button className="w-full" variant="outline">Change device name</Button>
        </div>

        {/* Dispensing Mode */}
        <div>
          <h3 className="text-lg font-semibold">Dispensing mode</h3>
          <p className="text-muted-foreground font-light mb-3">Select your preferred dispensing mode</p>
          
          <RadioGroup 
            value={deviceMode === "daily" ? "daily" : "multiday"}
            onValueChange={(value) => handleModeChange(value as "daily" | "multiday")}
            className="space-y-0"
          >
            <label 
              htmlFor="daily" 
              className={`flex items-center justify-between p-4 rounded-t-md border ${deviceMode === "daily" ? "bg-blue-50 border-blue-100" : "bg-background border-input"} hover:border-slate-300 transition-colors cursor-pointer group`}
              onClick={() => handleModeChange("daily")}
            >
              <div className="grid gap-1">
                <span className="font-medium cursor-pointer">Daily Dispensing</span>
                <p className="text-sm text-muted-foreground font-light">
                  Refill compartments each day for your daily medication needs
                </p>
              </div>
              <RadioGroupItem value="daily" id="daily" className="focus:outline-none" />
            </label>

            <label 
              htmlFor="multiday" 
              className={`flex items-center justify-between p-4 rounded-b-md border border-t-0 ${deviceMode === "multiday" ? "bg-blue-50 border-blue-100" : "bg-background border-input"} hover:border-slate-300 transition-colors cursor-pointer group`}
              onClick={() => handleModeChange("multiday")}
            >
              <div className="grid gap-1">
                <span className="font-medium cursor-pointer">3-Day Supply</span>
                <p className="text-sm text-muted-foreground font-light">
                  Fill each compartment for 3 days of your medications
                </p>
              </div>
              <RadioGroupItem value="multiday" id="multiday" className="focus:outline-none" />
            </label>
          </RadioGroup>
        </div>

        {/* Current Compartment Setup */}
        <div>
          <h3 className="text-lg font-semibold">Current compartment setup</h3>
          
          {/* Medication Schedule Card */}
          <Card className="mt-3 border shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between mb-4">
                <div className="flex flex-col items-center">
                  <Sun className="text-amber-500 mb-1" />
                  <span className="text-sm">Morning</span>
                </div>
                <div className="flex flex-col items-center">
                  <SunMedium className="text-amber-600 mb-1" />
                  <span className="text-sm">Lunch</span>
                </div>
                <div className="flex flex-col items-center">
                  <Moon className="text-indigo-500 mb-1" />
                  <span className="text-sm">Evening</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-left">
                  <p className="text-sm">1 Metformin 500mg</p>
                  <p className="text-sm">1 Atorvastatin 20mg</p>
                </div>
                <div className="text-left">
                  <p className="text-sm">1 Metformin 500mg</p>
                </div>
                <div className="text-left">
                  <p className="text-sm">1 Metformin 500mg</p>
                  <p className="text-sm">1 Atorvastatin 20mg</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Important Compartment Guidelines */}
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mt-3">
            <h4 className="text-sm font-medium text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Important Compartment Guidelines
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Each compartment has a maximum capacity of 5 tablets and should only contain one type of medication. 
              Do not mix different medications in the same compartment.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mt-3">
            <h4 className="text-sm font-medium text-amber-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Important: One Medication Per Compartment
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              To prevent confusion when taking medications on future days, each compartment should only contain one type of medication.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DeviceSettings; 