import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine } from 'victory-native';
import { RainfallData } from '../../types';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RainfallChartProps {
  data: RainfallData[];
}

export default function RainfallChart({ data }: RainfallChartProps) {
  const chartData = data?.map(item => ({
    x: format(new Date(item.date), 'MMM d'),
    y: item.precipitation_mm || 0,
    fullDate: item.date
  })) || [];

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="timeline" size={24} color="#3b82f6" />
            <Text style={styles.title}>Rainfall Trend Analysis</Text>
          </View>
          <Text style={styles.subtitle}>Daily precipitation over time</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No rainfall data available yet. Fetch data to see trends.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="timeline" size={24} color="#3b82f6" />
          <Text style={styles.title}>Rainfall Trend Analysis</Text>
        </View>
        <Text style={styles.subtitle}>Daily precipitation over time</Text>
      </View>

      <ScrollView horizontal style={styles.chartContainer}>
        <VictoryChart
          height={350}
          width={Math.max(600, chartData.length * 50)}
          domainPadding={{ y: [0, 10] }}
          padding={{ left: 60, right: 20, top: 20, bottom: 60 }}
        >
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: '#6b7280' },
              tickLabels: { fill: '#6b7280', fontSize: 12 },
              grid: { stroke: '#e5e7eb', strokeDasharray: '3 3' }
            }}
            label="Precipitation (mm)"
          />
          <VictoryAxis
            style={{
              axis: { stroke: '#6b7280' },
              tickLabels: { fill: '#6b7280', fontSize: 12 },
              grid: { stroke: '#e5e7eb', strokeDasharray: '3 3' }
            }}
          />
          <VictoryLine
            data={chartData}
            style={{
              data: { stroke: '#3b82f6', strokeWidth: 3 },
            }}
          />
          <VictoryArea
            data={chartData}
            style={{
              data: { fill: '#3b82f6', fillOpacity: 0.3 }
            }}
          />
        </VictoryChart>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 32,
  },
  chartContainer: {
    height: 400,
  },
  emptyContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});


