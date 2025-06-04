import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";
import AudioUpload from "@/components/trainingActivities/AudioUpload";

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
  audio_path: string | null;
  filename: string | null;
}

const AddBingoAudio = ({
  isFirst,
  handleFileUpload,
  handleFileRemove,
  audio,
  audio_path,
  filename,
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
              Audio
            </Text>
            <View style={styles.divider} />
          </View>
        )}
        <AudioUpload
          handleFiles={handleFileUpload}
          handleAudioRemove={handleFileRemove}
          audioUri={audio ?? null}
          audio_path={audio_path}
          filename={filename}
          isError={false}
        />
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

export default memo(AddBingoAudio);
