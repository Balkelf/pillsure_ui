
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, AlertCircle } from "lucide-react";

const Medications = () => {
  // Mock medication data
  const medications = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["8:00 AM", "2:00 PM"],
      status: "taken",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["8:00 PM"],
      status: "upcoming",
    },
    {
      id: 3,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      times: ["8:00 AM"],
      status: "taken",
    },
    {
      id: 4,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      times: ["8:00 PM"],
      status: "upcoming",
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

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Manage your prescription schedule</p>
        </div>

        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4 space-y-4">
            {medications.map((med) => (
              <Card key={med.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {getStatusIcon(med.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} · {med.frequency}
                      </p>
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
          <TabsContent value="schedule" className="mt-4">
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Weekly schedule will be shown here
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Medication history will be shown here
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
