import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { RecordButton } from '../../components/RecordButton';
import Colors from '../../constants/Colors';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useRecordings } from '../../hooks/useRecordings';
import { Recording, RecordingSettings } from '../../types';
import { loadSettings } from '../../utils/storage';

export default function RecordScreen() {
  const [settings, setSettings] = useState<RecordingSettings>({
    quality: 'high',
    playbackSpeed: 1.0,
  });
  const [filename, setFilename] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recordingData, setRecordingData] = useState<any>(null);

  const { isRecording, recordingDuration, startRecording, stopRecording, cancelRecording } =
    useAudioRecorder(settings);
  const { addRecording } = useRecordings();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    const userSettings = await loadSettings();
    setSettings(userSettings);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordPress = async () => {
    if (isRecording) {
      try {
        const data = await stopRecording();
        if (data) {
          setRecordingData(data);
          setFilename(generateDefaultFilename());
          setShowSaveDialog(true);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to stop recording. Please try again.');
      }
    } else {
      try {
        await startRecording();
      } catch (error) {
        Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
      }
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Recording',
      'Are you sure you want to cancel this recording?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await cancelRecording();
          },
        },
      ]
    );
  };

  const generateDefaultFilename = () => {
    const now = new Date();
    return `Recording_${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!filename.trim()) {
      Alert.alert('Error', 'Please enter a filename');
      return;
    }

    if (!recordingData) {
      Alert.alert('Error', 'No recording data available');
      return;
    }

    try {
      const newRecording: Recording = {
        id: Date.now().toString(),
        uri: recordingData.uri,
        filename: filename.trim(),
        duration: recordingData.duration,
        date: Date.now(),
        size: recordingData.size,
      };

      await addRecording(newRecording);
      
      setShowSaveDialog(false);
      setFilename('');
      setRecordingData(null);

      Alert.alert('Success', 'Recording saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save recording. Please try again.');
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setShowSaveDialog(false);
            setFilename('');
            setRecordingData(null);
          },
        },
      ]
    );
  };

  if (showSaveDialog) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.saveDialog}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          
          <Text style={[styles.saveTitle, { color: colors.text }]}>
            Recording Complete
          </Text>
          
          <Text style={[styles.saveDuration, { color: colors.tabIconDefault }]}>
            Duration: {formatDuration(recordingData?.duration || 0)}
          </Text>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={filename}
            onChangeText={setFilename}
            placeholder="Enter filename"
            placeholderTextColor={colors.tabIconDefault}
            autoFocus
          />

          <View style={styles.saveActions}>
            <TouchableOpacity
              style={[styles.button, styles.discardButton]}
              onPress={handleDiscard}
            >
              <Text style={styles.buttonText}>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={[styles.recordingText, { color: colors.error }]}>
                Recording
              </Text>
            </View>
          )}

          <Text style={[styles.timer, { color: colors.text }]}>
            {formatDuration(recordingDuration)}
          </Text>

          <Text style={[styles.hint, { color: colors.tabIconDefault }]}>
            {isRecording
              ? 'Tap the button to stop recording'
              : 'Tap the button to start recording'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <RecordButton isRecording={isRecording} onPress={handleRecordPress} />
        </View>

        {isRecording && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close-circle-outline" size={24} color={colors.error} />
            <Text style={[styles.cancelText, { color: colors.error }]}>
              Cancel Recording
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Quality: {settings.quality.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#dc3545',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 40,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 20,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveDialog: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  saveTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  saveDuration: {
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
  },
  saveActions: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  discardButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});