import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PlayCard = (props: {
  id: number;
  label: string;
  activity_type: string;
  difficulty: string;
  category: string;
  subjectId: string;
  activityId: string;
  role: string;
}) => {
  const router = useRouter();
  const handleCategory = () => {
    if (props.category === "speech") {
      if (props.activity_type === "picture") {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/(exercises)/(speech)/AddSpeechActivity"
              : "/subject/(exercises)/(speech)/PictureFlashcards",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }

      if (
        props.activity_type === "phrase" ||
        props.activity_type === "question" ||
        props.activity_type === "pronunciation"
      ) {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/(exercises)/(speech)/AddSpeechActivity"
              : "/subject/(exercises)/(speech)/Flashcards",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }
    }

    if (props.category === "auditory") {
      if (props.activity_type === "bingo") {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/ManageAuditoryActivity/AddAuditoryActivity"
              : "/subject/(exercises)/(auditory)/bingo",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }

      if (props.activity_type === "matching") {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/ManageAuditoryActivity/AddAuditoryActivity"
              : "/subject/(exercises)/(auditory)/MatchingCards",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }
    }

    if (props.category === "language") {
      if (props.activity_type === "fill") {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/ManageActivity/AddLanguageActivity"
              : "/subject/(exercises)/(language)/fillInTheBlank",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }

      if (props.activity_type === "homonyms") {
        router.push({
          pathname:
            props.role === "teacher"
              ? "/subject/ManageActivity/AddLanguageActivity"
              : "/subject/(exercises)/(language)/Homonyms",
          params: {
            subjectId: props.subjectId,
            activity_type: props.activity_type,
            difficulty: props.difficulty,
            category: props.category,
            activityId: props.activityId,
          },
        });
      }
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCategory}>
      <View style={styles.borderLeft}></View>
      <View style={styles.linkDecoration}>
        <Text style={styles.cardNumber}>{props.id + 1}</Text>
        <Text style={styles.cardWord}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
  },
  cardNumber: {
    fontSize: 18,
    color: "#000",
  },
  cardWord: {
    fontSize: 18,
    color: "#FFBF18",
    textDecorationLine: "underline",
  },
  linkDecoration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  borderLeft: {
    borderColor: "#FFBF18",
    borderWidth: 2.5,
    backgroundColor: "#FFBF18",
    borderRadius: 100,
    height: "100%",
  },
});

export default memo(PlayCard);
