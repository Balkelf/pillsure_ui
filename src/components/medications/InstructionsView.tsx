
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertCircle, PillIcon } from "lucide-react";

interface InstructionsViewProps {
  currentWeek: number;
  deviceMode: "daily" | "multiday";
  getCompartmentConfig: () => Array<{
    id: number;
    name: string;
    maxCapacity: number;
    currentCapacity: number;
    medications: Array<{
      id: number;
      name: string;
      dosage: string;
      count: number;
      time: string;
    }>;
  }>;
}

const InstructionsView = ({
  currentWeek,
  deviceMode,
  getCompartmentConfig,
}: InstructionsViewProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">How to Fill Your PillSure Device</h3>
            <p className="text-sm text-muted-foreground">
              Your PillSure device has multiple compartments for your medication schedule
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
            <h4 className="text-sm font-medium text-yellow-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Important Compartment Guidelines
            </h4>
            <p className="text-xs text-yellow-700 mt-1">
              Each compartment has a maximum capacity of 5 tablets and should only contain one type of medication. 
              Do not mix different medications in the same compartment.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Week {currentWeek} Configuration:</h4>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <h5 className="text-sm font-medium text-blue-800">Current Compartment Setup</h5>
              <p className="text-xs text-blue-700 mt-1">
                {currentWeek === 1 && deviceMode === "daily" && "One daily dose: Configure the Morning compartment"}
                {currentWeek === 2 && deviceMode === "daily" && "Two daily doses: Configure Morning and Evening compartments"}
                {currentWeek === 3 && deviceMode === "daily" && "Three daily doses: Configure Morning, Lunch, and Evening compartments"}
                {currentWeek === 1 && deviceMode === "multiday" && "One daily dose: 3-day supply in the Morning compartment"}
                {currentWeek === 2 && deviceMode === "multiday" && "Two daily doses: 3-day supply in the Morning and Evening compartments"}
                {currentWeek === 3 && deviceMode === "multiday" && "Three daily doses: 3-day supply in the Morning, Lunch, and Evening compartments"}
              </p>
              <div className="mt-2 space-y-2">
                {getCompartmentConfig().map((compartment, index) => (
                  <div key={index} className="text-xs text-blue-800 flex items-center">
                    <PillIcon className="h-3 w-3 mr-1" />
                    <span className="font-medium">{compartment.name} Compartment:</span>
                    <ul className="ml-2">
                      {compartment.medications.map((med, i) => (
                        <li key={i}>{med.count}x {med.name} {med.dosage}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-3 rounded-md border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <PillIcon className="h-4 w-4 mr-1" />
              Metformin Dosing Instructions
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              Initially 500 mg once daily for at least 1 week, dose to be taken with breakfast, then 500 mg twice daily for at least 1 week, dose to be taken with breakfast and evening meal, then 500 mg 3 times a day, dose to be taken with breakfast, lunch and evening meal.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Each compartment can hold up to 5 tablets of a single medication type. As your dosage increases, you'll need more compartments and more frequent refills.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsView;
