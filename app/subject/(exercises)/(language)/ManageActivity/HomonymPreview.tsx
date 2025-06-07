import HeaderConfig from "@/utils/HeaderConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import HomonymPreviewCard from "@/app/subject/(exercises)/(language)/ManageActivity/HomonymPreviewCard";
import { createHomonym } from "@/utils/language";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

const Homonyms = () => {
  HeaderConfig("Homonyms");

  const { data, subjectId, difficulty } = useLocalSearchParams<{
    data: string;
    subjectId: string;
    difficulty: string;
  }>();
  const items: HomonymItem[] = JSON.parse(decodeURIComponent(data as string));
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

  const handeCreate = async () => {
    try {
      const res = await createHomonym(items, difficulty, subjectId);

      if (res.success) {
        Alert.alert(
          "Success",
          "Successfully created the activity",
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
      console.error("Submission error:", err);
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={[styles.questionsContainer, { height: "90%" }]}>
        {items.map((item, index) => (
          <HomonymPreviewCard
            key={index}
            activity={item}
            emptyInput={false}
            handleAnswer={(answer, index) =>
              handleAnswer(answer, index, item.id)
            }
            answers={answers}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[globalStyles.submitButton, { justifyContent: "flex-end" }]}
        onPress={handeCreate}
      >
        <Text style={globalStyles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
    height: "70%",
    justifyContent: "space-between",
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
