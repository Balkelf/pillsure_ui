import { PlusCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthWidgetHeaderProps {
  isConnected: boolean;
  isConnecting: boolean;
  isRefreshing: boolean;
  onConnect: () => void;
  onRefresh: () => void;
  hba1cValue?: number;
  hba1cDate?: string;
}

const HealthWidgetHeader = ({
  isConnected,
  isConnecting,
  isRefreshing,
  onConnect,
  onRefresh,
  hba1cValue,
  hba1cDate,
}: HealthWidgetHeaderProps) => {
  const getHbA1cStatus = (value?: number) => {
    if (!value) return null;
    
    if (value < 48) {
      return "good";
    } else if (value < 58) {
      return "moderate";
    } else {
      return "high";
    }
  };

  const hba1cStatus = getHbA1cStatus(hba1cValue);
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Health Activity</h3>
          <p className="text-sm text-muted-foreground font-light">Today's progress</p>
          {isConnected && hba1cValue && (
            <div className="mt-1 text-xs">
              <span>HbA1c: </span>
              <span className={`font-medium ${
                hba1cStatus === "good" ? "text-green-600" : 
                hba1cStatus === "moderate" ? "text-amber-600" : 
                "text-red-600"
              }`}>
                {hba1cValue} mmol/mol
              </span>
              {hba1cDate && (
                <span className="text-muted-foreground font-light ml-1">
                  ({new Date(hba1cDate).toLocaleDateString()} - {
                    new Date() > new Date(new Date(hba1cDate).setMonth(new Date(hba1cDate).getMonth() + 6)) 
                      ? "Due for recheck" 
                      : "Next check: " + new Date(new Date(hba1cDate).setMonth(new Date(hba1cDate).getMonth() + 6)).toLocaleDateString()
                  })
                </span>
              )}
            </div>
          )}
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="flex items-center">
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        )}
      </div>
      
      {!isConnected && (
        <div className="mt-6">
          <p className="text-sm font-light mb-3">
            Connect your fitness tracker to get personalized health insights
          </p>
          <Button 
            variant="primary-outline" 
            size="sm" 
            className="rounded-full px-4 w-full"
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HealthWidgetHeader;
