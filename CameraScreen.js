import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text, Platform, PermissionsAndroid, Dimensions, StyleSheet } from 'react-native';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const folderId = '1J-JJDnEELCjMv3vQKTZ5cDcbGMN9xLqz';

  const requestCameraPermission = async () => {
    console.log('Platform.OS', Platform.OS);
    if (Platform.OS === 'android') {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();

        if (cameraStatus === 'granted' && audioStatus === 'granted') {
          console.log('Camera and Audio permissions granted');
        } else {
          console.log('Camera or Audio permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const uploadToDrive = async (videoUri, folderId) => {
    const apiUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=media&supportsAllDrives=true&parents=${folderId}`;
    const formData = new FormData();
    formData.append('file', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'video/mp4',
        },
        body: formData,
      });
      const data = await response.json();
      console.log('File uploaded:', data);
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect - requesting camera permission');
    requestCameraPermission();
  }, []);

  const startRecording = async () => {
    console.log('Start recording function called');
    if (cameraRef.current) {
        try {
            const options = { quality: Camera.Constants.VideoQuality['720p'] };
            const data = await cameraRef.current.recordAsync(options);
            console.log(data);
            setVideoUri(data.uri);
        } catch (error) {
            console.error('Error recording:', error);
        }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);

      // upload
      try {
        if (videoUri) {
          await uploadToDrive(videoUri, folderId);
          console.log('Video uploaded to Google Drive');
        } else {
          console.log('Video URI is null or undefined');
        }
      } catch (error) {
        console.error('Error uploading video to Google Drive:', error);
      }
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={Camera.Constants.FlashMode.auto}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>test</Text>
        <TouchableOpacity onPress={toggleRecording}>
          <Text style={styles.recordButton}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  recordButton: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});

export default CameraScreen;
