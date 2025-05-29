import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, SunMedium, Moon, GripVertical } from "lucide-react";

interface CompartmentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const DeviceSettings = () => {
  const [deviceName, setDeviceName] = useState("Maria's Pillsure");
  const [compartments, setCompartments] = useState<CompartmentItem[]>([
    {
      id: "morning",
      name: "Morning",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7.5V10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.92993 10.9297L6.33993 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 18H4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 18H22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.0699 10.9297L17.6599 12.3397" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 22H2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 18C16 16.9391 15.5786 15.9217 14.8284 15.1716C14.0783 14.4214 13.0609 14 12 14C10.9391 14 9.92172 14.4214 9.17157 15.1716C8.42143 15.9217 8 16.9391 8 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: <SunMedium className="h-10 w-10 text-black" />
    },
    {
      id: "evening",
      name: "Evening",
      icon: <Moon className="h-10 w-10 text-black" />
    }
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Add some visual feedback
    (e.currentTarget as HTMLElement).style.transform = "rotate(5deg)";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(index);
  };

  const handleDragLeave = () => {
    setIsDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newCompartments = [...compartments];
    const draggedItem = newCompartments[draggedIndex];
    
    // Remove dragged item
    newCompartments.splice(draggedIndex, 1);
    
    // Insert at new position
    newCompartments.splice(dropIndex, 0, draggedItem);
    
    setCompartments(newCompartments);
    setDraggedIndex(null);
    setIsDragOver(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    setIsDragOver(null);
    // Reset transform
    (e.currentTarget as HTMLElement).style.transform = "";
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pillsure Device</h1>
          <p className="text-muted-foreground font-light">Configure your medication dispenser</p>
        </div>

        {/* Device Name */}
        <div>
          <h3 className="text-lg font-semibold">Device name</h3>
          <p className="text-muted-foreground font-light mb-3">Current device: {deviceName}</p>
          <Button className="w-full" variant="outline">Change device name</Button>
        </div>

        {/* Current Compartment Setup */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Current compartment setup</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <GripVertical className="h-3 w-3 mr-1" />
              <span>Drag to reorder</span>
            </div>
          </div>
          
          {/* Medication Schedule Card */}
          <Card className="mt-3 border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center gap-4">
                {compartments.map((compartment, index) => (
                  <div
                    key={compartment.id}
                    className={`
                      relative flex flex-col items-center 
                      min-h-[120px] min-w-[80px] p-4 rounded-xl
                      border-2 border-dashed border-transparent
                      transition-all duration-300 ease-out
                      touch-manipulation select-none
                      ${draggedIndex === index 
                        ? 'opacity-60 scale-110 rotate-3 shadow-2xl z-10 border-blue-400 bg-blue-50' 
                        : 'hover:scale-105 hover:shadow-lg hover:bg-gray-50 active:scale-95'
                      }
                      ${isDragOver === index && draggedIndex !== index
                        ? 'border-green-400 bg-green-50 scale-105' 
                        : ''
                      }
                    `}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-70 transition-opacity">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-2 rounded-full bg-white shadow-sm">
                        {compartment.icon}
                      </div>
                      <span className="text-sm font-medium text-center">{compartment.name}</span>
                    </div>
                    
                    {/* Visual feedback for drag state */}
                    {draggedIndex === index && (
                      <div className="absolute inset-0 border-2 border-blue-400 rounded-xl animate-pulse" />
                    )}
                    
                    {/* Drop zone indicator */}
                    {isDragOver === index && draggedIndex !== index && (
                      <div className="absolute inset-0 border-2 border-green-400 rounded-xl bg-green-100/50 flex items-center justify-center">
                        <span className="text-xs font-medium text-green-700">Drop here</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start space-x-2">
                  <GripVertical className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Customize your schedule</p>
                    <p>Touch and drag any compartment to reorder your daily medication schedule.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DeviceSettings; 