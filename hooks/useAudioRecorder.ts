import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRef, useState } from 'react';
import { RecordingSettings } from '../types';
import { requestAudioPermissions } from '../utils/permissions';

export const useAudioRecorder = (settings: RecordingSettings) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  const getRecordingOptions = () => {
    const qualityMap = {
      low: Audio.RecordingOptionsPresets.LOW_QUALITY,
      medium: Audio.RecordingOptionsPresets.HIGH_QUALITY,
      high: Audio.RecordingOptionsPresets.HIGH_QUALITY,
    };

    return qualityMap[settings.quality];
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        getRecordingOptions()
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return null;

      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      
      if (!uri) throw new Error('Recording URI is null');

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const duration = status.durationMillis || 0;

      setRecording(null);
      setRecordingDuration(0);

      return {
        uri,
        duration: Math.floor(duration / 1000),
        size: fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0,
      };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecording(null);
      setIsRecording(false);
      throw error;
    }
  };

  const cancelRecording = async () => {
    try {
      if (recording) {
        if (durationInterval.current) {
          clearInterval(durationInterval.current);
          durationInterval.current = null;
        }

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        if (uri) {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(uri);
          }
        }

        setRecording(null);
        setRecordingDuration(0);
      }
    } catch (error) {
      console.error('Failed to cancel recording:', error);
    }
  };

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};