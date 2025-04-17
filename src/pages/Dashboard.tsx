
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Bell, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import AdherenceCard from "@/components/dashboard/AdherenceCard";
import NextMedicationCard from "@/components/dashboard/NextMedicationCard";
import CareNetworkCard from "@/components/dashboard/CareNetworkCard";
import MotivationalWidget from "@/components/dashboard/MotivationalWidget";
import DeviceStatusCard from "@/components/dashboard/DeviceStatusCard";

const Dashboard = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hi, Maria</h1>
            <p className="text-muted-foreground">Let's keep you on track today</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        <AdherenceCard />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Next medication</h2>
            <Link to="/medications">
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                View all
              </Button>
            </Link>
          </div>

          <NextMedicationCard />
        </div>

        <DeviceStatusCard />
        
        <MotivationalWidget />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your care network</h2>
          <CareNetworkCard />
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
