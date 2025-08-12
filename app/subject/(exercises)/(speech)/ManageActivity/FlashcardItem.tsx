import ImageUpload from "@/components/ImageUpload";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
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
  lastItem: boolean;
  activityType: string;
  handleRemove: () => void;
  handleAdd: () => void;
  handleImageUpload: (uri: string) => void;
  handleImageRemove: () => void;
  handleTextInput: (value: string) => void;
}

const FlashcardItem = ({
  item,
  index,
  lastItem,
  activityType,
  handleRemove,
  handleAdd,
  handleImageUpload,
  handleImageRemove,
  handleTextInput,
}: Props) => {
  return (
    <View>
      <View style={[globalStyles.cardContainer1, { marginBottom: 0 }]}>
        <View style={globalStyles.alignRowCenter}>
          <Text style={globalStyles.text1}>Flashcard {index + 1}</Text>
          <TouchableOpacity onPress={handleRemove}>
            <AntDesign name="close" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.divider}></View>
        <View style={{ rowGap: 10 }}>
          {activityType === "picture" && (
            <View>
              {/*{imageError && (*/}
              {/*  <Text style={globalStyles.errorText}>This field is required</Text>*/}
              {/*)}*/}
              <ImageUpload
                handleFiles={(uri: string) => handleImageUpload(uri)}
                handleImageRemove={handleImageRemove}
                image_path={item.image_url}
                isError={false}
                showPreview={true}
                index={0}
              />
            </View>
          )}
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
      {lastItem && (
        <TouchableOpacity style={styles.addContainer} onPress={handleAdd}>
          <AntDesign name="plus" size={24} color="#FFBF189E" />
          <Text style={globalStyles.text2Yellow}>Add Flashcard</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addContainer: {
    flexDirection: "row",
    columnGap: 5,
    justifyContent: "center",
    margin: "auto",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
});

export default FlashcardItem;
