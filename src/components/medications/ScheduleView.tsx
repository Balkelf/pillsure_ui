
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format, addDays } from "date-fns";

interface ScheduleViewProps {
  metforminSchedule: Array<{
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    status: string;
    week: number;
    notes?: string;
    compartment?: string;
    refillFrequency?: string;
  }>;
  otherMedications: Array<{
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    status: string;
    notes?: string;
    compartment?: string;
    refillFrequency?: string;
  }>;
  currentWeek: number;
  startDate: string;
}

const ScheduleView = ({
  metforminSchedule,
  otherMedications,
  currentWeek,
  startDate,
}: ScheduleViewProps) => {
  const week1Start = new Date(startDate);
  const week2Start = addDays(new Date(startDate), 7);
  const week3Start = addDays(new Date(startDate), 14);

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground font-light">{med.frequency}</p>
                <p className="text-xs text-muted-foreground font-light">
                  {med.week === 1 && formatDateRange(week1Start, addDays(week1Start, 6))}
                  {med.week === 2 && formatDateRange(week2Start, addDays(week2Start, 6))}
                  {med.week === 3 && `From ${format(week3Start, 'MMM d, yyyy')} onwards`}
                </p>
                {med.notes && (
                  <p className="text-xs text-muted-foreground font-light mt-1">{med.notes}</p>
                )}
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
                <p className="text-sm text-muted-foreground font-light">{med.frequency}</p>
                {med.notes && (
                  <p className="text-xs text-muted-foreground font-light mt-1">{med.notes}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleView;
