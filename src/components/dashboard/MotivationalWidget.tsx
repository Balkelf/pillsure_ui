
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Award, PlusCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  connectToHealthApi, 
  disconnectFromHealthApi, 
  getHealthData,
  refreshHealthData
} from "@/services/healthConnect";
import { toast } from "sonner";

interface MotivationalWidgetProps {
  className?: string;
  adherenceRate?: number;
}

const MotivationalWidget = ({
  className,
  adherenceRate = 85,
}: MotivationalWidgetProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [dailySteps, setDailySteps] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Step goal based on adherence - could be more dynamic in a full implementation
  const stepGoal = 8000;
  const stepProgress = Math.min(100, Math.round((dailySteps / stepGoal) * 100));
  
  // Check for existing health connection on component mount
  useEffect(() => {
    const healthData = getHealthData();
    setIsConnected(healthData.isConnected);
    
    if (healthData.isConnected) {
      setDailySteps(healthData.steps);
    }
  }, []);
  
  // Handle health API connection
  const handleConnectHealth = async () => {
    setIsConnecting(true);
    try {
      await connectToHealthApi();
      const healthData = getHealthData();
      setDailySteps(healthData.steps);
      setIsConnected(true);
      toast.success("Connected to Health services");
    } catch (error) {
      console.error("Failed to connect to health API:", error);
      toast.error("Failed to connect to Health services");
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle health API disconnection
  const handleDisconnectHealth = async () => {
    try {
      await disconnectFromHealthApi();
      setIsConnected(false);
      setDailySteps(0);
      toast.success("Disconnected from Health services");
    } catch (error) {
      console.error("Failed to disconnect from health API:", error);
      toast.error("Failed to disconnect");
    }
  };
  
  // Handle refreshing health data
  const handleRefreshHealth = async () => {
    if (!isConnected) return;
    
    setIsRefreshing(true);
    try {
      const healthData = await refreshHealthData();
      setDailySteps(healthData.steps);
      toast.success("Health data updated");
    } catch (error) {
      console.error("Failed to refresh health data:", error);
      toast.error("Failed to update health data");
    } finally {
      setIsRefreshing(false);
    }
  };
  
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
          {!isConnected ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-secondary text-sm"
              onClick={handleConnectHealth}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCcw className="mr-1 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleRefreshHealth}
                disabled={isRefreshing}
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="flex items-center">
                <Award className="text-secondary h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{dailySteps} steps</span>
              </div>
            </div>
          )}
        </div>
        
        {isConnected && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>Daily steps</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{stepProgress}%</span>
                <button 
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                  onClick={handleDisconnectHealth}
                >
                  Disconnect
                </button>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${stepProgress < 30 ? 'bg-orange-400' : 'bg-secondary'}`}
                style={{ width: `${stepProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <p className="text-sm pt-1">
          {!isConnected 
            ? "Connect your fitness tracker to get personalized health insights"
            : getMotivationalMessage()
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalWidget;
