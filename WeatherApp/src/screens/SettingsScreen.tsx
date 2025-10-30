import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Settings } from '../types';

interface SettingsScreenProps {
  settings: Settings | null;
  onSave: (settings: Partial<Settings>) => void;
  onLogout?: () => void;
}

export default function SettingsScreen({ settings, onSave, onLogout }: SettingsScreenProps) {
  const [formData, setFormData] = useState<Partial<Settings>>({
    latitude: settings?.latitude || 32.715736,
    longitude: settings?.longitude || -117.161087,
    location_name: settings?.location_name || 'San Diego, CA',
    alert_email: settings?.alert_email || '',
    enable_alerts: settings?.enable_alerts ?? true,
    use_auto_location: settings?.use_auto_location ?? true,
  });

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (settings) {
      setFormData({
        latitude: settings.latitude || 32.715736,
        longitude: settings.longitude || -117.161087,
        location_name: settings.location_name || 'San Diego, CA',
        alert_email: settings.alert_email || '',
        enable_alerts: settings.enable_alerts ?? true,
        use_auto_location: settings.use_auto_location ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = () => {
    try {
      onSave(formData);
      setSaveMessage('Settings saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuration</Text>
        <Text style={styles.headerSubtitle}>Customize your RainQuant experience</Text>
      </View>

      {saveMessage && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{saveMessage}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="location-on" size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Location Settings</Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Icon name="navigation" size={20} color="#3b82f6" />
              <View>
                <Text style={styles.switchLabel}>Auto-Detect Location</Text>
                <Text style={styles.switchDescription}>
                  Use your device's GPS to automatically track your location
                </Text>
              </View>
            </View>
            <Switch
              value={formData.use_auto_location}
              onValueChange={(value) => setFormData({ ...formData, use_auto_location: value })}
            />
          </View>

          {!formData.use_auto_location && (
            <>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.latitude?.toString()}
                    onChangeText={(text) =>
                      setFormData({ ...formData, latitude: parseFloat(text) })
                    }
                    keyboardType="numeric"
                    placeholder="32.715736"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.longitude?.toString()}
                    onChangeText={(text) =>
                      setFormData({ ...formData, longitude: parseFloat(text) })
                    }
                    keyboardType="numeric"
                    placeholder="-117.161087"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.location_name}
                  onChangeText={(text) => setFormData({ ...formData, location_name: text })}
                  placeholder="San Diego, CA"
                />
                <Text style={styles.helperText}>A friendly name for your location</Text>
              </View>
            </>
          )}

          {formData.use_auto_location && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📍 Your location will be automatically detected when you fetch weather data.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="email" size={24} color="#a855f7" />
            <Text style={styles.sectionTitle}>Alert Settings</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alert Email</Text>
            <TextInput
              style={styles.input}
              value={formData.alert_email}
              onChangeText={(text) => setFormData({ ...formData, alert_email: text })}
              keyboardType="email-address"
              placeholder="your@email.com"
            />
            <Text style={styles.helperText}>Receive drought alerts when risk is Medium or High</Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Icon name="notifications" size={20} color="#a855f7" />
              <View>
                <Text style={styles.switchLabel}>Enable Email Alerts</Text>
                <Text style={styles.switchDescription}>Get notified about drought conditions</Text>
              </View>
            </View>
            <Switch
              value={formData.enable_alerts}
              onValueChange={(value) => setFormData({ ...formData, enable_alerts: value })}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
        >
          <Icon name="save" size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {onLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
          >
            <Icon name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  messageBox: {
    backgroundColor: '#10b981',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  switchDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});


