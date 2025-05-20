import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  className?: string;
}

const InsightCard = ({ className }: InsightCardProps) => {
  return (
    <Card className={cn("border-none shadow-sm bg-[#70B8FF] text-white text-center overflow-hidden rounded-xl", className)}>
      <CardContent className="p-6 flex flex-col items-center justify-between space-y-4">
        <p className="text-sm font-medium text-white/90">Most missed dose</p>
        
        <div className="py-2">
          <div className="flex justify-center mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="white"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Lunch dose</h2>
          <p className="text-sm font-normal text-white/90">Happening every 3 days on average</p>
        </div>
        
        <Link to="/insights" className="w-full flex justify-center">
          <Button 
            variant="default" 
            size="sm" 
            className="bg-[#3687D8] hover:bg-[#2a70b9] text-white border-none px-4 py-2 h-auto rounded-md"
          >
                <BarChart className="mr-2 h-4 w-4" />
                View Insights
              </Button>
            </Link>
      </CardContent>
    </Card>
  );
};

export default InsightCard; 