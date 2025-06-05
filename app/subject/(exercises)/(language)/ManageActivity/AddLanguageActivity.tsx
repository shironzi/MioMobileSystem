import React, { memo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import LanguageHeader from "@/app/subject/(exercises)/(language)/ManageActivity/LanguageHeader";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AudioUpload from "@/components/trainingActivities/AudioUpload";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AddLanguageActivity = () => {
  useHeaderConfig("Add Language Activity");

  const [activityType, setActivityType] = useState<string>("fill");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");
  const [fillItems, setFillItems] = useState<{ id: string; text: string }[]>([
    { id: "0", text: "" },
  ]);
  const [descHeight, setDescHeight] = useState<number>(200);
  const [inputError, setInputError] = useState<number | null>();

  const handleAddItem = (index: number) => {
    setFillItems((prev) => {
      if (prev[index]?.text.trim().length > 1) {
        const newId = String(prev.length);
        setInputError(null);
        return [...prev, { id: newId, text: "" }];
      }
      setInputError(index);
      return prev;
    });
  };

  const handleRemoveItem = (index: number) => {
    setFillItems((prev) => prev.filter((_, i) => i !== index));
  };

  const renderItem = (id: string) => {
    const item_id = parseInt(id);

    return (
      <View
        style={[
          styles.itemContainer,
          item_id === 0 && styles.itemTopRounded,
          item_id === fillItems.length - 1 && styles.itemBottomRounded,
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
          <View style={styles.itemHeaderRow}>
            <Text style={globalStyles.text1}>Number {item_id + 1}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item_id)}>
              <AntDesign name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.textInputContainer,
              { height: Math.max(descHeight, 100) },
              item_id === inputError && styles.errorBorder,
            ]}
            placeholder="Write the sentence with a blank (e.g., The sun rises in the east.)"
            multiline={true}
            onContentSizeChange={(e) =>
              setDescHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
            value={fillItems[item_id].text}
            onChangeText={(value: string) => {
              setFillItems((prev) => {
                const updated = [...prev];
                updated[item_id] = { ...updated[item_id], text: value };
                return updated;
              });
            }}
          />
          <View style={styles.audioRow}>
            <View style={styles.audioHalfWidth}>
              <AudioUpload
                handleFiles={function (file: FileInfo): void {
                  throw new Error("Function not implemented.");
                }}
                handleAudioRemove={function (): void {
                  throw new Error("Function not implemented.");
                }}
                audioUri={null}
                isError={false}
                filename={null}
                audio_path={null}
              />
            </View>
            <View style={[styles.audioHalfWidth, styles.centered]}>
              <TouchableOpacity style={styles.recordButton}>
                <FontAwesome name="microphone" size={24} color={"#ffbf18"} />
                <Text style={styles.recordText}>
                  Record audio for this item
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
        </View>
        {item_id === fillItems.length - 1 && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.addItemRow}
              onPress={() => handleAddItem(item_id)}
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
    );
  };

  return (
    <FlatList
      data={fillItems}
      ListHeaderComponent={() => (
        <LanguageHeader
          activityType={activityType}
          setActivityType={(value: string) => setActivityType(value)}
          activityDifficulty={activityDifficulty}
          setActivityDifficulty={(value: string) =>
            setActivityDifficulty(value)
          }
        />
      )}
      renderItem={({ item }) => renderItem(item.id)}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
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
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  audioHalfWidth: {
    width: "45%",
  },
  centered: {
    alignItems: "center",
  },
  recordButton: {
    flexDirection: "column",
    alignItems: "center",
    rowGap: 10,
    borderWidth: 2.5,
    borderStyle: "dashed",
    padding: 15,
    width: "100%",
    borderRadius: 20,
    borderColor: "#ffbf18",
    height: 120,
  },
  recordText: {
    color: "#1F1F1F68",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 28,
    textAlign: "center",
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

export default memo(AddLanguageActivity);
