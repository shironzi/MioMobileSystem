import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";
import React, { memo } from "react";
import { View } from "react-native";
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
  audio: FileInfo | null;
  audio_path: string;
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
          <View style={{marginVertical:5}}>
            {/* <Text style={[globalStyles.text1, {paddingVertical:5, left:-10}]}>
              Audio
            </Text> */}
            {/* <View style={styles.divider} /> */}
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
        {(audio_path || audio?.uri) && (
          <EditPlayer uri={(audio?.uri ?? audio_path)!} />
        )}
      </View>
    </Animated.View>
  );
};


export default memo(AddBingoAudio);
