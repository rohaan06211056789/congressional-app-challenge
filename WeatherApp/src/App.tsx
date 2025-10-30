import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { RainfallData, Settings } from './types';

const Stack = createStackNavigator();

// Placeholder for actual API client
const mockAPI = {
  fetchWeatherData: async (location: { latitude: number; longitude: number; location_name: string }) => {
    // This would normally call your backend API
    console.log('Fetching weather for:', location);
    return Promise.resolve();
  },
  
  runAIAnalysis: async () => {
    // This would normally call your AI analysis API
    console.log('Running AI analysis');
    return Promise.resolve();
  },
  
  getSettings: async (): Promise<Settings | null> => {
    // This would normally fetch from your backend
    return null;
  },
  
  saveSettings: async (settings: Partial<Settings>) => {
    // This would normally save to your backend
    console.log('Saving settings:', settings);
    return Promise.resolve();
  },
};

// Placeholder data
const mockRainfallData: RainfallData[] = [];
const mockSettings: Settings | null = null;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          options={{ title: 'RainQuant' }}
        >
          {(props) => (
            <DashboardScreen
              {...props}
              settings={mockSettings}
              rainfallData={mockRainfallData}
              onFetchWeather={mockAPI.fetchWeatherData}
              onRunAIAnalysis={mockAPI.runAIAnalysis}
              onNavigateToSettings={() => props.navigation.navigate('Settings')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Settings"
          options={{ title: 'Settings' }}
        >
          {(props) => (
            <SettingsScreen
              {...props}
              settings={mockSettings}
              onSave={mockAPI.saveSettings}
              onLogout={() => console.log('Logout')}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


