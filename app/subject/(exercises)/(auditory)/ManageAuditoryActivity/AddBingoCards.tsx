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
          marginHorizontal:5,
          marginVertical: 5,
        },
        props.isFirst && {
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      ]}
    >
      <View style={{  
          padding: 20,
          backgroundColor: "#fff",
          rowGap: 10,
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 20,
          marginBottom: 5,
          flex: 1,
           }}>
        {props.isFirst && (
          <View>
            <Text style={[globalStyles.text1, {marginTop:-5}]}>
              Piddie Says
            </Text>
            <View style={[globalStyles.divider, { marginVertical: 10, width: 340, left: -10 }]} />

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
    borderColor: "#ddd",
    marginHorizontal: -20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default memo(AddBingoCards);
