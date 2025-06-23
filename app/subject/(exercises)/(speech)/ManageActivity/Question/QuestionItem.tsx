import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InputError {
  id: string;
  error: string;
}

interface QuestionItem {
  id: string;
  flashcard_id: string | null;
  text: string;
}

interface Props {
  item: QuestionItem;
  index: number;
  firstIndex: string;
  lastIndex: string;
  handleAddItem: (item: QuestionItem) => void;
  handleRemove: (id: string) => void;
  hasError: InputError[];
  handleTextInput: (id: string, value: string) => void;
  handlePreview: () => void;
  activityId: string;
}

const QuestionItem = ({
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

  const router = useRouter();
  const wordError = hasError.some((item) => item.error === "word");
  const textLimit = hasError.some((item) => item.error === "text length");

  return (
    <SafeAreaView style={{ paddingBottom: 50 }}>
      <View
        style={[
          {
            marginHorizontal: 20,
            padding: 20,
            backgroundColor: "#fff",
            rowGap: 10,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 20,
            marginTop: -20,
            marginVertical: -80,
            flex: 1,
            // marginBottom:150
          },
          item.id === firstIndex && styles.itemTopRounded,
          item.id === lastIndex && styles.itemBottomRounded,
        ]}
      >
        {item.id === firstIndex && (
          <View>
            <Text style={[globalStyles.text1, { marginTop: -5 }]}>
              Word Flashcards
            </Text>
            <View
              style={[globalStyles.divider, { marginVertical: 10, width: 350 }]}
            />
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
            <AntDesign name="close" size={24} color="#aaa" />
          </TouchableOpacity>

          {/*<View*/}
          {/*  style={{*/}
          {/*    flexDirection: "row",*/}
          {/*    justifyContent: "center",*/}
          {/*    columnGap: 10,*/}
          {/*  }}*/}
          {/*>*/}
          {/*<TouchableOpacity*/}
          {/*  style={[globalStyles.inactivityButton, { width: "48%" }]}*/}
          {/*  onPress={() => router.back()}*/}
          {/*>*/}
          {/*  <Text style={globalStyles.inactivityButtonText}> Cancel</Text>*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity*/}
          {/*  style={[globalStyles.submitButton, { width: "48%" }]}*/}
          {/*  onPress={handlePreview}*/}
          {/*>*/}
          {/*  <Text style={[globalStyles.submitButtonText, { top: 3 }]}>*/}
          {/*    Preview*/}
          {/*    /!* {activityId ? "Preview" : "Create"} *!/*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}
          {/*</View>*/}
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
              { marginVertical: 5, marginBottom: -5 },
            ]}
            placeholder={"E.g., 'bare' for 'bear'"}
            value={item.text}
            onChangeText={(value) => handleTextInput(item.id, value)}
          />
        </View>
        {item.id === lastIndex && (
          <View
            style={[globalStyles.divider, { marginVertical: 10, width: 350 }]}
          />
        )}
        {item.id === lastIndex && (
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.addItemRow} onPress={handleAdd}>
              <MaterialIcons name="add" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>Add Item</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                columnGap: 10,
              }}
            >
              <TouchableOpacity
                style={[globalStyles.inactivityButton, { width: "48%" }]}
                onPress={() => router.back()}
              >
                <Text style={globalStyles.inactivityButtonText}> Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.submitButton, { width: "48%" }]}
                onPress={handlePreview}
              >
                <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
                  {activityId ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
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

export default memo(QuestionItem);
