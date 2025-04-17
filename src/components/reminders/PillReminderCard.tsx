
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, Edit, CheckCircle2, AlertCircle } from "lucide-react";
import { Reminder, medications } from "@/lib/data";

interface PillReminderCardProps {
  reminder: Reminder;
  onToggle?: (id: string, active: boolean) => void;
  onEdit?: (id: string) => void;
}

const PillReminderCard = ({ 
  reminder,
  onToggle,
  onEdit
}: PillReminderCardProps) => {
  const medication = medications.find(med => med.id === reminder.medicationId);
  
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle(reminder.id, !reminder.active);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(reminder.id);
    }
  };

  // Mock status - in a real app, this would come from the device data
  const getStatus = () => {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':');
    const reminderTime = new Date();
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (now > reminderTime) {
      return "taken"; // Past time, assume taken
    }
    return "upcoming"; // Future time
  };

  const status = getStatus();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{medication?.name || 'Medication'}</h3>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground">{formatTime(reminder.time)}</p>
                {status === "taken" ? (
                  <div className="ml-2 flex items-center text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span className="text-xs">Taken</span>
                  </div>
                ) : (
                  <div className="ml-2 flex items-center text-amber-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs">Upcoming</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={reminder.active} onCheckedChange={handleToggle} />
            <button className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-muted" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PillReminderCard;
