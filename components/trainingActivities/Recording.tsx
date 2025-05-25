import React, { memo, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  IOSOutputFormat,
  AudioQuality,
} from "expo-audio";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Recording = (props: {
  onStart: () => void;
  onStop: (uri: string | null) => void;
}) => {
  RecordingPresets.HIGH_QUALITY = {
    extension: ".wav",
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    android: {
      outputFormat: "mpeg4",
      audioEncoder: "aac",
    },
    ios: {
      outputFormat: IOSOutputFormat.MPEG4AAC,
      audioQuality: AudioQuality.MAX,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    },
  };

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  // const timerRef = useRef<number | null>(null);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);

    // timerRef.current = setTimeout(() => {
    //   setIsRecording(false);
    // }, 8000);
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    const recordingUri = audioRecorder.uri;
    console.log(audioRecorder.getStatus());
    props.onStop(recordingUri);
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();

    // return () => {
    //   if (timerRef.current) clearTimeout(timerRef.current);
    // };
  }, []);

  return (
    <View style={styles.micContainer}>
      <TouchableOpacity
        style={[styles.micButton, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : record}
      >
        <FontAwesome
          name="microphone"
          size={50}
          color={isRecording ? "#fff" : "black"}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.recordingText,
          isRecording ? { opacity: 100 } : { opacity: 0 },
        ]}
      >
        Listening...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  micContainer: {
    alignItems: "center",
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingText: {
    marginTop: 15,
    color: "#FFBF18",
    fontWeight: "500",
  },
  recordingButton: {
    backgroundColor: "#FFBF18",
  },
});

export default memo(Recording);
