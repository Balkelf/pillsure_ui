
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { getNextMedication } from "@/lib/data";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface NextMedicationCardProps {
  className?: string;
  onTake?: () => void;
  onSkip?: () => void;
}

const NextMedicationCard = ({ 
  className,
  onTake,
  onSkip 
}: NextMedicationCardProps) => {
  const nextMed = getNextMedication();
  const [taken, setTaken] = useState(false);
  
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

  const handleTake = () => {
    setTaken(true);
    toast({
      title: "Medication taken",
      description: `You've taken ${nextMed.name} (${nextMed.dosage})`,
    });
    if (onTake) onTake();
  };

  const handleSkip = () => {
    setTaken(true);
    toast({
      title: "Medication skipped",
      description: `You've skipped ${nextMed.name} (${nextMed.dosage})`,
      variant: "destructive",
    });
    if (onSkip) onSkip();
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
        {!taken ? (
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
            <div className="mt-3 flex gap-2">
              <Button className="w-full" onClick={handleTake}>Take now</Button>
              <Button variant="outline" className="w-full" onClick={handleSkip}>Skip</Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-4">
            <p className="text-muted-foreground">Next medication updated</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextMedicationCard;
