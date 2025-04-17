
// Health Connect API Service
// This service handles the connection to health data providers

interface HealthConnectData {
  steps: number;
  lastUpdated: string;
  isConnected: boolean;
  // Additional health metrics
  averageHeartRate?: number;
  activeMinutes?: number;
  caloriesBurned?: number;
}

// Initial mock state before real connection
let mockHealthData: HealthConnectData = {
  steps: 0,
  lastUpdated: new Date().toISOString(),
  isConnected: false
};

// In a real implementation, this would be an actual API connection
// For now, we'll simulate the connection with mock data
export const connectToHealthApi = async (): Promise<boolean> => {
  console.log("Connecting to Health Connect API...");
  
  // Simulate API connection delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Successfully connected - update our mock data
  mockHealthData = {
    steps: Math.floor(Math.random() * 4000) + 3000, // Random steps between 3000-7000
    lastUpdated: new Date().toISOString(),
    isConnected: true,
    averageHeartRate: Math.floor(Math.random() * 20) + 65, // Random HR between 65-85
    activeMinutes: Math.floor(Math.random() * 30) + 15, // Random active minutes between 15-45
    caloriesBurned: Math.floor(Math.random() * 200) + 100 // Random calories between 100-300
  };
  
  // Store connection status in localStorage for persistence
  localStorage.setItem('healthApiConnected', 'true');
  localStorage.setItem('healthApiSteps', mockHealthData.steps.toString());
  localStorage.setItem('healthApiActiveMinutes', mockHealthData.activeMinutes?.toString() || '0');
  localStorage.setItem('healthApiCaloriesBurned', mockHealthData.caloriesBurned?.toString() || '0');
  localStorage.setItem('healthApiHeartRate', mockHealthData.averageHeartRate?.toString() || '0');
  
  console.log("Health Connect API connected successfully");
  return true;
};

// Disconnect from health API
export const disconnectFromHealthApi = async (): Promise<boolean> => {
  console.log("Disconnecting from Health Connect API...");
  
  // Simulate disconnect delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Reset our mock data
  mockHealthData = {
    steps: 0,
    lastUpdated: new Date().toISOString(),
    isConnected: false
  };
  
  // Update local storage
  localStorage.removeItem('healthApiConnected');
  localStorage.removeItem('healthApiSteps');
  localStorage.removeItem('healthApiActiveMinutes');
  localStorage.removeItem('healthApiCaloriesBurned');
  localStorage.removeItem('healthApiHeartRate');
  
  console.log("Health Connect API disconnected successfully");
  return true;
};

// Get health data - in a real app, this would fetch from the actual API
export const getHealthData = (): HealthConnectData => {
  // Check if we have a stored connection
  const isConnected = localStorage.getItem('healthApiConnected') === 'true';
  
  if (isConnected) {
    const steps = parseInt(localStorage.getItem('healthApiSteps') || '0', 10) || 
      mockHealthData.steps || 
      Math.floor(Math.random() * 4000) + 3000;
    
    const activeMinutes = parseInt(localStorage.getItem('healthApiActiveMinutes') || '0', 10) || 
      mockHealthData.activeMinutes || 
      Math.floor(Math.random() * 30) + 15;
    
    const caloriesBurned = parseInt(localStorage.getItem('healthApiCaloriesBurned') || '0', 10) || 
      mockHealthData.caloriesBurned || 
      Math.floor(Math.random() * 200) + 100;
    
    const averageHeartRate = parseInt(localStorage.getItem('healthApiHeartRate') || '0', 10) || 
      mockHealthData.averageHeartRate || 
      Math.floor(Math.random() * 20) + 65;
      
    return {
      steps,
      activeMinutes,
      caloriesBurned,
      averageHeartRate,
      lastUpdated: new Date().toISOString(),
      isConnected: true
    };
  }
  
  return mockHealthData;
};

// Get adherence impact score - correlation between activity and adherence
export const getAdherenceImpactScore = (adherenceRate: number, steps: number): number => {
  // This is a simplified algorithm to calculate the "impact score"
  // In a real app, this would be more sophisticated and based on real data
  const stepGoal = 8000;
  const stepPercentage = Math.min(100, Math.round((steps / stepGoal) * 100));
  
  // Calculate impact score: average of adherence rate and step percentage, with bonus for high values of both
  const baseScore = (adherenceRate + stepPercentage) / 2;
  const bonusScore = (adherenceRate > 80 && stepPercentage > 80) ? 10 : 0;
  
  return Math.min(100, Math.round(baseScore + bonusScore));
};

// Refresh health data - in a real implementation this would fetch the latest data
export const refreshHealthData = async (): Promise<HealthConnectData> => {
  console.log("Refreshing health data...");
  
  // Check if connected first
  const isConnected = localStorage.getItem('healthApiConnected') === 'true';
  
  if (!isConnected) {
    console.log("Not connected to Health API");
    return mockHealthData;
  }
  
  // Simulate API refresh delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update metrics with small random variation to simulate real-time updates
  const currentSteps = parseInt(localStorage.getItem('healthApiSteps') || '5000', 10);
  const newSteps = currentSteps + Math.floor(Math.random() * 500);
  
  const currentActiveMinutes = parseInt(localStorage.getItem('healthApiActiveMinutes') || '30', 10);
  const newActiveMinutes = currentActiveMinutes + Math.floor(Math.random() * 5);
  
  const currentCalories = parseInt(localStorage.getItem('healthApiCaloriesBurned') || '200', 10);
  const newCalories = currentCalories + Math.floor(Math.random() * 30);
  
  const currentHeartRate = parseInt(localStorage.getItem('healthApiHeartRate') || '75', 10);
  const newHeartRate = currentHeartRate + Math.floor(Math.random() * 3) - 1; // Can go up or down
  
  // Store updated values
  localStorage.setItem('healthApiSteps', newSteps.toString());
  localStorage.setItem('healthApiActiveMinutes', newActiveMinutes.toString());
  localStorage.setItem('healthApiCaloriesBurned', newCalories.toString());
  localStorage.setItem('healthApiHeartRate', newHeartRate.toString());
  
  // Return updated data
  return {
    steps: newSteps,
    activeMinutes: newActiveMinutes,
    caloriesBurned: newCalories,
    averageHeartRate: newHeartRate,
    lastUpdated: new Date().toISOString(),
    isConnected: true
  };
};
