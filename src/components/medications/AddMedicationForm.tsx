
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CustomMedication, DosageFrequency } from "@/lib/types/medications";
import { toast } from "@/hooks/use-toast";

interface AddMedicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medication: CustomMedication) => void;
}

const AddMedicationForm = ({ open, onOpenChange, onSave }: AddMedicationFormProps) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<DosageFrequency>("once");
  const [times, setTimes] = useState<string[]>(["08:00"]);

  const handleSave = () => {
    if (!name.trim() || !dosage.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newMedication: CustomMedication = {
      id: crypto.randomUUID(),
      name,
      dosage,
      frequency,
      times: getDefaultTimes(frequency),
      startDate: new Date().toISOString(),
    };

    onSave(newMedication);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDosage("");
    setFrequency("once");
    setTimes(["08:00"]);
  };

  const getDefaultTimes = (freq: DosageFrequency): string[] => {
    switch (freq) {
      case "once":
        return ["08:00"];
      case "twice":
        return ["08:00", "20:00"];
      case "three_times":
        return ["08:00", "14:00", "20:00"];
      case "custom":
        return times;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Medication name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dosage" className="text-right">
              Dosage
            </Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 500mg"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value as DosageFrequency)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once daily</SelectItem>
                <SelectItem value="twice">Twice daily</SelectItem>
                <SelectItem value="three_times">Three times daily</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Medication</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationForm;
