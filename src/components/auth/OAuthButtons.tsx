
import { Button } from "@/components/ui/button";
import { Apple, Google } from "lucide-react";

interface OAuthButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  className?: string;
}

const OAuthButtons = ({ onGoogleLogin, onAppleLogin, className = "" }: OAuthButtonsProps) => {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2" 
        onClick={onGoogleLogin}
      >
        <Google className="h-4 w-4" />
        <span>Continue with Google</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2" 
        onClick={onAppleLogin}
      >
        <Apple className="h-4 w-4" />
        <span>Continue with Apple</span>
      </Button>
    </div>
  );
};

export default OAuthButtons;
