import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  AudioModule,
  AudioQuality,
  IOSOutputFormat,
  RecordingPresets,
  useAudioRecorder,
} from "expo-audio";
import React, { memo, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const Recording = (props: {
  onStop: (file: string | null) => void;
  inputError?: boolean;
}) => {
  RecordingPresets.LOW_QUALITY = {
    extension: ".mp3",
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 64000,
    android: {
      extension: ".3gp",
      outputFormat: "3gp",
      audioEncoder: "amr_nb",
    },
    ios: {
      audioQuality: AudioQuality.MIN,
      outputFormat: IOSOutputFormat.MPEG4AAC,
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

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    const recordingUri = audioRecorder.uri;
    setIsRecording(false);
    props.onStop(recordingUri);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      runOnJS(startRecording)();
    })
    .onEnd(() => {
      runOnJS(stopRecording)();
    });

  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={styles.micContainer}>
        <View
          style={[
            styles.micButton,
            isRecording && styles.recordingButton,
            props.inputError
              ? { borderColor: "red" }
              : { borderColor: "transparent" },
          ]}
        >
          <FontAwesome
            name="microphone"
            size={50}
            color={isRecording ? "#fff" : "black"}
          />
        </View>
        <Text style={styles.instructionText}>
          Press and hold the microphone to start recording. Release to stop.
        </Text>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  micContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
    width: "112%",
    borderColor: "#ffbf18",
    borderRadius: 20,
    left: -15,
    paddingVertical: 10,
    borderWidth: 2.5,
    borderStyle: "dashed",
    marginTop:10
  },
  micButton: {
    width: 80,
    height: 80,
    padding: 3,
    marginTop:10,
    borderRadius: 40,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  recordingText: {
    marginTop: 15,
    color: "#FFBF18",
    fontWeight: "500",
  },
  recordingButton: {
    backgroundColor: "#FFBF18",
  },
  instructionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight:400,
    textAlign: "center",
    color: "#1F1F1F68",
    marginHorizontal: 10,
    fontStyle: "italic",
    marginBottom:10
  },
});

export default memo(Recording);
