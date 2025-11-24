import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export const requestAudioPermissions = async (): Promise<boolean> => {
  try {
    const permission = await Audio.requestPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Audio recording permission is required to use this feature. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to get audio permissions:', error);
    return false;
  }
};

export const checkAudioPermissions = async (): Promise<boolean> => {
  try {
    const permission = await Audio.getPermissionsAsync();
    return permission.status === 'granted';
  } catch (error) {
    console.error('Failed to check audio permissions:', error);
    return false;
  }
};