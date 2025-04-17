
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, MapPin, Edit } from "lucide-react";
import { SmartReminder } from "@/lib/types/reminders";
import { Button } from "@/components/ui/button";
import { scheduleReminder, cancelReminder } from "@/services/notifications";
import { useToast } from "@/hooks/use-toast";

interface SmartReminderCardProps {
  reminder: SmartReminder;
  onToggle?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
}

const SmartReminderCard = ({ 
  reminder,
  onToggle,
  onEdit
}: SmartReminderCardProps) => {
  const { toast } = useToast();
  
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      if (active) {
        await scheduleReminder(reminder);
      } else {
        await cancelReminder(id);
      }
      onToggle?.(id, active);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please check your notification permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              {reminder.smartType === 'location' ? (
                <MapPin className="h-5 w-5 text-primary" />
              ) : reminder.smartType === 'both' ? (
                <div className="relative">
                  <Clock className="h-5 w-5 text-primary" />
                  <MapPin className="h-3 w-3 text-primary absolute -bottom-1 -right-1" />
                </div>
              ) : (
                <Clock className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {reminder.smartType === 'location' ? reminder.location?.name : formatTime(reminder.time)}
              </h3>
              <div className="flex items-center gap-2">
                {reminder.smartType === 'both' && (
                  <>
                    <p className="text-sm text-muted-foreground">{formatTime(reminder.time)}</p>
                    <span className="text-sm text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">{reminder.location?.name}</p>
                  </>
                )}
                {reminder.smartType === 'location' && (
                  <p className="text-sm text-muted-foreground">Location-based reminder</p>
                )}
                {reminder.smartType === 'time' && (
                  <p className="text-sm text-muted-foreground">Time-based reminder</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={reminder.active} 
              onCheckedChange={(checked) => handleToggle(reminder.id, checked)} 
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(reminder.id)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartReminderCard;
