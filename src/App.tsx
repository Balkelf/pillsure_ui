
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import Reminders from "./pages/Reminders";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import InitialSetup from "./pages/InitialSetup";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Check if user has completed initial setup
const HasCompletedSetup = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [hasSetup, setHasSetup] = useState(false);
  
  useEffect(() => {
    const pillsureMode = localStorage.getItem("pillsureMode");
    setHasSetup(!!pillsureMode);
    setLoading(false);
  }, []);
  
  if (loading) {
    return null;
  }
  
  return hasSetup ? <>{children}</> : <Navigate to="/setup" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/setup" element={<InitialSetup />} />
          <Route path="/" element={<HasCompletedSetup><Dashboard /></HasCompletedSetup>} />
          <Route path="/medications" element={<HasCompletedSetup><Medications /></HasCompletedSetup>} />
          <Route path="/reminders" element={<HasCompletedSetup><Reminders /></HasCompletedSetup>} />
          <Route path="/insights" element={<HasCompletedSetup><Insights /></HasCompletedSetup>} />
          <Route path="/profile" element={<HasCompletedSetup><Profile /></HasCompletedSetup>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
