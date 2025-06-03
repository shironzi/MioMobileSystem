import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageUpload from "@/components/ImageUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AddMatchingCards = (props: {
  isFirst: boolean;
  index: number;
  handleFileUpload: (file: FileInfo) => void;
  handleFileRemove: () => void;
  image: FileInfo | null;
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
              Card Images
            </Text>
            <View style={styles.divider} />
          </View>
        )}
        <ImageUpload
          handleFiles={(file: FileInfo) => props.handleFileUpload(file)}
          imageUri={props.image}
          handleImageRemove={() => props.handleFileRemove()}
          isError={false}
          showPreview={false}
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
});

export default memo(AddMatchingCards);
