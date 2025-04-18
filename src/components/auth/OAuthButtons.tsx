
import { Button } from "@/components/ui/button";
import { Apple, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OAuthButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  className?: string;
}

const OAuthButtons = ({ className = "" }: OAuthButtonsProps) => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      toast({
        title: "Error signing in with Apple",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2" 
        onClick={handleGoogleLogin}
      >
        <Mail className="h-4 w-4" />
        <span>Continue with Google</span>
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2" 
        onClick={handleAppleLogin}
      >
        <Apple className="h-4 w-4" />
        <span>Continue with Apple</span>
      </Button>
    </div>
  );
};

export default OAuthButtons;
