
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Award, PlusCircle } from "lucide-react";
import { useState } from "react";

interface MotivationalWidgetProps {
  className?: string;
  dailySteps?: number;
  adherenceRate?: number;
}

const MotivationalWidget = ({
  className,
  dailySteps = 6420,
  adherenceRate = 85,
}: MotivationalWidgetProps) => {
  const [showConnectButton, setShowConnectButton] = useState(true);
  
  // Calculate step goal based on adherence
  const stepGoal = 8000;
  const stepProgress = Math.min(100, Math.round((dailySteps / stepGoal) * 100));
  
  // Generate motivational message based on steps and adherence
  const getMotivationalMessage = () => {
    if (adherenceRate >= 80 && stepProgress >= 80) {
      return "Amazing work! Your medication adherence and physical activity are both excellent. Keep up the great work!";
    } else if (adherenceRate >= 80 && stepProgress < 80) {
      return "Great job with your medications! A short walk could help your body absorb them better.";
    } else if (adherenceRate < 80 && stepProgress >= 80) {
      return "Impressive activity today! Remember that regular medication plus exercise is the perfect combination.";
    } else {
      return "Small steps make big differences. Take your medications and a short walk to feel better today.";
    }
  };

  return (
    <Card className={`border-2 border-secondary/10 shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-secondary/10 p-2 rounded-full mr-3">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-medium">Health Activity</h3>
              <p className="text-sm text-muted-foreground">Today's progress</p>
            </div>
          </div>
          {showConnectButton ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-secondary text-sm"
              onClick={() => setShowConnectButton(false)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Connect
            </Button>
          ) : (
            <div className="flex items-center">
              <Award className="text-secondary h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{dailySteps} steps</span>
            </div>
          )}
        </div>
        
        {!showConnectButton && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>Daily steps</span>
              <span className="font-medium">{stepProgress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary"
                style={{ width: `${stepProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <p className="text-sm pt-1">
          {showConnectButton 
            ? "Connect your fitness tracker to get personalized health insights"
            : getMotivationalMessage()
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalWidget;
