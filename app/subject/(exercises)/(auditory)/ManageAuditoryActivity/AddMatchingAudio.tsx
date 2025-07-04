import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";
import globalStyles from "@/styles/globalStyles";
import React, { memo } from "react";
import { Text, View } from "react-native";
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
              Audio
            </Text>
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


export default memo(AddMatchingAudio);
