
import { useState } from "react";
import { generateAIMotivationalMessage } from "@/services/aiMotivation";
import { getHbA1cTrend, getLatestHbA1c, isHbA1cCheckDue } from "@/lib/data";

interface HealthData {
  isConnected: boolean;
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  impactScore: number;
  motivationalMessage: string;
}

export const useHealthData = (adherenceRate: number = 80) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    isConnected: false,
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    impactScore: 0,
    motivationalMessage: "",
  });

  const calculateImpactScore = (steps: number, activeMinutes: number, adherenceRate: number) => {
    // Weight factors
    const stepsWeight = 0.3;
    const activeMinutesWeight = 0.3;
    const adherenceWeight = 0.4;

    // Normalize to 0-100 scale
    const normalizedSteps = Math.min(steps / 10000 * 100, 100);
    const normalizedActiveMinutes = Math.min(activeMinutes / 60 * 100, 100);

    // Calculate weighted score
    return Math.round(
      (normalizedSteps * stepsWeight) +
      (normalizedActiveMinutes * activeMinutesWeight) +
      (adherenceRate * adherenceWeight)
    );
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomize data within realistic ranges
    const steps = Math.floor(Math.random() * 6000) + 3000; // 3000-9000 steps
    const activeMinutes = Math.floor(Math.random() * 40) + 15; // 15-55 minutes
    const caloriesBurned = Math.floor(steps * 0.04); // Roughly 4 calories per 100 steps
    
    // Calculate impact score based on health data and adherence
    const impactScore = calculateImpactScore(steps, activeMinutes, adherenceRate);
    
    try {
      // Get HbA1c data to enhance the motivational message
      const hba1cData = getLatestHbA1c();
      const hba1cTrend = getHbA1cTrend();
      const hba1cDue = isHbA1cCheckDue();
      
      // Get AI motivational message
      const aiMessage = await generateAIMotivationalMessage(adherenceRate, {
        steps,
        activeMinutes,
        caloriesBurned,
        hba1c: hba1cData?.value,
        hba1cTrend,
        hba1cDue
      });
      
      setHealthData({
        isConnected: true,
        steps,
        activeMinutes,
        caloriesBurned,
        impactScore,
        motivationalMessage: aiMessage,
      });
    } catch (error) {
      console.error("Error generating motivational message:", error);
      
      setHealthData({
        isConnected: true,
        steps,
        activeMinutes,
        caloriesBurned,
        impactScore,
        motivationalMessage: "Great job on taking your medications consistently! Keep up the great work with your physical activity.",
      });
    }
    
    setIsConnecting(false);
  };

  const handleRefresh = async () => {
    if (!healthData.isConnected) return;
    
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with slightly different data
    const currentSteps = healthData.steps;
    const currentActiveMinutes = healthData.activeMinutes;
    
    const steps = currentSteps + Math.floor(Math.random() * 500); // Add up to 500 more steps
    const activeMinutes = currentActiveMinutes + Math.floor(Math.random() * 5); // Add up to 5 more minutes
    const caloriesBurned = Math.floor(steps * 0.04);
    
    // Recalculate impact score
    const impactScore = calculateImpactScore(steps, activeMinutes, adherenceRate);
    
    try {
      // Get HbA1c data
      const hba1cData = getLatestHbA1c();
      const hba1cTrend = getHbA1cTrend();
      const hba1cDue = isHbA1cCheckDue();
      
      // Get fresh AI motivational message
      const aiMessage = await generateAIMotivationalMessage(adherenceRate, {
        steps,
        activeMinutes,
        caloriesBurned,
        hba1c: hba1cData?.value,
        hba1cTrend,
        hba1cDue
      });
      
      setHealthData({
        ...healthData,
        steps,
        activeMinutes,
        caloriesBurned,
        impactScore,
        motivationalMessage: aiMessage,
      });
    } catch (error) {
      console.error("Error refreshing motivational message:", error);
      
      setHealthData({
        ...healthData,
        steps,
        activeMinutes,
        caloriesBurned,
        impactScore,
      });
    }
    
    setIsRefreshing(false);
  };

  const handleDisconnect = () => {
    setHealthData({
      isConnected: false,
      steps: 0,
      activeMinutes: 0,
      caloriesBurned: 0,
      impactScore: 0,
      motivationalMessage: "",
    });
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
