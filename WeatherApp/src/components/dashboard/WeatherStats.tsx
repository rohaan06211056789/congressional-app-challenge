import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RainfallData } from '../../types';

interface WeatherStatsProps {
  data: RainfallData[];
  droughtRisk?: string;
}

export default function WeatherStats({ data, droughtRisk }: WeatherStatsProps) {
  const totalPrecipitation = data?.reduce((sum, item) => sum + (item.precipitation_mm || 0), 0) || 0;
  const avgPrecipitation = data?.length ? (totalPrecipitation / data.length).toFixed(2) : 0;
  const last7Days = data?.slice(0, 7) || [];
  const last7DaysTotal = last7Days.reduce((sum, item) => sum + (item.precipitation_mm || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todayData = data?.find(d => d.date === today);
  const todayRainfall = todayData?.precipitation_mm || 0;

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    bgColor = '#1f2937',
    iconColor = '#60a5fa'
  }: {
    title: string;
    value: string;
    icon: string;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={styles.statContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatCard
        title="Today's Rainfall"
        value={`${todayRainfall.toFixed(1)} mm`}
        icon="today"
        bgColor="#1f2937"
        iconColor="#60a5fa"
      />
      <StatCard
        title="Average Daily"
        value={`${avgPrecipitation} mm`}
        icon="water-drop"
        bgColor="#1f2937"
        iconColor="#a78bfa"
      />
      <StatCard
        title="Last 7 Days"
        value={`${last7DaysTotal.toFixed(1)} mm`}
        icon="opacity"
        bgColor="#1f2937"
        iconColor="#06b6d4"
      />
      <StatCard
        title="Drought Risk"
        value={droughtRisk || "Analyzing..."}
        icon="warning"
        bgColor="#1f2937"
        iconColor={getRiskColor(droughtRisk)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
});


