
import { supabase } from "@/integrations/supabase/client";
import { HealthConnectData } from '@/services/healthConnect';

interface InsightParams {
  adherenceRate: number;
  healthData?: {
    steps: number;
    activeMinutes?: number;
    caloriesBurned?: number;
  };
}

export const generateAIMotivationalMessage = async (params: InsightParams): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-motivation', {
      body: params
    });

    if (error) {
      console.error('Error generating AI motivation:', error);
      // Fallback to a default message if the AI service fails
      return "Keep up your healthy habits! Every step counts towards your wellbeing.";
    }

    return data.message;
  } catch (error) {
    console.error('Error calling AI motivation function:', error);
    return "Stay committed to your health journey! You're making progress every day.";
  }
};
