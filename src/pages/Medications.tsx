import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, AlertCircle, Info, Calendar, FileText, PillIcon, Bell, Settings } from "lucide-react";
import { useState } from "react";
import { format, addDays } from "date-fns";
import DeviceStatusCard from "@/components/dashboard/DeviceStatusCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Medications = () => {
  const startDate = "2023-04-10";
  const [currentTab, setCurrentTab] = useState("today");
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");

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
                  <Calendar className="h-3 w-3 mr-1" />
                  Started on {format(new Date(startDate), 'MMM d, yyyy')} - Currently in Week {currentWeek}
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
          
          <TabsContent value="today" className="mt-4 space-y-4">
            {getTodaySchedule().map((med) => (
              <Card key={med.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {getStatusIcon(med.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{med.name} {med.dosage}</h3>
                      <p className="text-sm text-muted-foreground">
                        {med.frequency}
                        {med.week && ` • Week ${med.week}`}
                      </p>
                      {med.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {med.times.join(", ")}
                    </div>
                  </div>
                  {med.status === "upcoming" && (
                    <div className="border-t px-4 py-3 flex gap-2">
                      <Button size="sm" className="flex-1">
                        Take now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Skip
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-4 space-y-4">
            <h3 className="text-md font-medium">Metformin Titration Schedule</h3>
            {metforminSchedule.map((med) => (
              <Card key={med.id} className={med.week === currentWeek ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">
                          Week {med.week}: {med.name} {med.dosage}
                        </h3>
                        {med.week === currentWeek && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      <p className="text-xs text-muted-foreground">
                        {med.week === 1 && formatDateRange(week1Start, addDays(week1Start, 6))}
                        {med.week === 2 && formatDateRange(week2Start, addDays(week2Start, 6))}
                        {med.week === 3 && `From ${format(week3Start, 'MMM d, yyyy')} onwards`}
                      </p>
                      {med.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>
                      )}
                      <div className="flex items-center text-xs text-primary mt-1">
                        <div className="flex-1">
                          {med.compartment} in your PillSure device
                        </div>
                        <div className="flex items-center">
                          <Bell className="h-3 w-3 mr-1" />
                          {med.refillFrequency}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <h3 className="text-md font-medium mt-6">Other Medications</h3>
            {otherMedications.map((med) => (
              <Card key={med.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{med.name} {med.dosage}</h3>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">How to Fill Your PillSure Device</h3>
                    <p className="text-sm text-muted-foreground">
                      Your PillSure device has multiple compartments for your medication schedule
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
                    <h4 className="text-sm font-medium text-yellow-800 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Important Compartment Guidelines
                    </h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Each compartment has a maximum capacity of 5 tablets and should only contain one type of medication. 
                      Do not mix different medications in the same compartment.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Week {currentWeek} Configuration:</h4>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <h5 className="text-sm font-medium text-blue-800">Current Compartment Setup</h5>
                      <p className="text-xs text-blue-700 mt-1">
                        {currentWeek === 1 && deviceMode === "daily" && "One daily dose: Configure the Morning compartment"}
                        {currentWeek === 2 && deviceMode === "daily" && "Two daily doses: Configure Morning and Evening compartments"}
                        {currentWeek === 3 && deviceMode === "daily" && "Three daily doses: Configure Morning, Lunch, and Evening compartments"}
                        {currentWeek === 1 && deviceMode === "multiday" && "One daily dose: 3-day supply in the Morning compartment"}
                        {currentWeek === 2 && deviceMode === "multiday" && "Two daily doses: 3-day supply in the Morning and Evening compartments"}
                        {currentWeek === 3 && deviceMode === "multiday" && "Three daily doses: 3-day supply in the Morning, Lunch, and Evening compartments"}
                      </p>
                      <div className="mt-2 space-y-2">
                        {getCompartmentConfig().map((compartment, index) => (
                          <div key={index} className="text-xs text-blue-800 flex items-center">
                            <PillIcon className="h-3 w-3 mr-1" />
                            <span className="font-medium">{compartment.name} Compartment:</span>
                            <ul className="ml-2">
                              {compartment.medications.map((med, i) => (
                                <li key={i}>{med.count}x {med.name} {med.dosage}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-3 rounded-md border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 flex items-center">
                      <PillIcon className="h-4 w-4 mr-1" />
                      Metformin Dosing Instructions
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Initially 500 mg once daily for at least 1 week, dose to be taken with breakfast, then 500 mg twice daily for at least 1 week, dose to be taken with breakfast and evening meal, then 500 mg 3 times a day, dose to be taken with breakfast, lunch and evening meal.
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Each compartment can hold up to 5 tablets of a single medication type. As your dosage increases, you'll need more compartments and more frequent refills.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configure" className="mt-4 space-y-4">
            <h3 className="text-md font-medium">Configure Device Compartments</h3>
            <p className="text-sm text-muted-foreground">
              Each compartment can hold up to 5 tablets of a single medication type. Configure separate compartments for each medication.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
              <h4 className="text-sm font-medium text-blue-800">Device Mode</h4>
              <p className="text-xs text-blue-700 mt-1 mb-3">
                Select your preferred dispensing mode for your PillSure device
              </p>
              
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
              
              <div className="mt-3 text-xs text-blue-700">
                {deviceMode === "daily" ? (
                  <p>Daily mode: Refill compartments each day for your daily medication needs.</p>
                ) : (
                  <p>3-Day mode: Each compartment holds a 3-day supply of medications. Less frequent refills required.</p>
                )}
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
              <h4 className="text-sm font-medium text-amber-800 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Important: One Medication Per Compartment
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                To prevent confusion when taking medications on future days, each compartment should only contain one type of medication.
              </p>
            </div>
            
            <DeviceStatusCard 
              onConfigureCompartments={handleConfigureCompartments} 
            />
            
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mt-4">
              <h4 className="text-sm font-medium text-yellow-800 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Refill Recommendations
              </h4>
              <p className="text-xs text-yellow-700 mt-1">
                {deviceMode === "daily" && currentWeek === 1 && "With one daily dose, you'll likely need to refill every day."}
                {deviceMode === "daily" && currentWeek === 2 && "With two daily doses, you'll likely need to refill every day."}
                {deviceMode === "daily" && currentWeek === 3 && "With three daily doses, you'll need to refill daily."}
                {deviceMode === "multiday" && currentWeek === 1 && "With one daily dose in 3-day mode, you'll need to refill every 3 days."}
                {deviceMode === "multiday" && currentWeek === 2 && "With two daily doses in 3-day mode, you'll need to refill every 3 days."}
                {deviceMode === "multiday" && currentWeek === 3 && "With three daily doses in 3-day mode, you'll need to refill every 3 days."}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <Button className="w-full">
            Add new medication
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Medications;
