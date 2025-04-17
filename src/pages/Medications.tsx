
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, AlertCircle, Info, Calendar, FileText, PillIcon, Bell } from "lucide-react";
import { useState } from "react";
import { format, addDays, isAfter, isBefore, parseISO } from "date-fns";

const Medications = () => {
  const startDate = "2023-04-10"; // Would come from user settings in a real app
  const [currentTab, setCurrentTab] = useState("today");
  
  // Calculate the current week in the titration schedule
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
  
  // Determine current medication schedule based on week
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
        }];
    }
  };

  // Metformin titration schedule data
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
      compartment: "Compartment 1",
      refillFrequency: "Refill every 5 days"
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
      compartment: "Compartment 2",
      refillFrequency: "Refill every 2-3 days"
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
      compartment: "Compartment 3",
      refillFrequency: "Refill every 1-2 days"
    },
  ];
  
  // Other medications
  const otherMedications = [
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["8:00 PM"],
      status: "upcoming",
      notes: "For blood pressure management"
    },
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

  // Calculate dates for the titration schedule
  const week1Start = new Date(startDate);
  const week2Start = addDays(new Date(startDate), 7);
  const week3Start = addDays(new Date(startDate), 14);
  
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
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
                  PillSure has sorted your doses into the 3 compartments of your device.
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
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
            
            {/* Display other medications that are not part of the titration */}
            {otherMedications.map((med) => (
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
                      Your PillSure device has 3 compartments for your Metformin titration schedule
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
                    <h4 className="text-sm font-medium text-yellow-800 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Important: Capacity Limit
                    </h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Each compartment holds a maximum of 5 tablets. Please follow the refill schedule below.
                    </p>
                  </div>
                  
                  {metforminSchedule.map((med) => (
                    <div key={med.id} className="flex gap-3">
                      <div className="bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center text-sm font-medium text-gray-700">
                        {med.week}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {med.compartment}
                        </h4>
                        <p className="text-sm">
                          Fill with 5 tablets of Metformin {med.dosage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          For {med.frequency.toLowerCase()} ({med.times.length} per day)
                        </p>
                        <p className="text-xs text-primary mt-1">
                          <Bell className="h-3 w-3 inline mr-1" />
                          {med.refillFrequency}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    Dose can be increased if necessary up to maximum 2 g per day.
                  </p>
                  <p className="text-xs font-medium text-blue-800 mt-2">
                    Device Features:
                  </p>
                  <ul className="text-xs text-blue-700 list-disc ml-4 mt-1">
                    <li>Lid sensors detect when medication is taken</li>
                    <li>Alarm/buzzer reminds you when it's time for your medication</li>
                    <li>Vibration alerts provide discreet reminders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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
