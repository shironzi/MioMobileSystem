import React, { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import LanguageAudioUpload from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageAudioUpload";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  audioType: "upload" | "record" | "system";
}

interface InputError {
  name: string | null;
  index: number | null;
}

interface Props {
  item: FillItem;
  distractorErrorInput: { id: string; index: number }[];
  fillItemsLength: number;
  handleRemoveItem: (id: string) => void;
  inputError: InputError | undefined;
  handleTextInput: (id: string, value: string) => void;
  handleAddAudio: (id: string, file: FileInfo) => void;
  handleAudioRecording: (id: string, uri: string | null) => void;
  handleSelectAudioType: (
    type: string,
    value: "upload" | "record" | "system",
  ) => void;
  handleRemoveAudio: (id: string) => void;
  handleAddItem: (id: string) => void;
  handleAddDistractor: (id: string) => void;
  handleDistractorInput: (id: string, index: number, value: string) => void;
  handleRemoveDistractor: (id: string, index: number) => void;
}

const LanguageFillActivity = ({
  item,
  fillItemsLength,
  handleRemoveItem,
  inputError,
  handleTextInput,
  handleAddAudio,
  handleAudioRecording,
  handleSelectAudioType,
  handleRemoveAudio,
  handleAddItem,
  handleAddDistractor,
  distractorErrorInput,
  handleDistractorInput,
  handleRemoveDistractor,
}: Props) => {
  const item_id = parseInt(item.id);
  const [descHeight, setDescHeight] = useState<number>(100);

  return (
    <GestureHandlerRootView>
      <View
        style={[
          styles.itemContainer,
          item_id === 0 && styles.itemTopRounded,
          item_id === fillItemsLength - 1 && styles.itemBottomRounded,
        ]}
      >
        {item_id === 0 && (
          <View style={styles.headerContainer}>
            <Text style={[globalStyles.text1, styles.headerText]}>
              Fill in the Blanks
            </Text>
            <View style={styles.divider} />
          </View>
        )}
        <View style={styles.itemBodyContainer}>
          <View style={[styles.itemHeaderRow]}>
            <Text style={globalStyles.text1}>Sentence</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <AntDesign name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.textInputContainer,
              { height: Math.max(descHeight, 100) },
              item_id === inputError?.index &&
                inputError?.name === "textInput" &&
                styles.errorBorder &&
                styles.errorBorder,
            ]}
            placeholder="Write the sentence (e.g., The sun rises in the east.)"
            multiline={true}
            onContentSizeChange={(e) =>
              setDescHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
            value={item.text}
            onChangeText={(value: string) => handleTextInput(item.id, value)}
          />
        </View>
        <View style={{ marginBottom: 20, rowGap: 7.5 }}>
          {item.distractors.map((value, index) => (
            <View key={index}>
              {index === 0 && (
                <Text style={globalStyles.text1}>Distractors</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={[
                    styles.textInputContainer,
                    { width: "90%" },
                    distractorErrorInput.some(
                      (dist) => dist.id === item.id && dist.index === index,
                    ) && styles.errorBorder,
                  ]}
                  placeholder={"E.g., 'bare' for 'bear'"}
                  value={value}
                  onChangeText={(value) =>
                    handleDistractorInput(item.id, index, value)
                  }
                />
                <TouchableOpacity
                  onPress={() => handleRemoveDistractor(item.id, index)}
                >
                  <AntDesign name="close" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addItemRow}
            onPress={() => handleAddDistractor(item.id)}
          >
            <MaterialIcons name="add" size={24} color="#FFBF18" />
            <Text style={styles.addFileText}>Add distractor</Text>
          </TouchableOpacity>
        </View>
        <LanguageAudioUpload
          item={item}
          isTextEmpty={item.text.trim().length < 1}
          handleAddAudio={(id, file) => handleAddAudio(id, file)}
          inputError={
            inputError?.index === item_id && inputError.name === "audio"
          }
          handleAudioRecording={(id, uri) => handleAudioRecording(id, uri)}
          handleSelectAudioType={(id, value) =>
            handleSelectAudioType(id, value)
          }
          handleRemoveAudio={(id) => handleRemoveAudio(id)}
        />
        <View style={styles.divider} />
        {item_id === fillItemsLength - 1 && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.addItemRow}
              onPress={() => handleAddItem(item.id)}
            >
              <MaterialIcons name="add" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.submitButton}>
              <Text style={globalStyles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  itemTopRounded: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemBottomRounded: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  headerContainer: {
    paddingTop: 10,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  headerText: {
    paddingVertical: 10,
  },
  itemBodyContainer: {
    marginBottom: 15,
    rowGap: 15,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  footerContainer: {
    backgroundColor: "#fff",
    rowGap: 15,
    paddingBottom: 20,
  },
  addItemRow: {
    flexDirection: "row",
  },
});

export default memo(LanguageFillActivity);
