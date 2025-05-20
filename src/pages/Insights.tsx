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
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  Award, 
  Activity, 
  Heart 
} from "lucide-react";
import { 
  getAdherenceByDay, 
  getCurrentStreak, 
  healthMetrics 
} from "@/lib/data";
import { getHealthData, getAdherenceImpactScore } from "@/services/healthConnect";
import { useState, useEffect } from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const Insights = () => {
  // Get adherence data for chart
  const adherenceData = getAdherenceByDay();
  const [healthActivityData, setHealthActivityData] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);

  // Weekly average adherence
  const weeklyAverage = adherenceData.reduce((sum, day) => sum + day.adherence, 0) / adherenceData.length;
  
  // Current streak
  const currentStreak = getCurrentStreak();

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

  // Generate health activity data on component mount
  useEffect(() => {
    // Generate daily step data for the last 7 days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const activityData = days.map((day, index) => {
      // Generate random steps that correlate somewhat with adherence data
      const adherenceForDay = adherenceData[index]?.adherence || 50;
      const baseSteps = 4000 + (adherenceForDay * 30);
      const randomVariation = Math.floor(Math.random() * 2000) - 1000;
      const steps = Math.max(500, baseSteps + randomVariation);
      
      return {
        day,
        steps,
        adherence: adherenceForDay
      };
    });
    
    setHealthActivityData(activityData);
    
    // Generate correlation data between adherence and steps
    const corrData = activityData.map(item => ({
      adherence: item.adherence,
      steps: item.steps,
      day: item.day,
      impactScore: getAdherenceImpactScore(item.adherence, item.steps)
    }));
    
    setCorrelationData(corrData);
  }, []);

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground font-light">Track your health progress</p>
        </div>

        <Tabs defaultValue="adherence">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="adherence">Adherence</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adherence" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Weekly Overview</h2>
              <div className="flex items-center">
                <Button variant="ghost" size="icon-sm" className="rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Apr 11 - Apr 17</span>
                <Button variant="ghost" size="icon-sm" className="rounded-full">
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
                    <span className="text-sm text-muted-foreground font-light">Weekly average</span>
                    <span className="text-lg font-semibold mt-1">{weeklyAverage.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-secondary/10 p-2 rounded-full mb-2">
                      <Award className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground font-light">Current streak</span>
                    <span className="text-lg font-semibold mt-1">{currentStreak} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-tight flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-secondary" />
                  Daily Step Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="steps" 
                        fill="hsl(var(--secondary))" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-tight flex items-center">
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
                <CardTitle className="text-lg font-semibold leading-tight flex items-center">
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
          
          <TabsContent value="correlation" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-tight flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Medication + Activity Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-light mb-4 leading-normal">
                  The chart below shows how your physical activity correlates with your medication adherence,
                  and the resulting health impact score.
                </p>
                <div className="h-64 w-full">
                  <ChartContainer 
                    className="w-full h-full" 
                    config={{
                      steps: { color: "hsl(var(--secondary))" },
                      adherence: { color: "hsl(var(--primary))" },
                      impactScore: { color: "hsl(var(--destructive))" }
                    }}
                  >
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="steps" name="Steps" />
                      <YAxis type="number" dataKey="adherence" name="Adherence %" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter 
                        name="Health Impact" 
                        data={correlationData} 
                        fill="hsl(var(--primary))" 
                      />
                    </ScatterChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold leading-tight flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                  Daily Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={correlationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="adherence" fill="hsl(var(--primary))" name="Adherence %" />
                      <Bar yAxisId="right" dataKey="impactScore" fill="hsl(var(--destructive))" name="Impact Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground font-light mt-4">
                  Higher medication adherence combined with regular physical activity leads to better health outcomes 
                  and improved medication effectiveness. Aim for consistency in both areas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Insights;
