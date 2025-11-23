export interface Recording {
  id: string;
  uri: string;
  filename: string;
  duration: number;
  date: number;
  size?: number;
}

export interface RecordingSettings {
  quality: 'low' | 'medium' | 'high';
  playbackSpeed: number;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
}