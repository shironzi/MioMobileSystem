import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import ImageUpload from "@/components/ImageUpload";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  createPictureSpeechActivity,
  createSpeechActivity,
  getActivityById,
  updatePictureActivity,
  updateSpeechActivity,
} from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AddSpeechActivity = () => {
  useHeaderConfig("Add Speech Activity");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();

  const [activityType, setActivityType] = useState<string>("picture");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");

  const [pictureItems, setPictureItems] = useState<
    {
      flashcard_id: string | null;
      file: FileInfo | null;
      image_path: string | null;
      text: string | null;
      firebase_path: string | null;
    }[]
  >([
    {
      file: null,
      text: null,
      image_path: null,
      flashcard_id: null,
      firebase_path: null,
    },
  ]);

  const [questionItems, setQuestionItems] = useState<
    { flashcard_id: string | null; text: string | null }[]
  >([{ flashcard_id: null, text: null }]);
  const [phraseItems, setPhraseItems] = useState<{ text: string | null }[]>([
    { text: null },
  ]);
  const [pronunciationItems, setPronunciationItems] = useState<
    { text: string | null }[]
  >([{ text: null }]);
  const [activityItemIndex, setActivityItemIndex] = useState<number>(0);
  const [isItemEmpty, setIsItemEmpty] = useState<boolean>(false);
  const [isFileEmpty, setIsFileEmpty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAddFile = () => {
    if (activityType === "picture") {
      if (
        pictureItems[activityItemIndex]?.file === null &&
        pictureItems[activityItemIndex]?.text === null
      ) {
        setIsFileEmpty(true);
        setIsItemEmpty(true);
        return;
      }
      if (pictureItems[activityItemIndex]?.file === null) {
        setIsFileEmpty(true);
        return;
      }

      if (pictureItems[activityItemIndex]?.text === null) {
        setIsItemEmpty(true);
        return;
      }
      setIsFileEmpty(false);
      setIsItemEmpty(false);
      setPictureItems((prev) => [
        ...prev,
        {
          flashcard_id: null,
          file: null,
          text: null,
          image_path: null,
          firebase_path: null,
        },
      ]);
    } else if (activityType === "question") {
      if (questionItems[activityItemIndex]?.text === null) {
        setIsItemEmpty(true);
        return;
      }
      setIsItemEmpty(false);
      setQuestionItems((prev) => [...prev, { flashcard_id: null, text: null }]);
    } else if (activityType === "phrase") {
      if (phraseItems[activityItemIndex]?.text === null) {
        setIsItemEmpty(true);
        return;
      }
      setIsItemEmpty(false);
      setPhraseItems((prev) => [...prev, { text: null }]);
    } else if (activityType === "pronunciation") {
      if (pronunciationItems[activityItemIndex]?.text === null) {
        setIsItemEmpty(true);
        return;
      }
      setIsItemEmpty(false);
      setPronunciationItems((prev) => [...prev, { text: null }]);
    }
    setActivityItemIndex((prev) => prev + 1);
  };

  const handleRemoveItem = (index: number) => {
    if (activityType === "picture") {
      setPictureItems((prev) => prev.filter((_, i) => i !== index));
    } else if (activityType === "question") {
      setQuestionItems((prev) => prev.filter((_, i) => i !== index));
    } else if (activityType === "phrase") {
      setPhraseItems((prev) => prev.filter((_, i) => i !== index));
    } else if (activityType === "pronunciation") {
      setPronunciationItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreateActivity = useCallback(async () => {
    try {
      let res = null;

      const hasEmptyText = (items: any[]) =>
        items.some((item) => !item.text || item.text.trim() === "");

      if (activityId) {
        switch (activity_type) {
          case "picture":
            const isPictureInvalid =
              pictureItems.some(
                (item) =>
                  item.file === null &&
                  (!item.firebase_path || item.firebase_path === "") &&
                  (!item.image_path || item.image_path === "") &&
                  (!item.flashcard_id || item.flashcard_id === ""), // totally new item
              ) || hasEmptyText(pictureItems);

            if (isPictureInvalid) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }

            res = await updatePictureActivity(
              subjectId,
              difficulty,
              activityId,
              pictureItems,
            );
            break;

          case "question":
            if (hasEmptyText(questionItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await updateSpeechActivity(
              subjectId,
              difficulty,
              activityId,
              activity_type,
              questionItems,
            );
            break;

          case "phrase":
            if (hasEmptyText(phraseItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await updateSpeechActivity(
              subjectId,
              difficulty,
              activityId,
              activity_type,
              phraseItems,
            );
            break;

          case "pronunciation":
            if (hasEmptyText(pronunciationItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await updateSpeechActivity(
              subjectId,
              difficulty,
              activityId,
              activity_type,
              pronunciationItems,
            );
            break;

          default:
            Alert.alert("Error", "Unsupported activity type.");
            return;
        }
      } else {
        switch (activityType) {
          case "picture":
            if (
              pictureItems.some(
                (item) =>
                  item.file === null || !item.text || item.text.trim() === "",
              )
            ) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await createPictureSpeechActivity(
              subjectId,
              pictureItems,
              activityType,
              activityDifficulty,
            );
            break;

          case "question":
            if (hasEmptyText(questionItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await createSpeechActivity(
              subjectId,
              activityType,
              activityDifficulty,
              questionItems,
            );
            break;

          case "phrase":
            if (hasEmptyText(phraseItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await createSpeechActivity(
              subjectId,
              activityType,
              activityDifficulty,
              phraseItems,
            );
            break;

          case "pronunciation":
            if (hasEmptyText(pronunciationItems)) {
              Alert.alert(
                "Missing Fields",
                "Please fill out all required fields.",
              );
              return;
            }
            res = await createSpeechActivity(
              subjectId,
              activityType,
              activityDifficulty,
              pronunciationItems,
            );
            break;

          default:
            Alert.alert("Error", "Unsupported activity type.");
            return;
        }
      }

      if (res?.success) {
        Alert.alert(
          "Success",
          activityId
            ? "Successfully updated the activity"
            : "Successfully created the activity",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", res?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Activity creation/update failed:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  }, [
    activityType,
    activity_type,
    pictureItems,
    questionItems,
    phraseItems,
    pronunciationItems,
    activityId,
    difficulty,
    activityDifficulty,
    subjectId,
  ]);

  useEffect(() => {
    if (activityId) {
      const fetchActivity = async () => {
        try {
          const res = await getActivityById(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );

          if (res.success) {
            setActivityType(activity_type);

            if (activity_type === "picture") {
              setPictureItems(res.flashcards);
            } else if (activity_type === "question") {
              setQuestionItems(res.flashcards);
            } else if (activity_type === "phrase") {
              setPhraseItems(res.flashcards);
            } else if (activity_type === "pronunciation") {
              setPronunciationItems(res.flashcards);
            }

            setLoading(false);
          }
        } catch (err) {
          console.error("Failed to fetch activity:", err);
        }
      };

      fetchActivity();
    }
  }, [subjectId, activity_type, difficulty, activityId]);

  if (loading && activityId) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={[globalStyles.container, { rowGap: 12 }]}>
        {!activityId && (
          <View style={globalStyles.cardContainer}>
            <Text>Type of Exercise</Text>
            <Picker
              mode="dropdown"
              selectedValue={activityType}
              onValueChange={(value) => {
                setActivityType(value);
                setIsFileEmpty(false);
                setIsItemEmpty(false);
              }}
            >
              <Picker.Item label="Picture Flashcard" value="picture" />
              <Picker.Item label="Question Flashcard" value="question" />
              <Picker.Item label="Phrase Flashcard" value="phrase" />
              <Picker.Item
                label="Readme: Pronunciation Challenge"
                value="pronunciation"
              />
            </Picker>

            <Text>Difficulty</Text>
            <Picker
              mode="dropdown"
              selectedValue={activityDifficulty}
              onValueChange={setActivityDifficulty}
            >
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Average" value="average" />
              <Picker.Item label="Difficult" value="difficult" />
              <Picker.Item label="Challenge" value="challenge" />
            </Picker>
          </View>
        )}

        <View style={globalStyles.cardContainer}>
          <Text>Exercises</Text>

          {activityType === "picture" &&
            pictureItems.map((_, index) => (
              <View key={index}>
                <View style={styles.cardRow}>
                  <Text
                    style={[
                      globalStyles.text1,
                      isItemEmpty && { color: "red" },
                    ]}
                  >
                    Number {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <Text style={globalStyles.text1}>Upload Image</Text>
                <ImageUpload
                  handleFiles={(file) =>
                    setPictureItems((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              file,
                            }
                          : item,
                      ),
                    )
                  }
                  imageUri={
                    pictureItems[index].file ? pictureItems[index].file : null
                  }
                  handleImageRemove={() => {
                    setPictureItems((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, file: null } : item,
                      ),
                    );
                  }}
                  isError={isFileEmpty}
                  showPreview={true}
                  index={0}
                  image_path={null}
                />
                <Text style={globalStyles.text1}>Word</Text>
                <TextInput
                  style={[
                    styles.inputBox,
                    isItemEmpty
                      ? { borderColor: "red" }
                      : { borderColor: "#82828257" },
                  ]}
                  placeholder="word"
                  value={pictureItems[index].text || ""}
                  onChangeText={(text) =>
                    setPictureItems((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, text: text } : item,
                      ),
                    )
                  }
                />
                <View style={styles.divider} />
              </View>
            ))}

          {activityType === "question" &&
            questionItems.map((_, index) => (
              <View key={index}>
                <View style={styles.cardRow}>
                  <Text
                    style={[
                      globalStyles.text1,
                      isItemEmpty && { color: "red" },
                    ]}
                  >
                    Number {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <Text style={globalStyles.text1}>Word</Text>
                <TextInput
                  style={[
                    styles.inputBox,
                    isItemEmpty
                      ? { borderColor: "red" }
                      : { borderColor: "#82828257" },
                  ]}
                  placeholder="word"
                  value={questionItems[index].text || ""}
                  onChangeText={(text) =>
                    setQuestionItems((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, text: text } : item,
                      ),
                    )
                  }
                />
                <View style={styles.divider} />
              </View>
            ))}

          {activityType === "phrase" &&
            phraseItems.map((_, index) => (
              <View key={index}>
                <View style={styles.cardRow}>
                  <Text
                    style={[
                      globalStyles.text1,
                      isItemEmpty && { color: "red" },
                    ]}
                  >
                    Number {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <Text style={globalStyles.text1}>Word</Text>
                <TextInput
                  style={[
                    styles.inputBox,
                    isItemEmpty
                      ? { borderColor: "red" }
                      : { borderColor: "#82828257" },
                  ]}
                  placeholder="word"
                  value={phraseItems[index].text || ""}
                  onChangeText={(text) =>
                    setPhraseItems((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, text: text } : item,
                      ),
                    )
                  }
                />
                <View style={styles.divider} />
              </View>
            ))}

          {activityType === "pronunciation" &&
            pronunciationItems.map((_, index) => (
              <View key={index}>
                <View style={styles.cardRow}>
                  <Text
                    style={[
                      globalStyles.text1,
                      isItemEmpty && { color: "red" },
                    ]}
                  >
                    Number {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <Text style={globalStyles.text1}>Word</Text>
                <TextInput
                  style={[
                    styles.inputBox,
                    isItemEmpty
                      ? { borderColor: "red" }
                      : { borderColor: "#82828257" },
                  ]}
                  placeholder="word"
                  value={pronunciationItems[index].text || ""}
                  onChangeText={(text) =>
                    setPronunciationItems((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, text: text } : item,
                      ),
                    )
                  }
                />
                <View style={styles.divider} />
              </View>
            ))}

          <TouchableOpacity style={styles.addFileRow} onPress={handleAddFile}>
            <MaterialIcons name="add" size={24} color="#FFBF18" />
            <Text style={styles.addFileText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              {
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: "auto",
                justifyContent: "center",
                columnGap: 15,
              },
            ]}
            onPress={handleCreateActivity}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={globalStyles.submitButtonText}>
              {activityId ? "Update Activity" : "Add Activity"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    borderRadius: 20,
    marginBottom: 15,
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  inputBox: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    height: 45,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -25,
    marginVertical: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default memo(AddSpeechActivity);
