import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";
import globalStyles from "@/styles/globalStyles";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  filename: string | null;
  audio_path: string | FileInfo | null;
}

const AddMatchingAudio = ({
  isFirst,
  handleFileUpload,
  handleFileRemove,
  filename,
  audio_path,
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
          <View>
            <Text style={[globalStyles.text1, { paddingVertical: 10 }]}>
              Audio
            </Text>
          </View>
        )}
        <AudioUpload
          handleFiles={handleFileUpload}
          handleAudioRemove={handleFileRemove}
          isError={false}
          filename={filename}
          audio_path={audio_path}
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

export default memo(AddMatchingAudio);
