
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0'
import { OpenAI } from 'https://esm.sh/openai@4.26.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Processing request...')

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const requestData = await req.json()
    const { adherenceRate, healthData } = requestData

    if (!adherenceRate || !healthData) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('Received data:', { adherenceRate, healthData })

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') || ''
    })

    // Construct the system prompt based on the available health data
    let hba1cContext = ''
    if (healthData.hba1c) {
      hba1cContext = `The user's HbA1c level is ${healthData.hba1c} mmol/mol. `
      
      if (healthData.hba1cTrend === 'improving') {
        hba1cContext += 'Their HbA1c has been improving over time. '
      } else if (healthData.hba1cTrend === 'worsening') {
        hba1cContext += 'Their HbA1c has been increasing over time, which is a concern. '
      } else if (healthData.hba1cTrend === 'stable') {
        hba1cContext += 'Their HbA1c has been stable. '
      }
      
      if (healthData.hba1cDue) {
        hba1cContext += 'They are due for an HbA1c check. '
      }
      
      hba1cContext += 'For context, an HbA1c below 48 mmol/mol is considered good control for diabetes. '
    }

    const prompt = `
      You are a supportive health coach. Create a brief, positive, motivational message for someone tracking their medication adherence and physical activity. 
      
      Details:
      - The person has a ${adherenceRate}% medication adherence rate (percentage of medications taken as prescribed)
      - They've taken ${healthData.steps} steps today
      - They've been active for ${healthData.activeMinutes} minutes
      - They've burned approximately ${healthData.caloriesBurned} calories through activity
      ${hba1cContext}
      
      Provide a brief, supportive message focusing on:
      1. Acknowledging their medication adherence
      2. Encouraging continued physical activity
      3. If HbA1c data is provided, briefly mention it in context with their efforts
      
      Keep the message conversational, positive, encouraging and under 150 words. Don't be too clinical or technical.
    `

    // Generate the motivational message
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const message = response.choices[0].message.content

    console.log('Generated message:', message)

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
