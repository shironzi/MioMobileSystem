import React from "react";
import { View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import SpeechScores from "@/app/subject/(sub-details)/Scores/SpeechScores";
import { useLocalSearchParams } from "expo-router";

const Scores = () => {
  useHeaderConfig("Scores");

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  return (
    <View>
      <SpeechScores
        subjectId={subjectId}
        difficulty={"easy"}
        placeholder={"Picture Flashcards"}
        activityType={"picture"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"average"}
        placeholder={"Picture Flashcards"}
        activityType={"picture"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"Difficult"}
        placeholder={"Picture Flashcards"}
        activityType={"picture"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"Challenge"}
        placeholder={"Picture Flashcards"}
        activityType={"picture"}
      />

      <SpeechScores
        subjectId={subjectId}
        difficulty={"easy"}
        placeholder={"Question Flashcards"}
        activityType={"question"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"average"}
        placeholder={"Question Flashcards"}
        activityType={"question"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"Difficult"}
        placeholder={"Question Flashcards"}
        activityType={"question"}
      />
      <SpeechScores
        subjectId={subjectId}
        difficulty={"Challenge"}
        placeholder={"Question Flashcards"}
        activityType={"question"}
      />
    </View>
  );
};

export default Scores;
