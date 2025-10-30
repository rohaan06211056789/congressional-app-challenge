import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('San Diego, CA');

  const fetchWeatherData = async () => {
    setIsLoading(true);
    
    try {
      // Using Open-Meteo API for weather data
      const lat = 32.715736;
      const lon = -117.161087;
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&start_date=${startDate}&end_date=${endDate}&timezone=auto`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.daily && data.daily.time) {
        const records = data.daily.time.map((date, i) => ({
          date,
          precipitation: data.daily.precipitation_sum[i] || 0,
          tempMax: data.daily.temperature_2m_max[i] || 0,
          tempMin: data.daily.temperature_2m_min[i] || 0,
        }));
        
        setWeatherData(records);
      } else {
        throw new Error('No weather data received');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>RainQuant</Text>
          <Text style={styles.subtitle}>AI-Powered Rainfall Analysis</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location: {location}</Text>
          <Text style={styles.cardText}>
            Tap "Fetch Weather Data" to load 30 days of historical weather data from Open-Meteo API.
          </Text>
        </View>

        {weatherData && (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Today's Rain</Text>
                <Text style={styles.statValue}>{weatherData[0].precipitation.toFixed(1)} mm</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>High Temp</Text>
                <Text style={styles.statValue}>{weatherData[0].tempMax.toFixed(1)}°C</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Low Temp</Text>
                <Text style={styles.statValue}>{weatherData[0].tempMin.toFixed(1)}°C</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Days</Text>
                <Text style={styles.statValue}>{weatherData.length}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>30-Day Rainfall Trend</Text>
              <View style={styles.chartContainer}>
                {weatherData.slice(0, 30).reverse().map((day, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View style={[styles.bar, { height: Math.max(2, day.precipitation * 10) }]} />
                    <Text style={styles.barLabel}>{day.date.split('-').slice(-2).join('/')}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>30-Day Temperature Trend (°C)</Text>
              <Text style={styles.chartLegend}>Red = Max, Blue = Min</Text>
              <View style={styles.tempChartContainer}>
                {weatherData.slice(0, 30).reverse().map((day, index) => (
                  <View key={index} style={styles.tempBarContainer}>
                    {/* Min temp bar (blue) */}
                    <View style={[styles.tempBar, { 
                      height: Math.max(15, day.tempMin * 3),
                      backgroundColor: '#3b82f6',
                    }]} />
                    {/* Max temp bar (red) */}
                    <View style={[styles.tempBar, { 
                      height: Math.max(15, day.tempMax * 3),
                      backgroundColor: '#ef4444',
                    }]} />
                    {/* Date label */}
                    <Text style={styles.tempLabel}>
                      {day.date.split('-').slice(-2).join('/')}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.tempLegendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.legendText}>Max Temp</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#3b82f6' }]} />
                  <Text style={styles.legendText}>Min Temp</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={fetchWeatherData}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Fetch Weather Data</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#1f2937',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginTop: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginBottom: 4,
  },
  tempBar: {
    width: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    color: '#9ca3af',
    transform: [{ rotate: '-45deg' }],
    marginTop: 4,
  },
  chartLegend: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartsSideBySide: {
    flexDirection: 'row',
    gap: 16,
  },
  chartHalf: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tempChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    marginTop: 16,
    paddingBottom: 20,
  },
  tempBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  tempBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  tempLabel: {
    fontSize: 7,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  tempLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: '#9ca3af',
  },
});

export default App;

