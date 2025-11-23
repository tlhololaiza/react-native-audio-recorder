import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Colors from '../constants/Colors';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlayerProps {
  uri: string;
  playbackSpeed?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, playbackSpeed = 1.0 }) => {
  const { playerState, currentUri, loadAudio, playPause, seek } = useAudioPlayer(playbackSpeed);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (uri !== currentUri) {
      loadAudio(uri);
    }
  }, [uri]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {formatTime(playerState.position)}
        </Text>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {formatTime(playerState.duration)}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        value={playerState.position}
        minimumValue={0}
        maximumValue={playerState.duration || 1}
        onSlidingComplete={seek}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.tabIconDefault}
        thumbTintColor={colors.primary}
      />

      <TouchableOpacity onPress={playPause} style={styles.playButton}>
        <Ionicons
          name={playerState.isPlaying ? 'pause' : 'play'}
          size={32}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
});