
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getNextMedication } from "@/lib/data";
import { useState } from "react";

interface NextMedicationCardProps {
  className?: string;
  onView?: () => void;
}

const NextMedicationCard = ({ 
  className,
  onView 
}: NextMedicationCardProps) => {
  const nextMed = getNextMedication();
  const [viewed, setViewed] = useState(false);
  
  if (!nextMed) {
    return (
      <Card className={`bg-muted/30 border-0 ${className}`}>
        <CardContent className="p-4">
          <div className="flex justify-center items-center py-4">
            <p className="text-muted-foreground">No upcoming medications today</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleView = () => {
    setViewed(true);
    if (onView) onView();
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className={`bg-primary/5 border-0 ${className}`}>
      <CardContent className="p-4">
        {!viewed ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{nextMed.name}</h3>
                <p className="text-sm text-muted-foreground">{nextMed.dosage}</p>
              </div>
              <div className="flex items-center text-primary font-medium">
                <Clock className="mr-1 h-4 w-4" />
                {formatTime(nextMed.times[0])}
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full flex items-center justify-between p-3 bg-background rounded-md border">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Previous: Taken at 8:00 AM</span>
                </div>
                <div className="flex items-center text-primary" onClick={handleView}>
                  <span className="text-sm mr-1">Details</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-4">
            <p className="text-muted-foreground">Medication details viewed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextMedicationCard;
