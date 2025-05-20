import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SunMedium, Moon, Info, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  taken: boolean;
}

interface Compartment {
  id: number;
  name: "Morning" | "Lunch" | "Evening";
  medications: Medication[];
}

interface DailyCompartmentsProps {
  className?: string;
  deviceMode: "daily" | "multiday";
}

const DailyCompartments = ({ className, deviceMode = "daily" }: DailyCompartmentsProps) => {
  // Example data - in a real app, this would come from a backend or parent component
  const [compartments, setCompartments] = useState<Compartment[]>([
    {
      id: 1,
      name: "Morning",
      medications: [
        {
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          time: "8:00 AM",
          instructions: "Take with breakfast to reduce stomach upset. Initially 500 mg once daily for at least 1 week, dose to be taken with breakfast.",
          taken: true,
        },
      ],
    },
    {
      id: 2,
      name: "Lunch",
      medications: [
        {
          id: 2,
          name: "Metformin",
          dosage: "500mg",
          time: "1:00 PM",
          instructions: "Take with lunch to reduce stomach upset. Then 500 mg twice daily for at least 1 week, dose to be taken with lunch.",
          taken: false,
        },
      ],
    },
    {
      id: 3,
      name: "Evening",
      medications: [
        {
          id: 3,
          name: "Metformin",
          dosage: "500mg",
          time: "7:00 PM",
          instructions: "Take with dinner to reduce stomach upset. Then 500 mg 3 times a day, dose to be taken with dinner.",
          taken: false,
        },
      ],
    },
  ]);

  const getCompartmentIcon = (name: string) => {
    switch (name) {
      case "Morning":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7.5V10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.92993 10.9297L6.33993 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 18H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 18H22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.0699 10.9297L17.6599 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 22H2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 18C16 16.9391 15.5786 15.9217 14.8284 15.1716C14.0783 14.4214 13.0609 14 12 14C10.9391 14 9.92172 14.4214 9.17157 15.1716C8.42143 15.9217 8 16.9391 8 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "Lunch":
        return <SunMedium className="h-10 w-10 text-black" />;
      case "Evening":
        return <Moon className="h-10 w-10 text-black" />;
      default:
        return <SunMedium className="h-10 w-10 text-black" />;
    }
  };

  const toggleMedicationTaken = (compartmentId: number, medicationId: number) => {
    setCompartments(
      compartments.map((compartment) => {
        if (compartment.id === compartmentId) {
          return {
            ...compartment,
            medications: compartment.medications.map((medication) => {
              if (medication.id === medicationId) {
                return { ...medication, taken: !medication.taken };
              }
              return medication;
            }),
          };
        }
        return compartment;
      })
    );
  };

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Today</CardTitle>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground font-light">Compartments</p>
          <span className={cn(
            "text-sm text-blue-600 font-medium bg-blue-50 px-6 py-1.5 rounded-full",
            deviceMode === "multiday" && "text-purple-600 bg-purple-50"
          )}>
            {deviceMode === "daily" ? "Daily Refill Mode" : "Multi-Day Refill Mode"}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          {compartments.map((compartment, index) => (
            <div key={compartment.id}>
              <div className="flex items-center py-2">
                <div className="flex-1 flex items-start">
                  <div className="flex flex-col items-center mr-6 w-16">
                    <div className="p-2">
                      {getCompartmentIcon(compartment.name)}
                    </div>
                    <span className="text-xs mt-1">{compartment.name}</span>
                  </div>

                  <div className="flex-1">
                    {compartment.medications.map((medication) => (
                      <div key={medication.id} className="space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{medication.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {medication.dosage}
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                  <Info className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p className="text-xs">{medication.instructions}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-xs text-muted-foreground font-light">
                          {medication.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-12 w-12 flex items-center justify-center",
                    compartment.medications[0]?.taken
                      ? "text-green-500 bg-green-50 hover:bg-green-100 hover:text-green-600"
                      : "text-muted-foreground hover:text-muted-foreground/80"
                  )}
                  onClick={() => 
                    toggleMedicationTaken(compartment.id, compartment.medications[0]?.id)
                  }
                >
                  <Check 
                    className={cn(
                      "h-8 w-8", 
                      compartment.medications[0]?.taken 
                        ? "text-green-500" 
                        : "text-muted-foreground/50"
                    )} 
                  />
                </Button>
              </div>
              {index < compartments.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCompartments; 