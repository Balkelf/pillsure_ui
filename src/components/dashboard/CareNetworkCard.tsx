import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CareNetworkCardProps {
  className?: string;
}

const caregivers = [
  {
    id: 1,
    name: "Emma",
    role: "Family",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "David",
    role: "Doctor",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Julia",
    role: "Nurse",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const CareNetworkCard = ({ className }: CareNetworkCardProps) => {
  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold leading-tight">
          Your care network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
          <div>
          {/* <p className="text-base font-medium leading-tight">{caregivers.length} connected caregivers</p> */}
              <p className="text-sm text-muted-foreground font-light">Family & healthcare team</p>
          </div>
          
        <div className="flex justify-start items-center py-1 gap-8">
            {caregivers.map((caregiver) => (
              <div key={caregiver.id} className="flex flex-col items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={caregiver.avatar} alt={caregiver.name} />
                  <AvatarFallback>{caregiver.name[0]}</AvatarFallback>
                </Avatar>
              <span className="mt-2 text-sm font-medium">{caregiver.name}</span>
              <span className="text-xs text-muted-foreground font-light">{caregiver.role}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Link to="/care-network">
            <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareNetworkCard;
