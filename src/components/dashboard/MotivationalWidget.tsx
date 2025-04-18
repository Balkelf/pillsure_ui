
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useHealthData } from "@/hooks/useHealthData";
import HealthWidgetHeader from "./HealthWidgetHeader";
import HealthMetricsTabs from "./HealthMetricsTabs";
import { getLatestHbA1c } from "@/lib/data";

interface MotivationalWidgetProps {
  className?: string;
  adherenceRate?: number;
}

const MotivationalWidget = ({
  className,
  adherenceRate = 85,
}: MotivationalWidgetProps) => {
  const [activeTab, setActiveTab] = useState("steps");
  const {
    healthData,
    isConnecting,
    isRefreshing,
    handleConnect,
    handleDisconnect,
    handleRefresh,
  } = useHealthData(adherenceRate);
  
  const latestHbA1c = getLatestHbA1c();

  return (
    <Card className={`border-2 border-secondary/10 shadow-sm ${className}`}>
      <CardHeader className="px-4 py-3">
        <HealthWidgetHeader
          isConnected={healthData.isConnected}
          isConnecting={isConnecting}
          isRefreshing={isRefreshing}
          onConnect={handleConnect}
          onRefresh={handleRefresh}
          hba1cValue={latestHbA1c?.value}
          hba1cDate={latestHbA1c?.timestamp}
        />
      </CardHeader>
      
      <CardContent className="px-4 pb-4 pt-0">
        {healthData.isConnected && (
          <div className="space-y-4">
            <HealthMetricsTabs
              steps={healthData.steps}
              activeMinutes={healthData.activeMinutes}
              caloriesBurned={healthData.caloriesBurned}
              impactScore={healthData.impactScore}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button 
                className="text-xs text-secondary hover:underline"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        <p className="text-sm pt-3">
          {!healthData.isConnected 
            ? "Connect your fitness tracker to get personalized health insights"
            : healthData.motivationalMessage || "Connect your device to get personalized motivation"}
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationalWidget;
