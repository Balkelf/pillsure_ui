import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Award, Heart, Flame, Clock, PlusCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  connectToHealthApi, 
  disconnectFromHealthApi, 
  getHealthData,
  refreshHealthData,
  getAdherenceImpactScore
} from "@/services/healthConnect";
import { generateAIMotivationalMessage } from "@/services/aiMotivation";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [impactScore, setImpactScore] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("steps");
  const [motivationalMessage, setMotivationalMessage] = useState<string>("");

  const stepGoal = 8000;
  const stepProgress = Math.min(100, Math.round((dailySteps / stepGoal) * 100));

  useEffect(() => {
    const healthData = getHealthData();
    setIsConnected(healthData.isConnected);
    
    if (healthData.isConnected) {
      setDailySteps(healthData.steps);
      setActiveMinutes(healthData.activeMinutes || 0);
      setCaloriesBurned(healthData.caloriesBurned || 0);
      setHeartRate(healthData.averageHeartRate || 0);
      updateImpactScore(adherenceRate, healthData.steps);
      updateMotivationalMessage(healthData);
    }
  }, [adherenceRate]);

  const updateImpactScore = (adherence: number, steps: number) => {
    const score = getAdherenceImpactScore(adherence, steps);
    setImpactScore(score);
  };

  const updateMotivationalMessage = async (healthData: any) => {
    try {
      const message = await generateAIMotivationalMessage({
        adherenceRate,
        healthData: {
          steps: healthData.steps,
          activeMinutes: healthData.activeMinutes,
          caloriesBurned: healthData.caloriesBurned
        }
      });
      setMotivationalMessage(message);
    } catch (error) {
      console.error('Failed to generate motivational message:', error);
      // Fallback message is handled by the service
    }
  };

  const handleConnectHealth = async () => {
    setIsConnecting(true);
    try {
      await connectToHealthApi();
      const healthData = getHealthData();
      setDailySteps(healthData.steps);
      setActiveMinutes(healthData.activeMinutes || 0);
      setCaloriesBurned(healthData.caloriesBurned || 0);
      setHeartRate(healthData.averageHeartRate || 0);
      setIsConnected(true);
      updateImpactScore(adherenceRate, healthData.steps);
      toast.success("Connected to Health services");
    } catch (error) {
      console.error("Failed to connect to health API:", error);
      toast.error("Failed to connect to Health services");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectHealth = async () => {
    try {
      await disconnectFromHealthApi();
      setIsConnected(false);
      setDailySteps(0);
      setActiveMinutes(0);
      setCaloriesBurned(0);
      setHeartRate(0);
      setImpactScore(0);
      toast.success("Disconnected from Health services");
    } catch (error) {
      console.error("Failed to disconnect from health API:", error);
      toast.error("Failed to disconnect");
    }
  };

  const handleRefreshHealth = async () => {
    if (!isConnected) return;
    
    setIsRefreshing(true);
    try {
      const healthData = await refreshHealthData();
      setDailySteps(healthData.steps);
      setActiveMinutes(healthData.activeMinutes || 0);
      setCaloriesBurned(healthData.caloriesBurned || 0);
      setHeartRate(healthData.averageHeartRate || 0);
      updateImpactScore(adherenceRate, healthData.steps);
      await updateMotivationalMessage(healthData);
      toast.success("Health data updated");
    } catch (error) {
      console.error("Failed to refresh health data:", error);
      toast.error("Failed to update health data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className={`border-2 border-secondary/10 shadow-sm ${className}`}>
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
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
              <Activity className="text-secondary h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-4 pb-4 pt-0">
        {isConnected && (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 h-8">
                <TabsTrigger value="steps" className="text-xs">Steps</TabsTrigger>
                <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                <TabsTrigger value="calories" className="text-xs">Calories</TabsTrigger>
                <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="steps" className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily steps</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{stepProgress}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stepProgress < 30 ? 'bg-orange-400' : 'bg-secondary'}`}
                    style={{ width: `${stepProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">{dailySteps} steps</span>
                  <span className="text-muted-foreground">Goal: {stepGoal}</span>
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Active Minutes</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">{activeMinutes}</span>
                  </div>
                  <div className="flex-1">
                    <Progress value={Math.min(100, activeMinutes * 2)} className="h-2" indicatorClassName="bg-blue-500" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeMinutes >= 30 ? "Excellent!" : "Try for 30+ minutes daily"}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="calories" className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Calories Burned</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-orange-600">{caloriesBurned}</span>
                  </div>
                  <div className="flex-1">
                    <Progress value={Math.min(100, caloriesBurned / 5)} className="h-2" indicatorClassName="bg-orange-500" />
                    <p className="text-xs text-muted-foreground mt-1">Based on your activity today</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="impact" className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Health Impact Score</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-red-600">{impactScore}</span>
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={impactScore} 
                      className="h-2" 
                      indicatorClassName={`${impactScore >= 80 ? 'bg-green-500' : impactScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {impactScore >= 80 
                        ? "Excellent! Activity + Medication = Success" 
                        : "Activity can improve medication effectiveness"}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
              <button 
                className="text-xs text-secondary hover:underline"
                onClick={handleDisconnectHealth}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        <p className="text-sm pt-3">
          {!isConnected 
            ? "Connect your fitness tracker to get personalized health insights"
            : motivationalMessage || "Connect your device to get personalized motivation"}
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalWidget;
