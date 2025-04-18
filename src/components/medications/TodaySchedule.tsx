
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Clock } from "lucide-react";
import { CustomMedication } from "@/lib/types/medications";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ScheduleItem {
  id: number | string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  status: string;
  notes?: string;
  week?: number;
}

interface TodayScheduleProps {
  schedule: ScheduleItem[];
  customMedications: CustomMedication[];
}

const TodaySchedule = ({ schedule, customMedications }: TodayScheduleProps) => {
  const [scheduledMeds, setScheduledMeds] = useState<ScheduleItem[]>(schedule);
  const [loading, setLoading] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Check className="h-5 w-5 text-secondary" />;
      case "missed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "upcoming":
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  // Fetch medication schedule from Supabase if connected
  useEffect(() => {
    const fetchMedicationSchedule = async () => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          // Not authenticated, use demo data
          return;
        }
        
        const { data, error } = await supabase
          .from("medication_schedules")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("name");
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map the data to our ScheduleItem format
          const mappedData = data.map(item => ({
            id: item.id,
            name: item.name,
            dosage: item.dosage || "",
            frequency: item.frequency,
            times: item.times || [],
            status: item.status || "upcoming",
            notes: item.notes,
            week: item.week
          }));
          
          setScheduledMeds(mappedData);
        }
      } catch (error) {
        console.error("Error fetching medication schedule:", error);
        // Fallback to demo data
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicationSchedule();
  }, []);

  const combinedSchedule: ScheduleItem[] = [
    ...scheduledMeds,
    ...customMedications.map(med => ({
      id: Number(med.id),
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency === 'once' ? 'Once daily' :
                med.frequency === 'twice' ? 'Twice daily' :
                med.frequency === 'three_times' ? 'Three times daily' :
                'Custom',
      times: med.times,
      status: "upcoming",
      notes: med.instructions
    }))
  ];
  
  const handleTakeMedication = async (medId: number | string) => {
    try {
      // Find the medication in our combined schedule
      const med = combinedSchedule.find(m => m.id === medId);
      if (!med) return;
      
      // Update local state first for immediate feedback
      setScheduledMeds(prev => 
        prev.map(m => m.id === medId ? { ...m, status: "taken" } : m)
      );
      
      // Check if connected to Supabase
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        // Record the medication as taken
        await supabase
          .from("medication_logs")
          .insert({
            user_id: userData.user.id,
            medication_id: medId,
            schedule_id: typeof medId === 'string' ? medId : undefined,
            status: "taken",
            scheduled_time: new Date().toISOString(),
            taken_time: new Date().toISOString()
          });
          
        // Update the medication schedule status
        await supabase
          .from("medication_schedules")
          .update({ status: "taken" })
          .eq("id", medId);
      }
      
      toast.success(`${med.name} marked as taken`);
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast.error("Failed to update medication status");
    }
  };
  
  const handleSkipMedication = async (medId: number | string) => {
    try {
      // Find the medication in our combined schedule
      const med = combinedSchedule.find(m => m.id === medId);
      if (!med) return;
      
      // Update local state first for immediate feedback
      setScheduledMeds(prev => 
        prev.map(m => m.id === medId ? { ...m, status: "missed" } : m)
      );
      
      // Check if connected to Supabase
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        // Record the medication as skipped
        await supabase
          .from("medication_logs")
          .insert({
            user_id: userData.user.id,
            medication_id: medId,
            schedule_id: typeof medId === 'string' ? medId : undefined,
            status: "missed",
            scheduled_time: new Date().toISOString()
          });
          
        // Update the medication schedule status
        await supabase
          .from("medication_schedules")
          .update({ status: "missed" })
          .eq("id", medId);
      }
      
      toast.success(`${med.name} marked as skipped`);
    } catch (error) {
      console.error("Error marking medication as skipped:", error);
      toast.error("Failed to update medication status");
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading medication schedule...</div>;
  }

  return (
    <div className="space-y-4">
      {combinedSchedule.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No medications scheduled for today</p>
        </div>
      ) : (
        combinedSchedule.map((med) => (
          <Card key={med.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  {getStatusIcon(med.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{med.name} {med.dosage}</h3>
                  <p className="text-sm text-muted-foreground">
                    {med.frequency}
                    {med.week !== undefined && ` • Week ${med.week}`}
                  </p>
                  {med.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {med.times.join(", ")}
                </div>
              </div>
              {med.status === "upcoming" && (
                <div className="border-t px-4 py-3 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleTakeMedication(med.id)}>
                    Take now
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSkipMedication(med.id)}>
                    Skip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TodaySchedule;
