import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { format } from "date-fns";
import { CustomMedication } from "@/lib/types/medications";
import { toast } from "@/hooks/use-toast";
import AddMedicationForm from "@/components/medications/AddMedicationForm";
import TodaySchedule from "@/components/medications/TodaySchedule";
import ScheduleView from "@/components/medications/ScheduleView";
import InstructionsView from "@/components/medications/InstructionsView";
import CompartmentConfig from "@/components/medications/CompartmentConfig";

const Medications = () => {
  const startDate = "2023-04-10";
  const [currentTab, setCurrentTab] = useState("today");
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [customMedications, setCustomMedications] = useState<CustomMedication[]>([]);

  const calculateCurrentWeek = () => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 1;
    if (diffDays <= 14) return 2;
    return 3;
  };

  const currentWeek = calculateCurrentWeek();

  const getTodaySchedule = () => {
    switch(currentWeek) {
      case 1:
        return [{
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          frequency: "Once daily",
          times: ["8:00 AM"],
          status: "upcoming",
          week: 1,
          notes: "Take with breakfast"
        },
        {
          id: 4,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          times: ["8:00 AM"],
          status: "upcoming",
          notes: "For blood pressure management"
        },
        {
          id: 5,
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          times: ["7:00 PM"],
          status: "upcoming",
          notes: "Take in the evening for cholesterol management"
        }];
      case 2:
        return [{
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          times: ["8:00 AM", "7:00 PM"],
          status: "upcoming",
          week: 2,
          notes: "Take with breakfast and evening meal"
        },
        {
          id: 4,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          times: ["8:00 AM"],
          status: "upcoming",
          notes: "For blood pressure management"
        },
        {
          id: 5,
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          times: ["7:00 PM"],
          status: "upcoming",
          notes: "Take in the evening for cholesterol management"
        }];
      case 3:
      default:
        return [{
          id: 1,
          name: "Metformin",
          dosage: "500mg",
          frequency: "Three times daily",
          times: ["8:00 AM", "1:00 PM", "7:00 PM"],
          status: "upcoming",
          week: 3,
          notes: "Take with breakfast, lunch and evening meal starting from the third week"
        },
        {
          id: 4,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          times: ["8:00 AM"],
          status: "upcoming",
          notes: "For blood pressure management"
        },
        {
          id: 5,
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          times: ["7:00 PM"],
          status: "upcoming",
          notes: "Take in the evening for cholesterol management"
        }];
    }
  };

  const getCompartmentConfig = () => {
    if (deviceMode === "daily") {
      switch(currentWeek) {
        case 1:
          return [
            { 
              id: 1, 
              name: "Morning", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 1, time: "8:00 AM" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 1, time: "8:00 AM" }
              ]
            },
            { 
              id: 2, 
              name: "Evening", 
              maxCapacity: 5,
              currentCapacity: 1,
              medications: [
                { id: 3, name: "Atorvastatin", dosage: "20mg", count: 1, time: "7:00 PM" }
              ]
            }
          ];
        case 2:
          return [
            { 
              id: 1, 
              name: "Morning", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 1, time: "8:00 AM" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 1, time: "8:00 AM" }
              ]
            },
            { 
              id: 2, 
              name: "Evening", 
              maxCapacity: 5,
              currentCapacity: 2,
              medications: [
                { id: 3, name: "Metformin", dosage: "500mg", count: 1, time: "7:00 PM" },
                { id: 4, name: "Atorvastatin", dosage: "20mg", count: 1, time: "7:00 PM" }
              ]
            }
          ];
        case 3:
        default:
          return [
            { 
              id: 1, 
              name: "Morning", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 1, time: "8:00 AM" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 1, time: "8:00 AM" }
              ]
            },
            { 
              id: 2, 
              name: "Lunch", 
              maxCapacity: 5,
              currentCapacity: 1,
              medications: [
                { id: 3, name: "Metformin", dosage: "500mg", count: 1, time: "1:00 PM" }
              ]
            },
            { 
              id: 3, 
              name: "Evening", 
              maxCapacity: 5,
              currentCapacity: 2,
              medications: [
                { id: 4, name: "Metformin", dosage: "500mg", count: 1, time: "7:00 PM" },
                { id: 5, name: "Atorvastatin", dosage: "20mg", count: 1, time: "7:00 PM" }
              ]
            }
          ];
      }
    } else {
      switch(currentWeek) {
        case 1:
          return [
            { 
              id: 1, 
              name: "3-Day Supply (Morning)", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 3, time: "8:00 AM (3 days)" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 3, time: "8:00 AM (3 days)" }
              ]
            },
            { 
              id: 2, 
              name: "3-Day Supply (Evening)", 
              maxCapacity: 5,
              currentCapacity: 3,
              medications: [
                { id: 3, name: "Atorvastatin", dosage: "20mg", count: 3, time: "7:00 PM (3 days)" }
              ]
            }
          ];
        case 2:
          return [
            { 
              id: 1, 
              name: "3-Day Supply (Morning)", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 3, time: "8:00 AM (3 days)" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 3, time: "8:00 AM (3 days)" }
              ]
            },
            { 
              id: 2, 
              name: "3-Day Supply (Evening)", 
              maxCapacity: 5,
              currentCapacity: 3,
              medications: [
                { id: 3, name: "Metformin", dosage: "500mg", count: 3, time: "7:00 PM (3 days)" },
                { id: 4, name: "Atorvastatin", dosage: "20mg", count: 3, time: "7:00 PM (3 days)" }
              ]
            }
          ];
        case 3:
        default:
          return [
            { 
              id: 1, 
              name: "3-Day Supply (Morning)", 
              maxCapacity: 5,
              currentCapacity: 5,
              medications: [
                { id: 1, name: "Metformin", dosage: "500mg", count: 3, time: "8:00 AM (3 days)" },
                { id: 2, name: "Lisinopril", dosage: "10mg", count: 3, time: "8:00 AM (3 days)" }
              ]
            },
            { 
              id: 2, 
              name: "3-Day Supply (Lunch)", 
              maxCapacity: 5,
              currentCapacity: 3,
              medications: [
                { id: 3, name: "Metformin", dosage: "500mg", count: 3, time: "1:00 PM (3 days)" }
              ]
            },
            { 
              id: 3, 
              name: "3-Day Supply (Evening)", 
              maxCapacity: 5,
              currentCapacity: 3,
              medications: [
                { id: 4, name: "Metformin", dosage: "500mg", count: 3, time: "7:00 PM (3 days)" },
                { id: 5, name: "Atorvastatin", dosage: "20mg", count: 3, time: "7:00 PM (3 days)" }
              ]
            }
          ];
      }
    }
  };

  const metforminSchedule = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Once daily",
      times: ["8:00 AM"],
      status: "upcoming",
      week: 1,
      notes: "Take with breakfast for the first week",
      compartment: "Morning Compartment",
      refillFrequency: "May need to refill every 4-5 days"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["8:00 AM", "7:00 PM"],
      status: "upcoming",
      week: 2,
      notes: "Take with breakfast and evening meal for the second week",
      compartment: "Morning & Evening Compartments",
      refillFrequency: "May need to refill every 2-3 days"
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Three times daily",
      times: ["8:00 AM", "1:00 PM", "7:00 PM"],
      status: "upcoming",
      week: 3,
      notes: "Take with breakfast, lunch and evening meal starting from the third week",
      compartment: "Morning, Lunch & Evening Compartments",
      refillFrequency: "May need to refill every 1-2 days"
    },
  ];

  const otherMedications = [
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["8:00 AM"],
      status: "upcoming",
      notes: "For blood pressure management",
      compartment: "Morning Compartment",
      refillFrequency: "Refill every 5 days (sharing compartment with Metformin)"
    },
    {
      id: 5,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      times: ["7:00 PM"],
      status: "upcoming",
      notes: "For cholesterol management, take in the evening",
      compartment: "Evening Compartment",
      refillFrequency: "Refill every 5 days"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Check className="h-5 w-5 text-secondary" />;
      case "missed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "upcoming":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const week1Start = new Date(startDate);
  const week2Start = addDays(new Date(startDate), 7);
  const week3Start = addDays(new Date(startDate), 14);

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const handleConfigureCompartments = () => {
    setCurrentTab("configure");
  };

  const handleAddMedication = (medication: CustomMedication) => {
    setCustomMedications([...customMedications, medication]);
    toast({
      title: "Medication added",
      description: `${medication.name} has been added to your schedule`,
    });
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Manage your prescription schedule</p>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-1 rounded-full">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Metformin Titration</h3>
                <p className="text-xs text-blue-700">
                  Your Metformin schedule gradually increases over 3 weeks to help your body adjust to the medication.
                  Configure your PillSure device compartments to manage your dosage schedule.
                </p>
                <div className="mt-1 text-xs text-blue-700 flex items-center">
                  Started on {format(new Date(startDate), 'MMM d, yyyy')} - Currently in Week {calculateCurrentWeek()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="today" onValueChange={setCurrentTab} value={currentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-4">
            <TodaySchedule
              schedule={getTodaySchedule()}
              customMedications={customMedications}
            />
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-4">
            <ScheduleView
              metforminSchedule={metforminSchedule}
              otherMedications={otherMedications}
              currentWeek={calculateCurrentWeek()}
              startDate={startDate}
            />
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <InstructionsView
              currentWeek={calculateCurrentWeek()}
              deviceMode={deviceMode}
              getCompartmentConfig={getCompartmentConfig}
            />
          </TabsContent>
          
          <TabsContent value="configure" className="mt-4">
            <CompartmentConfig
              deviceMode={deviceMode}
              setDeviceMode={setDeviceMode}
              currentWeek={calculateCurrentWeek()}
              handleConfigureCompartments={handleConfigureCompartments}
              getCompartmentConfig={getCompartmentConfig}
            />
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button 
            className="w-full" 
            onClick={() => setShowAddMedication(true)}
          >
            Add new medication
          </Button>
        </div>
      </div>

      {showAddMedication && (
        <AddMedicationForm
          open={showAddMedication}
          onOpenChange={setShowAddMedication}
          onSave={handleAddMedication}
        />
      )}
    </MobileLayout>
  );
};

export default Medications;
