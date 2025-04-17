
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Award } from "lucide-react";
import { getAdherenceByDay, getCurrentStreak, healthMetrics } from "@/lib/data";

const Insights = () => {
  // Get adherence data for chart
  const adherenceData = getAdherenceByDay();

  // Transform health metrics for the charts
  const healthData = healthMetrics.map(metric => {
    const date = new Date(metric.timestamp);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    if (metric.type === 'blood_glucose') {
      return {
        date: dateStr,
        glucose: typeof metric.value === 'number' ? metric.value : 0,
      };
    } else if (metric.type === 'blood_pressure') {
      const systolic = typeof metric.value === 'string' 
        ? parseInt(metric.value.split('/')[0])
        : 0;
      
      return {
        date: dateStr,
        bp: systolic,
      };
    }
    
    return { date: dateStr };
  }).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    
    if (existing) {
      return acc.map(item => {
        if (item.date === curr.date) {
          return { ...item, ...curr };
        }
        return item;
      });
    }
    
    return [...acc, curr];
  }, [] as any[]);

  // Calculate weekly adherence average
  const weeklyAverage = adherenceData.reduce((sum, day) => sum + day.adherence, 0) / adherenceData.length;
  
  // Get current streak
  const currentStreak = getCurrentStreak();

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground">Track your health progress</p>
        </div>

        <Tabs defaultValue="adherence">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adherence">Adherence</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adherence" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Weekly Overview</h2>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Apr 11 - Apr 17</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adherenceData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} tickCount={6} />
                      <Tooltip />
                      <Bar dataKey="adherence" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary/10 p-2 rounded-full mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Weekly average</span>
                    <span className="text-2xl font-bold">{weeklyAverage.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-secondary/10 p-2 rounded-full mb-2">
                      <Award className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Current streak</span>
                    <span className="text-2xl font-bold">{currentStreak} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Blood Glucose Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[80, 160]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="glucose" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[80, 140]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="bp" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Insights;
