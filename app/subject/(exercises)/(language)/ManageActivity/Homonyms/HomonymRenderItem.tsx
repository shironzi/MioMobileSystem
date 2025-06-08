import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomonymItem from "@/app/subject/(exercises)/(language)/ManageActivity/Homonyms/HomonymItem";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  filename: string[];
  audioType: ("upload" | "record")[];
}

interface InputError {
  id: string | null;
  index: number[];
  error: string | null;
}

interface Props {
  item: HomonymItem;
  firstIndex: string;
  lastIndex: string;
  inputError: InputError[];
  answerErrorInput: InputError[];
  audioErrorInput: InputError[];
  distractorErrorInput: { id: string | null; index: number | null }[];
  handleRemoveItem: (id: string) => void;
  handleTextInput: (id: string, value: string, index: number) => void;
  handleAnswerInput: (id: string, value: string, index: number) => void;
  handleDistractorInput: (id: string, index: number, value: string) => void;
  handleSelectAudioType: (
    id: string,
    value: "upload" | "record",
    index: number,
  ) => void;
  handleAudioRecording: (id: string, uri: string | null, index: number) => void;
  handleAddAudio: (id: string, file: FileInfo, index: number) => void;
  handleRemoveAudio: (id: string, index: number) => void;
  handleRemoveDistractor: (id: string, index: number) => void;
  handleAddDistractor: (id: string) => void;
  handleAddItem: () => void;
  handleSubmit: () => void;
}

const HomonymRenderItem = ({
  item,
  firstIndex,
  lastIndex,
  handleRemoveItem,
  inputError,
  handleTextInput,
  handleAnswerInput,
  handleAddAudio,
  handleDistractorInput,
  handleAudioRecording,
  handleSelectAudioType,
  handleRemoveAudio,
  distractorErrorInput,
  handleRemoveDistractor,
  handleAddDistractor,
  handleAddItem,
  audioErrorInput,
  answerErrorInput,
  handleSubmit,
}: Props) => {
  const item_id = parseInt(item.id);

  const getFieldErrorMessage = (
    errors: InputError[],
    index: number,
  ): string | null => {
    const match = errors.find(
      (e) => e.id === item.id && e.index.includes(index),
    );
    return match?.error ?? null;
  };

  return (
    <GestureHandlerRootView>
      <View
        style={[
          styles.itemContainer,
          item.id === firstIndex && styles.itemTopRounded,
          item.id === lastIndex && styles.itemBottomRounded,
        ]}
      >
        {item_id === 0 && (
          <View style={styles.headerContainer}>
            <Text style={[globalStyles.text1, styles.headerText]}>
              Homonyms
            </Text>
            <View style={styles.divider} />
          </View>
        )}

        <View style={styles.itemBodyContainer}>
          <View style={[styles.itemHeaderRow]}>
            <Text style={globalStyles.text1}>Homonym Item</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <AntDesign name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            <HomonymItem
              item={item}
              inputErrorMessage={getFieldErrorMessage(inputError, 0)}
              audioErrorMessage={getFieldErrorMessage(audioErrorInput, 0)}
              answerErrorMessage={getFieldErrorMessage(answerErrorInput, 0)}
              item_index={0}
              handleTextInput={handleTextInput}
              handleAnswerInput={handleAnswerInput}
              handleAddAudio={handleAddAudio}
              handleAudioRecording={handleAudioRecording}
              handleSelectAudioType={handleSelectAudioType}
              handleRemoveAudio={handleRemoveAudio}
            />

            <HomonymItem
              item={item}
              inputErrorMessage={getFieldErrorMessage(inputError, 1)}
              audioErrorMessage={getFieldErrorMessage(audioErrorInput, 1)}
              answerErrorMessage={getFieldErrorMessage(answerErrorInput, 1)}
              item_index={1}
              handleTextInput={handleTextInput}
              handleAnswerInput={handleAnswerInput}
              handleAddAudio={handleAddAudio}
              handleAudioRecording={handleAudioRecording}
              handleSelectAudioType={handleSelectAudioType}
              handleRemoveAudio={handleRemoveAudio}
            />
          </View>
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
                      (e) => e.index === index && e.id === item.id,
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
        <View style={styles.divider} />

        {item.id === lastIndex && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.addItemRow}
              onPress={() => handleAddItem()}
            >
              <MaterialIcons name="add" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.submitButton}
              onPress={handleSubmit}
            >
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
    marginTop: 20,
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
  errorBorder: {
    borderColor: "red",
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default memo(HomonymRenderItem);
