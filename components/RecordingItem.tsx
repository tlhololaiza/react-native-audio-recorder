import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Colors from '../constants/Colors';
import { Recording } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface RecordingItemProps {
  recording: Recording;
  onDelete: (id: string) => void;
  playbackSpeed: number;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  onDelete,
  playbackSpeed,
}) => {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleDelete = () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(recording.id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="musical-notes" size={24} color={colors.primary} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.filename, { color: colors.text }]}>
            {recording.filename}
          </Text>
          <Text style={[styles.details, { color: colors.tabIconDefault }]}>
            {formatDate(recording.date)} • {formatDuration(recording.duration)} • {formatSize(recording.size)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.tabIconDefault}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.playerContainer}>
          <AudioPlayer uri={recording.uri} playbackSpeed={playbackSpeed} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  filename: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    padding: 5,
  },
  playerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
  },
});