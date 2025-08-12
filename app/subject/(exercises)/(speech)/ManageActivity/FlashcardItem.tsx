import ImageUpload from "@/components/ImageUpload";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Flashcard } from "@/app/subject/(exercises)/(speech)/SpeechDataTypes";

interface Props {
  item: Flashcard;
  index: number;
  handleRemove: () => void;
  handleImageUpload: (uri: string) => void;
  handleImageRemove: () => void;
  handleTextInput: (value: string) => void;
  activityType: string;
}

const PictureItem = ({
  item,
  index,
  handleRemove,
  handleImageUpload,
  handleImageRemove,
  handleTextInput,
  activityType,
}: Props) => {
  return (
    <View style={[styles.container, index === 0 && styles.itemTopRounded]}>
      {index === 0 && (
        <View>
          <Text style={globalStyles.text1}>{activityType} Flashcards</Text>
          <View style={[globalStyles.divider]} />
        </View>
      )}
      <View style={globalStyles.alignRowCenter}>
        <Text style={globalStyles.text1}>Flashcard {index + 1}</Text>
        <TouchableOpacity onPress={handleRemove}>
          <AntDesign name="close" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>
      <View style={{ rowGap: 10 }}>
        <View>
          <Text style={globalStyles.text1}>Upload Image</Text>
          {/*{imageError && (*/}
          {/*  <Text style={globalStyles.errorText}>This field is required</Text>*/}
          {/*)}*/}
          <ImageUpload
            handleFiles={(uri: string) => handleImageUpload(uri)}
            handleImageRemove={handleImageRemove}
            image_path={item.image_url}
            // isError={imageError}
            isError={false}
            showPreview={true}
            index={0}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={globalStyles.text1}>Word</Text>
          {/*{wordError ? (*/}
          {/*  <Text style={globalStyles.errorText}>This field is required</Text>*/}
          {/*) : (*/}
          {/*  textLimit && (*/}
          {/*    <Text style={globalStyles.errorText}>*/}
          {/*      This should not exceed 30 characters*/}
          {/*    </Text>*/}
          {/*  )*/}
          {/*)}*/}
          <TextInput
            style={[
              globalStyles.textInputContainer,
              // wordError && styles.errorBorder,
              { marginVertical: 5, marginBottom: -5 },
            ]}
            placeholder={"E.g., 'bare' for 'bear'"}
            value={item.text}
            onChangeText={(value) => handleTextInput(value)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    rowGap: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: -5,
  },
  itemTopRounded: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addItemRow: {
    flexDirection: "row",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
});

export default memo(PictureItem);
