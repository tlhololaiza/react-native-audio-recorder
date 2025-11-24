import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { AudioPlayerState } from '../types';

export const useAudioPlayer = (playbackSpeed: number = 1.0) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    position: 0,
    duration: 0,
  });
  const [currentUri, setCurrentUri] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async (uri: string) => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, rate: playbackSpeed },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentUri(uri);
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlayerState({
        isPlaying: status.isPlaying,
        position: status.positionMillis / 1000,
        duration: status.durationMillis ? status.durationMillis / 1000 : 0,
      });

      if (status.didJustFinish) {
        setPlayerState(prev => ({ ...prev, isPlaying: false, position: 0 }));
      }
    }
  };

  const playPause = async () => {
    try {
      if (!sound) return;

      if (playerState.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Failed to play/pause:', error);
    }
  };

  const stop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
      }
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  };

  const seek = async (position: number) => {
    try {
      if (sound) {
        await sound.setPositionAsync(position * 1000);
      }
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (sound) {
        await sound.setRateAsync(rate, true);
      }
    } catch (error) {
      console.error('Failed to set playback rate:', error);
    }
  };

  return {
    playerState,
    currentUri,
    loadAudio,
    playPause,
    stop,
    seek,
    setPlaybackRate,
  };
};