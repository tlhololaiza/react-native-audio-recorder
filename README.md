# React Native Audio Recorder 🎙️

A fully-featured voice recording application built with React Native and Expo. Record, manage, and playback audio notes with an intuitive interface and powerful features.

![React Native](https://img.shields.io/badge/React_Native-0.74.5-blue)
![Expo](https://img.shields.io/badge/Expo-~51.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📱 Features

- ✅ **Audio Recording** - High-quality audio recording with real-time duration tracking
- ✅ **Voice Notes Library** - View all recordings with date, time, duration, and file size
- ✅ **Audio Playback** - Built-in player with play/pause, seek controls, and progress tracking
- ✅ **Search Functionality** - Quickly find recordings by filename or date
- ✅ **Delete Recordings** - Remove unwanted recordings with confirmation
- ✅ **Customizable Settings** - Adjust recording quality and playback speed
- ✅ **Offline Support** - Works completely offline with local storage
- ✅ **Dark Mode** - Automatic theme switching based on system preferences
- ✅ **Permissions Handling** - Seamless microphone permission management
- ✅ **User-Friendly UI** - Clean, modern interface with intuitive navigation

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (recommended)

### Installation

1. **Create the Expo project:**
```bash
npx create-expo-app@latest react-native-audio-recorder
cd react-native-audio-recorder
```

2. **Reset the project (clean template):**
```bash
npm run reset-project
# Select 'n' when prompted
```

3. **Install dependencies:**
```bash
npx expo install expo-av expo-file-system @react-native-async-storage/async-storage expo-constants @react-native-community/slider
```

4. **Copy all project files** into their respective locations according to the folder structure below.

5. **Start the development server:**
```bash
npx expo start
```

6. **Run the app:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Scan the QR code with Expo Go app on your physical device


## 🎨 Screens

### 1. Home/Recordings List Screen
- Displays all recorded voice notes
- Search functionality to filter recordings
- Pull-to-refresh to reload recordings
- Tap to expand and play recordings
- Swipe or tap delete icon to remove recordings

### 2. Record Screen
- Large animated record button
- Real-time recording duration display
- Cancel recording option
- Save dialog with custom filename input
- Recording quality indicator

### 3. Settings Screen
- **Recording Quality**: Low, Medium, High
- **Playback Speed**: 0.5×, 0.75×, 1×, 1.25×, 1.5×, 2×
- App information and version
- Save changes button

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Audio**: expo-av
- **Storage**: AsyncStorage
- **File System**: expo-file-system
- **TypeScript**: Full type safety
- **UI Components**: React Native core components + custom components

## 📦 Key Dependencies
```json
{
  "expo": "~51.0.28",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "expo-av": "~14.0.7",
  "expo-file-system": "~17.0.1",
  "@react-native-async-storage/async-storage": "1.23.1",
  "expo-router": "~3.5.23",
  "@react-native-community/slider": "latest"
}
```

## 🎯 Features in Detail

### Recording
- **Quality Options**: Low, Medium, High
- **Real-time Duration**: See recording time in MM:SS format
- **Visual Feedback**: Animated pulsing record button
- **Cancel Option**: Discard recording before saving
- **Custom Filenames**: Name your recordings before saving

### Playback
- **Interactive Player**: Play/pause controls
- **Seek Functionality**: Jump to any position in the recording
- **Progress Bar**: Visual representation of playback progress
- **Duration Display**: Current position and total duration
- **Variable Speed**: 0.5× to 2× playback speed

### Storage
- **Local Persistence**: All recordings stored on device
- **File Metadata**: Filename, date, time, duration, and file size
- **Efficient Management**: Automatic cleanup on deletion
- **Search & Filter**: Find recordings quickly

### User Experience
- **Dark Mode Support**: Automatically adapts to system theme
- **Empty States**: Helpful messages when no recordings exist
- **Loading Indicators**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Prevent accidental deletions

## 🔐 Permissions

The app requires the following permissions:

### iOS
- **Microphone Access**: Required for recording audio
  - Configured in `app.json` under `ios.infoPlist.NSMicrophoneUsageDescription`

### Android
- **RECORD_AUDIO**: Record audio with the microphone
- **WRITE_EXTERNAL_STORAGE**: Save recordings to device storage
- **READ_EXTERNAL_STORAGE**: Access saved recordings

Permissions are automatically requested when the user first attempts to record.

## 🎨 Customization

### Colors
Edit `constants/Colors.ts` to customize the app's color scheme:
```typescript
export default {
  light: {
    text: '#000',
    background: '#fff',
    primary: '#007bff',
    // ... more colors
  },
  dark: {
    text: '#fff',
    background: '#000',
    primary: '#0a84ff',
    // ... more colors
  },
};
```

### Recording Settings
Default settings can be modified in `utils/storage.ts`:
```typescript
return { 
  quality: 'high',        // 'low' | 'medium' | 'high'
  playbackSpeed: 1.0      // 0.5 to 2.0
};
```

## 🐛 Troubleshooting

### Common Issues

**1. Microphone Permission Denied**
- Go to device Settings > App Permissions > Microphone
- Enable permission for the app
- Restart the app

**2. Recording Not Saving**
- Check device storage space
- Ensure app has write permissions
- Try restarting the app

**3. Playback Issues**
- Ensure the recording file exists
- Check device volume settings
- Try reloading the recording

**4. Build Errors**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npx expo install expo@latest`

## 📱 Testing

### On Physical Device (Recommended)
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `npx expo start`
3. Scan the QR code with your device camera
4. App will load in Expo Go

### On Emulator/Simulator
**Android:**
```bash
npx expo start --android
```

**iOS (Mac only):**
```bash
npx expo start --ios
```

## 🚀 Building for Production

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS App
```bash
eas build --platform ios --profile preview
```

**Note**: Requires EAS CLI and account setup:
```bash
npm install -g eas-cli
eas login
eas build:configure
```

## 📝 Assignment Requirements Checklist

This project fulfills all the requirements for Task 3 - React Native Audio Recorder:

- ✅ **Recording Functionality**: Enable users to record audio notes using the device's microphone
- ✅ **List of Voice Notes**: Display a list of recorded voice notes with details such as date and time
- ✅ **Playback Functionality**: Allow users to play back recorded voice notes
- ✅ **Delete Functionality**: Enable users to delete unwanted voice notes
- ✅ **Create New Voice Note**: Provide a button or option to create a new voice note
- ✅ **Storage Management**: Manage storage efficiently to store and retrieve voice notes
- ✅ **User Interface**: Design a user-friendly interface for easy navigation and interaction
- ✅ **Permissions Handling**: Implement permissions handling to access the microphone and storage
- ✅ **Search Functionality**: Implement a search feature to find specific voice notes
- ✅ **Settings (Optional)**: Provide settings to customise recording quality, playback speed, etc.
- ✅ **Offline Functionality**: Allow users to record and access voice notes offline
- ✅ **Feedback and Support**: Provide a way for users to provide feedback and access support if needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎓 Educational Purpose

This project was created as part of a React Native course assignment (Task 3 - Lesson 5). It demonstrates:
- React Native best practices
- Component reusability
- Custom hooks
- TypeScript integration
- Expo Router navigation
- Audio recording/playback
- Local storage management
- Permission handling
- UI/UX design principles

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For excellent documentation and support
- **Icons** - Ionicons by Ionic Framework

---

**Version**: 1.0.0  
**Last Updated**: November 2024

🤖 Android app:
https://expo.dev/artifacts/eas/miHNkctBWaFDDjPcsJj5oX.aab
