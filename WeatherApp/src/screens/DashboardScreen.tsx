import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import { RainfallData, Settings } from '../types';
import WeatherStats from '../components/dashboard/WeatherStats';
import RainfallChart from '../components/charts/RainfallChart';
import DroughtAnalysis from '../components/dashboard/DroughtAnalysis';
import DataTable from '../components/dashboard/DataTable';

interface DashboardScreenProps {
  settings: Settings | null;
  rainfallData: RainfallData[];
  onFetchWeather: (location: { latitude: number; longitude: number; location_name: string }) => Promise<void>;
  onRunAIAnalysis: () => Promise<void>;
  onNavigateToSettings?: () => void;
}

export default function DashboardScreen({
  settings,
  rainfallData,
  onFetchWeather,
  onRunAIAnalysis,
  onNavigateToSettings,
}: DashboardScreenProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: string; text: string } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    location_name: string;
  } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city && data.principalSubdivision
        ? `${data.city}, ${data.principalSubdivision}`
        : data.locality || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    } catch (error) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const detectLocation = async () => {
    setIsDetectingLocation(true);

    try {
      const position = await new Promise<GeolocationResponse>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          });
        }
      );

      if (position) {
        const { latitude, longitude } = position.coords;
        const location_name = await getLocationName(latitude, longitude);
        const location = {
          latitude,
          longitude,
          location_name,
        };
        setCurrentLocation(location);
        setIsDetectingLocation(false);
        return location;
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setAlertMessage({
        type: 'info',
        text: "Couldn't detect location automatically. Using default coordinates or configure manually in Settings.",
      });
      setIsDetectingLocation(false);
      return null;
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      if (!settings || settings.use_auto_location !== false) {
        await detectLocation();
      }
    };

    if (settings === null || (settings && settings.use_auto_location)) {
      initializeLocation();
    }
  }, [settings?.id]);

  const getActiveCoordinates = () => {
    if (settings?.use_auto_location === false && settings?.latitude && settings?.longitude) {
      return {
        lat: settings.latitude,
        lon: settings.longitude,
        name: settings.location_name || 'Unknown',
      };
    }

    if (currentLocation) {
      return {
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
        name: currentLocation.location_name,
      };
    }

    return {
      lat: settings?.latitude || 32.715736,
      lon: settings?.longitude || -117.161087,
      name: settings?.location_name || 'San Diego, CA',
    };
  };

  const fetchWeatherData = async () => {
    setIsRefreshing(true);
    setAlertMessage(null);

    try {
      const coords = getActiveCoordinates();
      await onFetchWeather({
        latitude: coords.lat,
        longitude: coords.lon,
        location_name: coords.name,
      });
      setAlertMessage({ type: 'success', text: `Weather data updated for ${coords.name}` });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setAlertMessage({ type: 'error', text: 'Failed to fetch weather data. Please try again.' });
    }

    setIsRefreshing(false);
  };

  const runAIAnalysis = async () => {
    if (!rainfallData || rainfallData.length === 0) {
      setAlertMessage({ type: 'error', text: 'Please fetch weather data first' });
      return;
    }

    setIsAnalyzing(true);
    setAlertMessage(null);

    try {
      await onRunAIAnalysis();
      setAlertMessage({ type: 'success', text: 'AI analysis completed successfully' });
    } catch (error) {
      console.error('Error running AI analysis:', error);
      setAlertMessage({ type: 'error', text: 'Failed to run AI analysis. Please try again.' });
    }

    setIsAnalyzing(false);
  };

  const latestWithAnalysis = rainfallData?.find((d) => d.drought_risk) || null;
  const activeCoords = getActiveCoordinates();

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Icon name="rainy" size={32} color="#3b82f6" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>RainQuant</Text>
            <Text style={styles.subtitle}>AI-Powered Rainfall Analysis</Text>
          </View>
        </View>
        {onNavigateToSettings && (
          <TouchableOpacity onPress={onNavigateToSettings} style={styles.settingsButton}>
            <Icon name="settings" size={24} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.locationInfo}>
        <Icon name="location-on" size={16} color="#9ca3af" />
        <Text style={styles.locationText}>{activeCoords.name}</Text>
        {settings?.use_auto_location !== false && (
          <View style={styles.autoBadge}>
            <Text style={styles.autoBadgeText}>Auto-detected</Text>
          </View>
        )}
      </View>

      {settings?.last_fetch && (
        <Text style={styles.lastUpdate}>
          Last updated: {new Date(settings.last_fetch).toLocaleString()}
        </Text>
      )}

      {alertMessage && (
        <View
          style={[
            styles.alertContainer,
            { backgroundColor: `${getAlertColor(alertMessage.type)}20`, borderColor: getAlertColor(alertMessage.type) },
          ]}
        >
          <Text style={[styles.alertText, { color: getAlertColor(alertMessage.type) }]}>
            {alertMessage.text}
          </Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.fetchButton}
          onPress={fetchWeatherData}
          disabled={isRefreshing || isDetectingLocation}
        >
          <Icon
            name={isRefreshing ? 'sync' : 'refresh'}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.fetchButtonText}>
            {isRefreshing ? 'Fetching...' : 'Fetch Latest Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={runAIAnalysis}
          disabled={isAnalyzing || !rainfallData || rainfallData.length === 0}
        >
          <Icon name="auto-fix-high" size={20} color="#a855f7" />
          <Text style={styles.analyzeButtonText}>
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </Text>
        </TouchableOpacity>
      </View>

      <WeatherStats data={rainfallData} droughtRisk={latestWithAnalysis?.drought_risk} />

      <RainfallChart data={rainfallData} />

      <DroughtAnalysis latestData={latestWithAnalysis} isAnalyzing={isAnalyzing} />

      <DataTable data={rainfallData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  settingsButton: {
    padding: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  autoBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  autoBadgeText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  alertContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fetchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
  },
  fetchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#a855f7',
    padding: 14,
    borderRadius: 12,
  },
  analyzeButtonText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
});

interface GeolocationResponse {
  coords: {
    latitude: number;
    longitude: number;
  };
}


