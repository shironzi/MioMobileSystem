import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React, { useEffect, useState } from "react";
import {
  getRemedialResult,
  getRemedialResultByStudent,
} from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";
import LoadingCard from "@/components/loadingCard";
import SpeechDetailedDropdown from "@/app/subject/(sub-details)/Scores/SpeechDetailedDropdown";
import useHeaderConfig from "@/utils/HeaderConfig";
import { addRemedialComment } from "@/utils/query";

interface Item {
  id: string;
  feedback: string;
  audio: string;
  phonemes: {
    phone: string;
    quality_score: number;
    sound_most_like: string;
  }[];
  word: string;
  score: number;
}

const RemedialResult = () => {
  useHeaderConfig("Details");

  const {
    subjectId,
    remedialId,
    phoneme,
    activityType,
    role,
    studentId,
    attemptId,
  } = useLocalSearchParams<{
    subjectId: string;
    remedialId: string;
    phoneme: string;
    activityType: string;
    role: string;
    studentId: string;
    attemptId: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleComment = (comment: string) => {
    if (comment.length > 300) {
      setCommentError(true);
      return;
    }

    setCommentError(false);
    setComment(comment);
  };

  const handleAddComment = async () => {
    if (comment.trim().length < 1) return;

    setIsSubmitting(true);
    const res = await addRemedialComment(
      subjectId,
      activityType,
      studentId,
      attemptId,
      comment,
      remedialId,
      phoneme,
    );

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Error", res.message);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchResult = async () => {
      const res = attemptId
        ? await getRemedialResultByStudent(
            subjectId,
            activityType,
            remedialId,
            phoneme,
            studentId,
            attemptId,
          )
        : await getRemedialResult(subjectId, activityType, remedialId, phoneme);

      if (res.success) {
        console.log(res.items);
        setScore(res.score);
        setItems(res.items);
        setComment(res.comment);
      } else {
        Alert.alert(
          "Activity not found",
          res.message,
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      }
      setLoading(false);
    };
    fetchResult();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
      <View
        style={{
          padding: 20,
          rowGap: 20,
          paddingBottom: 100,
        }}
      >
        <View style={[globalStyles.cardContainer]}>
          <Text style={styles.sectionTitle}>Score</Text>
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={5}
              fill={(score / 100) * 100}
              tintColor="#2264DC"
              backgroundColor="#fff"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <>
                  <Text style={styles.scoreText}>{score}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of {100} points</Text>
          </View>
        </View>
        <View style={globalStyles.cardContainer}>
          <Text style={styles.sectionTitle}>Comments</Text>
          {role === "teacher" ? (
            <View>
              {commentError && (
                <Text style={globalStyles.errorText}>
                  Comment must not exceed 300 characters.
                </Text>
              )}
              <TextInput
                style={[
                  globalStyles.textInputContainer,
                  {
                    paddingVertical: 15,
                    minHeight: 125,
                    textAlignVertical: "top",
                  },
                  commentError && { borderColor: "red" },
                ]}
                placeholder={"Add Comment"}
                value={comment}
                onChangeText={(value: string) => handleComment(value)}
                multiline={true}
              />

              <TouchableOpacity
                style={[
                  globalStyles.submitButton,
                  { marginHorizontal: "auto", marginTop: 10 },
                ]}
                disabled={isSubmitting}
                onPress={handleAddComment}
              >
                <Text style={globalStyles.submitButtonText}>
                  {isSubmitting ? "Adding comment..." : "Add Comment"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[globalStyles.cardContainer, { minHeight: 150 }]}>
              {comment.length > 0 ? comment : "No Comment."}
            </Text>
          )}
        </View>
        {items?.map((item, index) => (
          <SpeechDetailedDropdown
            key={item.id}
            items={item}
            placeholder={index}
            role={role}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 500,
    fontSize: 18,
    marginVertical: 10,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 0,
  },
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
});

export default RemedialResult;
