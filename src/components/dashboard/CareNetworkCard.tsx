
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { caregivers } from "@/lib/data";

interface CareNetworkCardProps {
  className?: string;
}

const CareNetworkCard = ({ className }: CareNetworkCardProps) => {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{caregivers.length} connected caregivers</h3>
              <p className="text-sm text-muted-foreground">Family & healthcare team</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-sm">
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareNetworkCard;
