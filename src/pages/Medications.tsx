
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, AlertCircle, Info } from "lucide-react";

const Medications = () => {
  // Metformin titration schedule data
  const medications = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Once daily",
      times: ["7:00 PM"],
      status: "upcoming",
      week: 1,
      notes: "Take after dinner for the first week"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["8:00 AM", "7:00 PM"],
      status: "upcoming",
      week: 2,
      notes: "Take after breakfast and dinner for the second week"
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Three times daily",
      times: ["8:00 AM", "1:00 PM", "7:00 PM"],
      status: "upcoming",
      week: 3,
      notes: "Take after each meal starting from the third week"
    },
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
                  PillSure has sorted your doses into the 3 compartments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4 space-y-4">
            {medications.filter(med => med.id === 1 || med.id === 4).map((med) => (
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
            {medications.filter(med => med.id <= 3).map((med) => (
              <Card key={med.id} className={med.id === 1 ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        Week {med.week}: {med.name} {med.dosage}
                      </h3>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <h3 className="text-md font-medium mt-6">Other Medications</h3>
            {medications.filter(med => med.id === 4).map((med) => (
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
