import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const NotFound = () => {
  return (
    <MobileLayout>
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold text-muted-foreground font-light">404</h1>
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground font-light">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6">
            <a href="/" className="text-primary hover:text-primary/70 underline">
              Go back home
            </a>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotFound;
