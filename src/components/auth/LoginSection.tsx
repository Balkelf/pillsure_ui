
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuthButtons from "./OAuthButtons";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const LoginSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate login success
    toast({
      title: "Login successful",
      description: "Welcome back!"
    });
    
    // In a real app, we would handle actual login here and redirect
  };
  
  const handleGoogleLogin = () => {
    toast({
      title: "Google login",
      description: "Google authentication would be triggered here"
    });
    // In a real app with OAuth, we would handle Google login
  };
  
  const handleAppleLogin = () => {
    toast({
      title: "Apple login",
      description: "Apple authentication would be triggered here"
    });
    // In a real app with OAuth, we would handle Apple login
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign in to PillSure</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <OAuthButtons 
          onGoogleLogin={handleGoogleLogin}
          onAppleLogin={handleAppleLogin}
        />
      </CardContent>
    </Card>
  );
};

export default LoginSection;
