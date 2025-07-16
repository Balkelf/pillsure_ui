import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { CustomMedication } from "@/lib/types/medications";
import { toast } from "@/hooks/use-toast";
import AddMedicationForm from "@/components/medications/AddMedicationForm";

const Medications = () => {
  const startDate = "2023-04-10";
  const [deviceMode, setDeviceMode] = useState<"daily" | "multiday">("daily");
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [customMedications, setCustomMedications] = useState<CustomMedication[]>([]);
  const [openMedication, setOpenMedication] = useState<string | null>("metformin");

  const calculateCurrentWeek = () => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 1;
    if (diffDays <= 14) return 2;
    return 3;
  };

  const toggleMedication = (med: string) => {
    setOpenMedication(openMedication === med ? null : med);
  };

  const handleAddMedication = (medication: CustomMedication) => {
    setCustomMedications([...customMedications, medication]);
    toast({
      title: "Medication added",
      description: `${medication.name} has been added to your schedule`,
    });
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Medications</h1>
            <p className="text-base font-normal tracking-normal text-muted-foreground">Manage your prescription schedule</p>
          </div>
          <Button 
            variant="default"
            onClick={() => setShowAddMedication(true)}
            className="whitespace-nowrap"
          >
            Add medication
          </Button>
        </div>

        <div className="space-y-6">
          {/* Current Medication Schedule Section */}
          <div>
            <h2 className="text-xl font-medium tracking-tight">Current Medication Schedule</h2>
            <p className="text-sm font-normal tracking-normal text-muted-foreground">
              View and manage your medication schedule in the 
              <Button variant="link" className="p-0 h-auto text-sm font-normal tracking-normal ml-1" onClick={() => window.location.href="/device-settings"}>
                device settings
              </Button>
            </p>
          </div>
        </div>

        {/* Medication List */}
        <div className="space-y-4 mt-6">
          {/* Metformin */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="flex flex-col p-4 cursor-pointer"
              onClick={() => toggleMedication("metformin")}
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-medium tracking-tight">Metformin 500mg</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform duration-300 ease-in-out ${openMedication === "metformin" ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              {openMedication !== "metformin" && (
                <div className="flex gap-4 mt-4">
                  <div className="bg-blue-100 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                    On tritration
                  </div>
                  <div className="bg-gray-100 text-muted-foreground px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                    On week 3 of 3
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openMedication === "metformin" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-4 pb-4">
                <div className="flex gap-4 mb-4">
                  <div className="bg-blue-100 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                    On tritration
                  </div>
                  <div className="bg-gray-100 text-muted-foreground px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                    On week 3 of 3
                  </div>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Info className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium tracking-tight text-accent-foreground">Metformin Titration</h3>
                        <p className="text-sm font-normal tracking-normal text-accent-foreground mt-1 leading-normal">
                          Your Metformin schedule gradually increases over 3 weeks to help your body adjust to the medication.
                          Configure your PillSure device compartments to manage your dosage schedule.
                        </p>
                        <div className="text-xs font-normal tracking-wide text-accent-foreground mt-2">
                          Started on Apr 10, 2023 - Currently in Week 3
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xl font-medium tracking-tight mt-6 mb-4">Metformin Titration Schedule</h3>

                <div className="space-y-4">
                  {/* Week 1 */}
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="bg-blue-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium tracking-tight">Week 1: Metformin 500mg</h4>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground mt-1">Once daily</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">Apr 10 - Apr 16, 2023</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">Take with breakfast for the first week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Week 2 */}
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="bg-blue-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium tracking-tight">Week 2: Metformin 500mg</h4>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground mt-1">Twice daily</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">Apr 17 - Apr 23, 2023</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">Take with breakfast and evening meal for the second week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Week 3 */}
                  <Card className="border border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="bg-blue-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-medium tracking-tight">Week 3: Metformin 500mg</h4>
                            <span className="bg-blue-100 text-accent-foreground px-3 py-0.5 rounded-full text-xs font-normal tracking-wide">Current</span>
                          </div>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground mt-1">Three times daily</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">From Apr 24, 2023 onwards</p>
                          <p className="text-sm font-normal tracking-normal text-muted-foreground">Take with breakfast, lunch and evening meal starting from the third week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Lisinopril */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleMedication("lisinopril")}
            >
              <h3 className="text-lg font-medium tracking-tight">Lisinopril 10mg</h3>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform duration-300 ease-in-out ${openMedication === "lisinopril" ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openMedication === "lisinopril" ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-4 pb-4">
                <p className="text-sm font-normal tracking-normal text-muted-foreground mb-4">For blood pressure management</p>
                {/* Additional content can be added here */}
              </div>
            </div>
            {openMedication !== "lisinopril" && (
              <div className="px-4 pb-1">
                <p className="text-sm font-normal tracking-normal text-muted-foreground">For blood pressure management</p>
              </div>
            )}
          </div>

          {/* Atorvastatin */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleMedication("atorvastatin")}
            >
              <h3 className="text-lg font-medium tracking-tight">Atorvastatin 20mg</h3>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform duration-300 ease-in-out ${openMedication === "atorvastatin" ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openMedication === "atorvastatin" ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-4 pb-4">
                <p className="text-sm font-normal tracking-normal text-muted-foreground mb-4">For cholesterol management, take in the evening</p>
                {/* Additional content can be added here */}
              </div>
            </div>
            {openMedication !== "atorvastatin" && (
              <div className="px-4 pb-1">
                <p className="text-sm font-normal tracking-normal text-muted-foreground">For cholesterol management, take in the evening</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddMedication && (
        <AddMedicationForm
          open={showAddMedication}
          onOpenChange={setShowAddMedication}
          onSave={handleAddMedication}
        />
      )}
    </MobileLayout>
  );
};

export default Medications;
