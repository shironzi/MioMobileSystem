import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface AddBingoAudioProps {
  isFirst: boolean;
  handleFileUpload: (file: FileInfo) => void;
  handleFileRemove: () => void;
  audio_path: string | FileInfo | null;
  filename: string | null;
}

const AddBingoAudio = ({
  isFirst,
  handleFileUpload,
  handleFileRemove,
  audio_path,
  filename,
}: AddBingoAudioProps) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      layout={LinearTransition}
      style={styles.container}
    >
      <View style={{ paddingHorizontal: 20 }}>
        {isFirst && (
          <View style={{ marginVertical: 5 }}>
            {/* <Text style={[globalStyles.text1, {paddingVertical:5, left:-10}]}>
              Audio
            </Text> */}
            {/* <View style={styles.divider} /> */}
          </View>
        )}
        <AudioUpload
          handleFiles={handleFileUpload}
          handleAudioRemove={handleFileRemove}
          audio_path={audio_path}
          filename={filename}
          isError={false}
        />
        {audio_path && (
          <EditPlayer
            uri={typeof audio_path === "object" ? audio_path?.uri : audio_path}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
});

export default memo(AddBingoAudio);
