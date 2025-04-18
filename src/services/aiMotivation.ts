
import { supabase } from "@/integrations/supabase/client";

interface HealthData {
  steps: number;
  activeMinutes: number;
  caloriesBurned: number;
  hba1c?: number;
  hba1cTrend?: 'improving' | 'worsening' | 'stable' | 'unknown';
  hba1cDue?: boolean;
}

export const generateAIMotivationalMessage = async (
  adherenceRate: number,
  healthData: HealthData
): Promise<string> => {
  try {
    // Call Supabase Edge Function to generate AI message
    const { data, error } = await supabase.functions.invoke("generate-ai-motivation", {
      body: {
        adherenceRate,
        healthData
      }
    });

    if (error) {
      console.error("Error calling AI motivation function:", error);
      return getDefaultMotivationalMessage(adherenceRate, healthData);
    }

    return data.message;
  } catch (error) {
    console.error("Error in generateAIMotivationalMessage:", error);
    return getDefaultMotivationalMessage(adherenceRate, healthData);
  }
};

const getDefaultMotivationalMessage = (adherenceRate: number, healthData: HealthData): string => {
  // Fallback messages if the AI service fails
  const adherenceMessages = [
    "Taking your medications consistently is improving your health! Keep up the great work.",
    "You're doing an excellent job staying on top of your medications. This consistency pays off!",
    "Your commitment to taking medications regularly is making a real difference in your health."
  ];

  const activityMessages = [
    "Every step counts! You're making progress with your physical activity.",
    "Your active minutes are adding up! Keep moving for better health.",
    "Physical activity combined with medication adherence is a powerful combination for your health."
  ];
  
  const hba1cMessages = healthData.hba1c ? [
    healthData.hba1cTrend === 'improving' ? "Your HbA1c is improving - a great sign your efforts are working!" : "",
    healthData.hba1cTrend === 'stable' && healthData.hba1c < 48 ? "Your HbA1c is stable in the target range - excellent work!" : "",
    healthData.hba1cDue ? "It's time to schedule your next HbA1c check to monitor your progress." : ""
  ].filter(Boolean) : [];

  const randomAdherenceMessage = adherenceMessages[Math.floor(Math.random() * adherenceMessages.length)];
  const randomActivityMessage = activityMessages[Math.floor(Math.random() * activityMessages.length)];
  const randomHba1cMessage = hba1cMessages.length > 0 ? 
    hba1cMessages[Math.floor(Math.random() * hba1cMessages.length)] : "";

  return [randomAdherenceMessage, randomActivityMessage, randomHba1cMessage]
    .filter(Boolean)
    .join(" ");
};
