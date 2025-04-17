
import { Clock, Flame, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthMetricsTabsProps {
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  impactScore: number;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const HealthMetricsTabs = ({
  steps,
  activeMinutes,
  caloriesBurned,
  impactScore,
  activeTab,
  onTabChange,
}: HealthMetricsTabsProps) => {
  const stepGoal = 8000;
  const stepProgress = Math.min(100, Math.round((steps / stepGoal) * 100));

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
          <span className="text-muted-foreground">{steps} steps</span>
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
  );
};

export default HealthMetricsTabs;
