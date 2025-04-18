
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Clock } from "lucide-react";
import { CustomMedication } from "@/lib/types/medications";

interface TodayScheduleProps {
  schedule: Array<{
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    status: string;
    notes?: string;
    week?: number;
  }>;
  customMedications: CustomMedication[];
}

const TodaySchedule = ({ schedule, customMedications }: TodayScheduleProps) => {
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

  const combinedSchedule = [...schedule, 
    ...customMedications.map(med => ({
      id: Number(med.id),
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency === 'once' ? 'Once daily' :
                med.frequency === 'twice' ? 'Twice daily' :
                med.frequency === 'three_times' ? 'Three times daily' :
                'Custom',
      times: med.times,
      status: "upcoming",
      notes: med.instructions
    }))
  ];

  return (
    <div className="space-y-4">
      {combinedSchedule.map((med) => (
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
    </div>
  );
};

export default TodaySchedule;
