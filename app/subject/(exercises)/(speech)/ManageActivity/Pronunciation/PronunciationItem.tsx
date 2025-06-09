import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";

interface InputError {
  id: string;
  error: string;
}

interface PronunciationItem {
  id: string;
  flashcard_id: string | null;
  text: string;
}

interface Props {
  item: PronunciationItem;
  index: number;
  firstIndex: string;
  lastIndex: string;
  handleAddItem: (item: PronunciationItem) => void;
  handleRemove: (id: string) => void;
  hasError: InputError[];
  handleTextInput: (id: string, value: string) => void;
  handlePreview: () => void;
  activityId: string;
}

const PronunciationItem = ({
  item,
  index,
  firstIndex,
  lastIndex,
  handleAddItem,
  handleRemove,
  hasError,
  handleTextInput,
  handlePreview,
  activityId,
}: Props) => {
  const handleAdd = () => {
    handleAddItem({
      id: (parseInt(lastIndex) + 1).toString(),
      flashcard_id: null,
      text: "",
    });
  };

  const wordError = hasError.some((item) => item.error === "word");
  const textLimit = hasError.some((item) => item.error === "text length");

  return (
    <View
      style={[
        {
          marginHorizontal: 20,
          padding: 20,
          backgroundColor: "#fff",
          rowGap: 10,
        },
        item.id === firstIndex && styles.itemTopRounded,
        item.id === lastIndex && styles.itemBottomRounded,
      ]}
    >
      {item.id === firstIndex && (
        <View>
          <Text style={globalStyles.text1}>
            Readme: Pronunciation Flashcards
          </Text>
          <View style={[globalStyles.divider]} />
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={globalStyles.text1}>Number {index + 1}</Text>
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <AntDesign name="close" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={globalStyles.text1}>Word</Text>
        {wordError ? (
          <Text style={globalStyles.errorText}>This field is required</Text>
        ) : (
          textLimit && (
            <Text style={globalStyles.errorText}>
              This should not exceed 30 characters
            </Text>
          )
        )}
        <TextInput
          style={[
            globalStyles.textInputContainer,
            wordError && styles.errorBorder,
          ]}
          placeholder={"E.g., 'bare' for 'bear'"}
          value={item.text}
          onChangeText={(value) => handleTextInput(item.id, value)}
        />
      </View>
      <View style={[globalStyles.divider]} />

      {item.id === lastIndex && (
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.addItemRow} onPress={handleAdd}>
            <MaterialIcons name="add" size={24} color="#FFBF18" />
            <Text style={styles.addFileText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handlePreview}
          >
            <Text style={globalStyles.submitButtonText}>
              {activityId ? "Update" : "Create"} Activity
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemTopRounded: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemBottomRounded: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  footerContainer: {
    backgroundColor: "#fff",
    rowGap: 15,
  },
  addItemRow: {
    flexDirection: "row",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
});

export default memo(PronunciationItem);
