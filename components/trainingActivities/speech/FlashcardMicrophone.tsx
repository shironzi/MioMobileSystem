import React, { memo, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  IOSOutputFormat,
  AudioQuality,
} from "expo-audio";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const FlashcardMicrophone = (props: {
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
            size={32}
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
    flexDirection: "row",
    rowGap: 5,
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "#00000024",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  recordingText: {
    color: "#FFBF18",
    fontWeight: "500",
  },
  recordingButton: {
    backgroundColor: "#FFBF18",
  },
  instructionText: {
    paddingHorizontal: 20,
    fontSize: 12,
    lineHeight: 20,
    color: "#282727",
    fontWeight: 400,
    textAlign: "center",
    width: "80%",
  },
});

export default memo(FlashcardMicrophone);
