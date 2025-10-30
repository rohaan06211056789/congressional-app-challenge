import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RainfallData } from '../../types';
import { format } from 'date-fns';

interface DataTableProps {
  data: RainfallData[];
}

export default function DataTable({ data }: DataTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskBadgeColor = (risk?: string) => {
    switch (risk) {
      case 'Low': return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'Medium': return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'High': return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
    }
  };

  if (!isExpanded) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="history" size={24} color="#111827" />
            <Text style={styles.title}>Historical Data</Text>
            <Text style={styles.count}>{data?.length || 0} entries</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsExpanded(true)}
            style={styles.toggleButton}
          >
            <Icon name="expand-more" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="history" size={24} color="#111827" />
          <Text style={styles.title}>Historical Data</Text>
          <Text style={styles.count}>{data?.length || 0} entries</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsExpanded(false)}
          style={styles.toggleButton}
        >
          <Icon name="expand-less" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            <View style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>Precipitation</Text>
            </View>
            <View style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>Temperature</Text>
            </View>
            <View style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>Drought Risk</Text>
            </View>
          </View>

          {/* Data Rows */}
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={[styles.cellText, styles.blueText]}>
                    {item.precipitation_mm?.toFixed(2) || '0.00'} mm
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  {item.temperature_max && item.temperature_min ? (
                    <Text style={styles.cellText}>
                      {item.temperature_max?.toFixed(1)}° / {item.temperature_min?.toFixed(1)}°C
                    </Text>
                  ) : (
                    <Text style={[styles.cellText, styles.grayText]}>N/A</Text>
                  )}
                </View>
                <View style={styles.tableCell}>
                  {item.drought_risk ? (
                    <View style={[
                      styles.riskBadge,
                      {
                        backgroundColor: getRiskBadgeColor(item.drought_risk).bg,
                        borderColor: getRiskBadgeColor(item.drought_risk).border,
                      }
                    ]}>
                      <Text style={[
                        styles.riskBadgeText,
                        { color: getRiskBadgeColor(item.drought_risk).text }
                      ]}>
                        {item.drought_risk}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.cellText, styles.grayText]}>-</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>
                No data available. Click "Fetch Latest Data" to get started.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  count: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleButton: {
    padding: 8,
  },
  tableContainer: {
    maxHeight: 500,
  },
  table: {
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#f9fafb',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
  },
  blueText: {
    fontWeight: '600',
    color: '#2563eb',
  },
  grayText: {
    color: '#9ca3af',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyRow: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});


