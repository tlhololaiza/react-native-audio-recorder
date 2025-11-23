import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { RecordingItem } from '../../components/RecordingItem';
import { SearchBar } from '../../components/SearchBar';
import Colors from '../../constants/Colors';
import { useRecordings } from '../../hooks/useRecordings';
import { RecordingSettings } from '../../types';
import { loadSettings } from '../../utils/storage';

export default function HomeScreen() {
  const {
    recordings,
    loading,
    deleteRecording,
    searchRecordings,
    refreshRecordings,
  } = useRecordings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState<RecordingSettings>({
    quality: 'high',
    playbackSpeed: 1.0,
  });
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    const userSettings = await loadSettings();
    setSettings(userSettings);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRecordings();
    await loadUserSettings();
    setRefreshing(false);
  };

  const filteredRecordings = searchQuery
    ? searchRecordings(searchQuery)
    : recordings;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name or date..."
      />

      {filteredRecordings.length === 0 ? (
        <EmptyState
          icon={searchQuery ? 'search-outline' : 'mic-outline'}
          title={searchQuery ? 'No Results Found' : 'No Recordings Yet'}
          message={
            searchQuery
              ? 'Try adjusting your search terms'
              : 'Tap the Record tab to create your first voice note'
          }
        />
      ) : (
        <FlatList
          data={filteredRecordings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecordingItem
              recording={item}
              onDelete={deleteRecording}
              playbackSpeed={settings.playbackSpeed}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
});