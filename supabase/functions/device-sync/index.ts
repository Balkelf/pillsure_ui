
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the request body
    const body = await req.json();

    // Extract device data
    const { 
      device_id, 
      user_id, 
      battery_level, 
      device_mode, 
      compartments, 
      medication_logs 
    } = body;

    // Validate required fields
    if (!device_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update or insert device record
    const { data: deviceData, error: deviceError } = await supabaseClient
      .from("devices")
      .upsert({
        device_id,
        user_id,
        battery_level,
        device_mode,
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: "device_id" })
      .select("id")
      .single();
    
    if (deviceError) throw deviceError;
    
    // Process compartments if provided
    if (compartments && Array.isArray(compartments)) {
      for (const compartment of compartments) {
        // First, update or create compartment
        const { data: compartmentData, error: compartmentError } = await supabaseClient
          .from("device_compartments")
          .upsert({
            device_id: deviceData.id,
            name: compartment.name,
            max_capacity: compartment.max_capacity,
            current_capacity: compartment.current_capacity,
            updated_at: new Date().toISOString()
          }, { onConflict: "device_id, name" })
          .select("id")
          .single();
          
        if (compartmentError) throw compartmentError;
          
        // If medications in compartment are provided, update them
        if (compartment.medications && Array.isArray(compartment.medications)) {
          // First delete old records for this compartment
          await supabaseClient
            .from("compartment_medications")
            .delete()
            .eq("compartment_id", compartmentData.id);
            
          // Then insert new medications
          for (const medication of compartment.medications) {
            await supabaseClient
              .from("compartment_medications")
              .insert({
                compartment_id: compartmentData.id,
                name: medication.name,
                dosage: medication.dosage,
                count: medication.count,
                time: medication.time,
                medication_id: medication.medication_id
              });
          }
        }
      }
    }
    
    // Process medication logs if provided
    if (medication_logs && Array.isArray(medication_logs)) {
      for (const log of medication_logs) {
        await supabaseClient
          .from("medication_logs")
          .insert({
            user_id,
            medication_id: log.medication_id,
            schedule_id: log.schedule_id,
            status: log.status,
            scheduled_time: log.scheduled_time,
            taken_time: log.taken_time || new Date().toISOString()
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Device data synced successfully",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing device data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
