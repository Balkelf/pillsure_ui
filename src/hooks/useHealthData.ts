
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

export interface HealthData {
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  heartRate: number;
  impactScore: number;
  isConnected: boolean;
  motivationalMessage: string;
}

export const useHealthData = (adherenceRate: number) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    heartRate: 0,
    impactScore: 0,
    isConnected: false,
    motivationalMessage: "",
  });

  useEffect(() => {
    const data = getHealthData();
    const isConnected = data.isConnected;
    
    if (isConnected) {
      updateHealthMetrics(data);
      updateImpactScore(adherenceRate, data.steps);
      updateMotivationalMessage(data);
    }

    setHealthData(prev => ({ ...prev, isConnected }));
  }, [adherenceRate]);

  const updateHealthMetrics = (data: any) => {
    setHealthData(prev => ({
      ...prev,
      steps: data.steps,
      activeMinutes: data.activeMinutes || 0,
      caloriesBurned: data.caloriesBurned || 0,
      heartRate: data.averageHeartRate || 0,
    }));
  };

  const updateImpactScore = (adherence: number, steps: number) => {
    const score = getAdherenceImpactScore(adherence, steps);
    setHealthData(prev => ({ ...prev, impactScore: score }));
  };

  const updateMotivationalMessage = async (data: any) => {
    try {
      const message = await generateAIMotivationalMessage({
        adherenceRate,
        healthData: {
          steps: data.steps,
          activeMinutes: data.activeMinutes,
          caloriesBurned: data.caloriesBurned
        }
      });
      setHealthData(prev => ({ ...prev, motivationalMessage: message }));
    } catch (error) {
      console.error('Failed to generate motivational message:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToHealthApi();
      const data = getHealthData();
      updateHealthMetrics(data);
      updateImpactScore(adherenceRate, data.steps);
      setHealthData(prev => ({ ...prev, isConnected: true }));
      toast.success("Connected to Health services");
    } catch (error) {
      console.error("Failed to connect to health API:", error);
      toast.error("Failed to connect to Health services");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromHealthApi();
      setHealthData({
        steps: 0,
        activeMinutes: 0,
        caloriesBurned: 0,
        heartRate: 0,
        impactScore: 0,
        isConnected: false,
        motivationalMessage: "",
      });
      toast.success("Disconnected from Health services");
    } catch (error) {
      console.error("Failed to disconnect from health API:", error);
      toast.error("Failed to disconnect");
    }
  };

  const handleRefresh = async () => {
    if (!healthData.isConnected) return;
    
    setIsRefreshing(true);
    try {
      const data = await refreshHealthData();
      updateHealthMetrics(data);
      updateImpactScore(adherenceRate, data.steps);
      await updateMotivationalMessage(data);
      toast.success("Health data updated");
    } catch (error) {
      console.error("Failed to refresh health data:", error);
      toast.error("Failed to update health data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    healthData,
    isConnecting,
    isRefreshing,
    handleConnect,
    handleDisconnect,
    handleRefresh,
  };
};
