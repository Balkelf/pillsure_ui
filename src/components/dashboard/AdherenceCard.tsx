
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { getAdherenceRate } from "@/lib/data";

interface AdherenceCardProps {
  className?: string;
}

const AdherenceCard = ({ className }: AdherenceCardProps) => {
  const adherenceRate = getAdherenceRate();
  
  return (
    <Card className={`border-2 border-primary/10 shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-primary" />
          Today's Adherence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Medication taken</span>
            <span className="font-medium">{adherenceRate}%</span>
          </div>
          <Progress value={adherenceRate} className="h-2" />
          <p className="text-xs text-muted-foreground pt-1">
            {adherenceRate >= 80 
              ? "Great job! You're doing better than last week" 
              : "Keep going! Try to take all your medications today"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdherenceCard;
