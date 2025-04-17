
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adherenceRate, healthData } = await req.json();

    // Create a context-aware prompt based on the user's health data
    let prompt = `As a supportive health coach, create a motivational message for someone with:
- Medication adherence rate: ${adherenceRate}%
${healthData ? `
- Daily steps: ${healthData.steps}
- Active minutes: ${healthData.activeMinutes || 'not available'}
- Calories burned: ${healthData.caloriesBurned || 'not available'}` : ''}

The message should be encouraging, personalized to their current stats, and suggest ways to maintain or improve their health routine. Keep it concise and conversational.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a supportive health coach who provides encouraging, personalized feedback.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-motivation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
