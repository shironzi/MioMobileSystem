import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";
import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface AddBingoAudioProps {
  isFirst: boolean;
  handleFileUpload: (file: FileInfo) => void;
  handleFileRemove: () => void;
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
}

const AddMatchingAudio = ({
  isFirst,
  handleFileUpload,
  handleFileRemove,
  audio,
  filename,
  audio_path,
}: AddBingoAudioProps) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      layout={LinearTransition}
      style={[
        {
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          marginHorizontal: 20,
        },
      ]}
    >
      <View style={{ paddingHorizontal: 20 }}>
        {isFirst && (
          <View>
            <Text style={[globalStyles.text1, { paddingVertical: 10 }]}>
              Card Audio
            </Text>
            <View style={styles.divider} />
          </View>
        )}
        <AudioUpload
          handleFiles={handleFileUpload}
          handleAudioRemove={handleFileRemove}
          audioUri={audio ?? null}
          isError={false}
          filename={filename}
          audio_path={audio_path}
        />
        {(audio_path || audio?.uri) && (
          <EditPlayer uri={(audio?.uri ?? audio_path)!} />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -20,
  },
});

export default memo(AddMatchingAudio);
