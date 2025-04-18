
import { Activity, PlusCircle, RefreshCcw } from "lucide-react";
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
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-secondary/10 p-2 rounded-full mr-3">
          <Activity className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-medium">Health Activity</h3>
          <p className="text-sm text-muted-foreground">Today's progress</p>
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
                <span className="text-muted-foreground ml-1">
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
      </div>
      {!isConnected ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-secondary text-sm"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <RefreshCcw className="mr-1 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <PlusCircle className="mr-1 h-4 w-4" />
              Connect
            </>
          )}
        </Button>
      ) : (
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
            <Activity className="text-secondary h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthWidgetHeader;
