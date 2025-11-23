import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recording, RecordingSettings } from '../types';

const RECORDINGS_KEY = '@recordings';
const SETTINGS_KEY = '@settings';

export const saveRecordings = async (recordings: Recording[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(recordings));
  } catch (error) {
    console.error('Failed to save recordings:', error);
    throw error;
  }
};

export const loadRecordings = async (): Promise<Recording[]> => {
  try {
    const data = await AsyncStorage.getItem(RECORDINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load recordings:', error);
    return [];
  }
};

export const saveSettings = async (settings: RecordingSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<RecordingSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { quality: 'high', playbackSpeed: 1.0 };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return { quality: 'high', playbackSpeed: 1.0 };
  }
};