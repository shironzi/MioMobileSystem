import HomonymPreviewCard from "@/app/subject/(exercises)/(language)/ManageActivity/Homonyms/HomonymPreviewCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { createHomonym, editHomonyms } from "@/utils/language";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const { data, subjectId, difficulty, activityId, title } =
    useLocalSearchParams<{
      data: string;
      subjectId: string;
      difficulty: string;
      activityId: string;
      title: string;
    }>();
  const items: HomonymItem[] = JSON.parse(data);
  const [answers, setAnswers] = useState<{ id: string; answer: string[] }[]>(
    [],
  );

  const handleAnswer = (answer: string, index: number, id: string) => {
    setAnswers((prev) => {
      const existing = prev.find((ans) => ans.id === id);

      if (existing) {
        return prev.map((ans) => {
          if (ans.id === id) {
            const updatedAnswers = [...ans.answer];
            updatedAnswers[index] = answer;
            return { ...ans, answer: updatedAnswers };
          }
          return ans;
        });
      } else {
        const newAnswers = Array(index + 1).fill("");
        newAnswers[index] = answer;
        return [...prev, { id, answer: newAnswers }];
      }
    });
  };

  const handleCreate = async () => {
    try {
      console.log(items);
      const res = activityId
        ? await editHomonyms(items, difficulty, subjectId, activityId, title)
        : await createHomonym(items, difficulty, subjectId, title);

      console.log(res);

      if (res.success) {
        Alert.alert(
          "Success",
          activityId
            ? "Successfully updated the activity"
            : "Successfully created the activity",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  const [currentCard, setCurrentCard] = useState(0);

  const handleNext = () => {
    if (currentCard >= items.length - 1) return;

    setCurrentCard(currentCard + 1);
  };

  const handlePrev = () => {
    if (currentCard <= 0) return;

    setCurrentCard(currentCard - 1);
  };

  console.log(items[currentCard]);

  return (
    <View style={globalStyles.container}>
      <View style={[styles.questionsContainer, { height: "85%" }]}>
        <HomonymPreviewCard
          activity={items[currentCard]}
          emptyInput={false}
          handleAnswer={(answer, index) =>
            handleAnswer(answer, index, items[currentCard].id)
          }
          answers={answers}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 150,
          }}
        >
          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              currentCard === 0 && {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#FFBF18",
              },
            ]}
            disabled={currentCard === 0}
            onPress={handlePrev}
          >
            <Text
              style={[
                globalStyles.submitButtonText,
                currentCard === 0 && { color: "#FFBF18" },
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              currentCard >= items.length - 1 && {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#FFBF18",
              },
            ]}
            onPress={handleNext}
            disabled={currentCard >= items.length - 1}
          >
            <Text
              style={[
                globalStyles.submitButtonText,
                currentCard >= items.length - 1 && { color: "#FFBF18" },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={[globalStyles.inactivityButton, { width: "48%" }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleCreate}
        >
          <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
            Create
            {/* {activityId ? "Update" : "Create"} */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  questionsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    borderRadius: 50,
    padding: 15,
  },
  activeButton: {
    backgroundColor: "#FFBF18",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Homonyms;
