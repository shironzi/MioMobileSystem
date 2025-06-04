import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";
import ImageUpload from "@/components/ImageUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AddBingoCards = (props: {
  isFirst: boolean;
  index: number;
  handleFileUpload: (file: FileInfo) => void;
  handleFileRemove: () => void;
  image: FileInfo | null;
  image_path: string | null;
}) => {
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
        props.isFirst && {
          paddingTop: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      ]}
    >
      <View style={{ paddingHorizontal: 20 }}>
        {props.isFirst && (
          <View>
            <Text style={[globalStyles.text1, { paddingVertical: 10 }]}>
              Images
            </Text>
            <View style={styles.divider} />
          </View>
        )}
        <ImageUpload
          handleFiles={(file: FileInfo) => props.handleFileUpload(file)}
          imageUri={props.image}
          image_path={props.image_path}
          handleImageRemove={() => props.handleFileRemove()}
          isError={false}
          showPreview={!!props.image_path}
          index={props.index}
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default memo(AddBingoCards);
