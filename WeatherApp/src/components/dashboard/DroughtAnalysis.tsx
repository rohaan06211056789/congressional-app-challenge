import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RainfallData } from '../../types';
import { format } from 'date-fns';

interface DroughtAnalysisProps {
  latestData: RainfallData | null;
  isAnalyzing: boolean;
}

export default function DroughtAnalysis({ latestData, isAnalyzing }: DroughtAnalysisProps) {
  if (!latestData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Weather Insights</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No analysis available yet. Fetch data to see AI insights.
          </Text>
        </View>
      </View>
    );
  }

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'Low':
        return { color: '#10b981', icon: 'check-circle', bgColor: '#d1fae5' };
      case 'Medium':
        return { color: '#f59e0b', icon: 'warning', bgColor: '#fef3c7' };
      case 'High':
        return { color: '#ef4444', icon: 'error', bgColor: '#fee2e2' };
      default:
        return { color: '#6b7280', icon: 'info', bgColor: '#f3f4f6' };
    }
  };

  const config = getRiskConfig(latestData.drought_risk || 'Low');

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Weather Insights</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analyzing rainfall patterns...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Weather Insights</Text>
        <Text style={styles.subtitle}>Friendly analysis for everyday life</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.riskCard, { backgroundColor: config.bgColor, borderColor: config.color }]}>
          <Icon name={config.icon} size={32} color={config.color} />
          <View style={styles.riskInfo}>
            <Text style={[styles.riskBadge, { color: config.color }]}>
              {latestData.drought_risk} Risk
            </Text>
            <Text style={styles.riskDate}>
              Assessment Date: {format(new Date(latestData.date), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>What This Means</Text>
          </View>
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>
              {latestData.ai_explanation || 'No analysis available'}
            </Text>
          </View>
        </View>

        {latestData.ai_suggestions && latestData.ai_suggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="lightbulb" size={20} color="#d97706" />
              <Text style={styles.sectionTitle}>Things to Consider</Text>
            </View>
            <View style={styles.suggestionsList}>
              {latestData.ai_suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <View style={styles.suggestionNumber}>
                    <Text style={styles.suggestionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    maxHeight: 400,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  riskInfo: {
    flex: 1,
  },
  riskBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  riskDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  explanationBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  suggestionNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
});


