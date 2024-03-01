import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text, Platform, PermissionsAndroid, Dimensions, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';


const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

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

  const shareVideo = async (videoUri) => {
    try {
      const result = await Sharing.shareAsync(videoUri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Share this video',
        UTI: 'public.mpeg-4',
      });
  
      if (result.action === Sharing.sharedAction) {
        console.log('Video shared successfully');
      } else {
        console.log('Sharing canceled or failed');
      }
    } catch (error) {
      console.error('Error sharing video:', error.message);
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
  
      // Share the recorded video
      try {
        if (videoUri) {
          const shared = await Sharing.shareAsync(videoUri, {
            mimeType: 'video/mp4',
            dialogTitle: 'Share this video',
          });
      
          console.log('Shared result:', shared);
      
          if (shared) {
            console.log('Video shared successfully');
          } else {
            console.log('Sharing was cancelled or failed');
          }
        } else {
          console.log('Video URI is null or undefined');
        }
      } catch (error) {
        console.error('Error sharing video:', error.message);
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
    aspectRatio: 16 / 9, // Set the aspect ratio to match your camera's preview aspect ratio
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
