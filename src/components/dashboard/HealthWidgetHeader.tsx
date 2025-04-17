
import { Activity, PlusCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthWidgetHeaderProps {
  isConnected: boolean;
  isConnecting: boolean;
  isRefreshing: boolean;
  onConnect: () => void;
  onRefresh: () => void;
}

const HealthWidgetHeader = ({
  isConnected,
  isConnecting,
  isRefreshing,
  onConnect,
  onRefresh,
}: HealthWidgetHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-secondary/10 p-2 rounded-full mr-3">
          <Activity className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-medium">Health Activity</h3>
          <p className="text-sm text-muted-foreground">Today's progress</p>
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
