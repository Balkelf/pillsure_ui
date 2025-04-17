
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  CalendarClock, 
  Bell, 
  ClipboardCheck, 
  BarChart2,
  ArrowRight,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const InitialSetup = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<"daily" | "multiday" | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleContinue = () => {
    if (currentStep === 1 && !selectedMode) {
      toast.error("Please select a refill mode to continue");
      return;
    }

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    // Save selected mode to localStorage
    localStorage.setItem("pillsureMode", selectedMode || "daily");
    
    toast.success("Setup complete! You're ready to start managing your medications.");
    navigate("/");
  };

  const features = [
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Get notifications for all medication events",
    },
    {
      icon: ClipboardCheck,
      title: "Filling Guides",
      description: "Step-by-step instructions for your device",
    },
    {
      icon: BarChart2,
      title: "Progress Tracking",
      description: "Monitor your medication adherence over time",
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 py-6">
        <h1 className="text-xl font-bold text-center">PillSure Setup</h1>
      </header>

      <main className="flex-1 px-4 pb-6">
        {currentStep === 1 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Choose Your Refill Mode</h2>
              <p className="text-muted-foreground mt-2">
                Select how you prefer to organize medications in your PillSure device
              </p>
            </div>

            <RadioGroup 
              value={selectedMode || ""} 
              onValueChange={(value) => setSelectedMode(value as "daily" | "multiday")}
            >
              <Card className={`relative mb-4 cursor-pointer ${selectedMode === "daily" ? "border-primary" : ""}`}
                onClick={() => setSelectedMode("daily")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <CalendarClock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">Daily Refill</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Organize medications by time of day
                          </p>
                        </div>
                        <RadioGroupItem 
                          value="daily" 
                          id="daily" 
                          className="mt-1"
                        />
                      </div>

                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>Morning, Lunch, and Evening compartments</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>Refill your device once daily</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>Best for complex medication schedules</span>
                          </li>
                        </ul>
                      </div>

                      {selectedMode === "daily" && (
                        <Badge className="mt-4 bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`relative cursor-pointer ${selectedMode === "multiday" ? "border-primary" : ""}`}
                onClick={() => setSelectedMode("multiday")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">Multi-Day Refill</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Organize medications for multiple days at once
                          </p>
                        </div>
                        <RadioGroupItem 
                          value="multiday" 
                          id="multiday" 
                          className="mt-1"
                        />
                      </div>

                      <div className="mt-4 bg-muted/50 p-3 rounded-md">
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>3-day supply in each compartment</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>Less frequent refills</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            <span>Best for simpler medication schedules</span>
                          </li>
                        </ul>
                      </div>

                      {selectedMode === "multiday" && (
                        <Badge className="mt-4 bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">PillSure Features</h2>
              <p className="text-muted-foreground mt-2">
                Based on your {selectedMode === "daily" ? "Daily" : "Multi-Day"} refill selection, 
                you'll have access to these features:
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t p-4">
        {currentStep === 2 && (
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
        )}
        <Button 
          className="w-full md:w-auto"
          onClick={handleContinue}
        >
          {currentStep === 1 ? "Continue" : "Get Started"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
};

export default InitialSetup;
