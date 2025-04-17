
// Health Connect API Service
// This service handles the connection to health data providers

interface HealthConnectData {
  steps: number;
  lastUpdated: string;
  isConnected: boolean;
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
    isConnected: true
  };
  
  // Store connection status in localStorage for persistence
  localStorage.setItem('healthApiConnected', 'true');
  localStorage.setItem('healthApiSteps', mockHealthData.steps.toString());
  
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
      
    return {
      steps,
      lastUpdated: new Date().toISOString(),
      isConnected: true
    };
  }
  
  return mockHealthData;
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
  
  // Update step count with small random variation to simulate real-time updates
  const currentSteps = parseInt(localStorage.getItem('healthApiSteps') || '5000', 10);
  const newSteps = currentSteps + Math.floor(Math.random() * 500);
  
  // Store updated steps
  localStorage.setItem('healthApiSteps', newSteps.toString());
  
  // Return updated data
  return {
    steps: newSteps,
    lastUpdated: new Date().toISOString(),
    isConnected: true
  };
};
