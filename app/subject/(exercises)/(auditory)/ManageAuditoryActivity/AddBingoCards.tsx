import ImageUpload from "@/components/ImageUpload";
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

const AddBingoCards = (props: {
  isFirst: boolean;
  index: number;
  handleFileUpload: (file: FileInfo | string) => void;
  handleFileRemove: () => void;
  image: string | FileInfo | null;
  bingoError: {
    errorMessage: string;
    error: string;
  };
}) => {
  const image_error = props.bingoError.error === "images";
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      layout={LinearTransition}
      style={[styles.container, props.isFirst && styles.isFirst]}
    >
      <View style={styles.item}>
        {props.isFirst && (
          <View>
            <Text style={[globalStyles.text1, { marginTop: -5 }]}>
              Piddie Says
            </Text>
            <View
              style={[
                globalStyles.divider,
                { marginVertical: 10, width: 340, left: -10 },
              ]}
            />
          </View>
        )}
        <ImageUpload
          handleFiles={(file: FileInfo | string) =>
            props.handleFileUpload(file)
          }
          image_path={
            (typeof props.image === "object"
              ? props.image?.uri
              : props.image) ?? null
          }
          handleImageRemove={() => props.handleFileRemove()}
          isError={image_error}
          showPreview={
            !!(typeof props.image === "object" ? props.image?.uri : props.image)
          }
          index={props.index}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  isFirst: {
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    padding: 20,
    backgroundColor: "#fff",
    rowGap: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 5,
    flex: 1,
  },
});

export default memo(AddBingoCards);
