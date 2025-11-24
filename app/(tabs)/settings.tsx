import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import { RecordingSettings } from '../../types';
import { loadSettings, saveSettings } from '../../utils/storage';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<RecordingSettings>({
    quality: 'high',
    playbackSpeed: 1.0,
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    const userSettings = await loadSettings();
    setSettings(userSettings);
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setHasChanges(false);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const updateQuality = (quality: 'low' | 'medium' | 'high') => {
    setSettings({ ...settings, quality });
    setHasChanges(true);
  };

  const updatePlaybackSpeed = (speed: number) => {
    setSettings({ ...settings, playbackSpeed: speed });
    setHasChanges(true);
  };

  const QualityOption = ({
    value,
    label,
    description,
  }: {
    value: 'low' | 'medium' | 'high';
    label: string;
    description: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: colors.card },
        settings.quality === value && {
          borderColor: colors.primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => updateQuality(value)}
    >
      <View style={styles.optionHeader}>
        <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
        {settings.quality === value && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </View>
      <Text style={[styles.optionDescription, { color: colors.tabIconDefault }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  const SpeedOption = ({ speed, label }: { speed: number; label: string }) => (
    <TouchableOpacity
      style={[
        styles.speedOption,
        { backgroundColor: colors.card },
        settings.playbackSpeed === speed && {
          backgroundColor: colors.primary,
        },
      ]}
      onPress={() => updatePlaybackSpeed(speed)}
    >
      <Text
        style={[
          styles.speedLabel,
          {
            color:
              settings.playbackSpeed === speed ? '#fff' : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recording Quality
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.tabIconDefault }]}>
          Higher quality means larger file sizes
        </Text>

        <QualityOption
          value="low"
          label="Low Quality"
          description="Smallest file size, suitable for quick notes"
        />
        <QualityOption
          value="medium"
          label="Medium Quality"
          description="Balanced quality and file size"
        />
        <QualityOption
          value="high"
          label="High Quality"
          description="Best audio quality, larger files"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Playback Speed
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.tabIconDefault }]}>
          Adjust the default playback speed for recordings
        </Text>

        <View style={styles.speedContainer}>
          <SpeedOption speed={0.5} label="0.5×" />
          <SpeedOption speed={0.75} label="0.75×" />
          <SpeedOption speed={1.0} label="1×" />
          <SpeedOption speed={1.25} label="1.25×" />
          <SpeedOption speed={1.5} label="1.5×" />
          <SpeedOption speed={2.0} label="2×" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About
        </Text>
        
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Voice Recorder App
            </Text>
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              A simple and efficient audio recording application
            </Text>
          </View>
        </View>
      </View>

      {hasChanges && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Ionicons name="save-outline" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
          Design by Tlholo Tshwane using Expo and React Native
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  option: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
  },
  speedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  speedOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    gap: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
  },
});