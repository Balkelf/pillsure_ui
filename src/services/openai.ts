
import { HealthConnectData } from '@/services/healthConnect';

interface InsightParams {
  adherenceRate: number;
  healthData?: {
    steps: number;
    activeMinutes?: number;
    caloriesBurned?: number;
  };
}

const generateMotivationalMessage = async (params: InsightParams): Promise<string> => {
  // For now, we'll use a simulated response since we need to set up API key handling
  const { adherenceRate, healthData } = params;
  
  // Default message if no health data is available
  if (!healthData) {
    if (adherenceRate >= 80) {
      return "You're doing a fantastic job with your medications! How does it feel to be so consistent with your health routine?";
    } else {
      return "What small step could you take today to help you remember your medications?";
    }
  }

  // Messages incorporating both medication and activity data
  if (adherenceRate >= 80 && healthData.steps >= 7000) {
    return "Amazing work! Your dedication to both medication and physical activity shows real commitment to your health. What benefits have you noticed from this balanced approach?";
  } else if (adherenceRate >= 80) {
    return "You're doing great with your medications! Have you considered how adding a short walk might complement your medication routine?";
  } else if (healthData.steps >= 7000) {
    return "Your activity level is impressive! How do you think combining this with consistent medication might enhance your overall health journey?";
  } else {
    return "Small steps lead to big changes. What's one thing you could focus on today - either medications or activity - that would make you feel proud?";
  }
};

export { generateMotivationalMessage };
