import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import { Recording } from '../types';
import { loadRecordings, saveRecordings } from '../utils/storage';

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllRecordings();
  }, []);

  const loadAllRecordings = async () => {
    try {
      setLoading(true);
      const savedRecordings = await loadRecordings();
      setRecordings(savedRecordings.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecording = useCallback(async (recording: Recording) => {
    try {
      const updatedRecordings = [recording, ...recordings];
      setRecordings(updatedRecordings);
      await saveRecordings(updatedRecordings);
    } catch (error) {
      console.error('Failed to add recording:', error);
      throw error;
    }
  }, [recordings]);

  const deleteRecording = useCallback(async (id: string) => {
    try {
      const recording = recordings.find(r => r.id === id);
      if (recording) {
        // Delete the file from file system
        const fileInfo = await FileSystem.getInfoAsync(recording.uri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(recording.uri);
        }
      }

      const updatedRecordings = recordings.filter(r => r.id !== id);
      setRecordings(updatedRecordings);
      await saveRecordings(updatedRecordings);
    } catch (error) {
      console.error('Failed to delete recording:', error);
      throw error;
    }
  }, [recordings]);

  const searchRecordings = useCallback((query: string): Recording[] => {
    if (!query.trim()) return recordings;
    
    const lowerQuery = query.toLowerCase();
    return recordings.filter(recording => 
      recording.filename.toLowerCase().includes(lowerQuery) ||
      new Date(recording.date).toLocaleDateString().includes(lowerQuery)
    );
  }, [recordings]);

  return {
    recordings,
    loading,
    addRecording,
    deleteRecording,
    searchRecordings,
    refreshRecordings: loadAllRecordings,
  };
};