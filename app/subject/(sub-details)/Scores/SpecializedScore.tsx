import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router, useLocalSearchParams } from "expo-router";
import SpeechDropdown from "@/app/subject/(sub-details)/Scores/SpeechDropdown";
import { Feedback } from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import { addComment, getAttempt, getAttemptStudent } from "@/utils/query";
import LoadingCard from "@/components/loadingCard";
import LoadingAlert from "@/components/Alerts/LoadingAlert";
import CompletedAlert from "@/components/Alerts/CompletedAlert";

const SpecializedScore = () => {
  useHeaderConfig("Score");

  const { role, studentId, activityId, subjectId, attemptId, activityType } =
    useLocalSearchParams<{
      role: string;
      studentId: string;
      activityId: string;
      subjectId: string;
      attemptId: string;
      activityType: string;
    }>();

  const [overallScore, setOverallScore] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [commentError, setCommentError] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedback, setFeedback] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleAddComment = async () => {
    setIsSubmitting(true);

    const res = await addComment(
      subjectId,
      activityType,
      activityId,
      studentId,
      attemptId,
      comment,
    );

    if (res.success) {
      setIsSuccess(true);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchAttempt = async () => {
      if (comment.trim().length > 300) {
        setCommentError(true);
        return;
      }

      const res = studentId
        ? await getAttempt(
            subjectId,
            activityId,
            studentId,
            attemptId,
            activityType,
          )
        : await getAttemptStudent(subjectId, activityId);

      if (res.success) {
        setOverallScore(res.overall_score ?? 0);
        setFeedbacks(res.feedbacks);
        setFeedback(res.feedback);
        setComment(res.comment);
        setLoading(false);
      } else {
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
      }
    };

    fetchAttempt();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {isSubmitting && <LoadingAlert />}
      {isSuccess && (
        <CompletedAlert
          message={"Comment saved!"}
          handleButton={() => setIsSuccess(false)}
        />
      )}

      <View
        style={[
          globalStyles.container,
          {
            marginBottom: 50,
            rowGap: 20,
          },
        ]}
      >
        <View style={[globalStyles.cardContainer, { paddingVertical: 25 }]}>
          <View style={styles.scoreRow}>
            <AnimatedCircularProgress
              size={150}
              width={10}
              fill={overallScore}
              tintColor="#2264DC"
              backgroundColor="#e7eaea"
              rotation={0}
              lineCap="round"
            >
              {() => (
                <>
                  <Text style={styles.scoreText}>{overallScore}</Text>
                  <Text>Points</Text>
                </>
              )}
            </AnimatedCircularProgress>
            <Text>Out of 100 points</Text>
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
                onChangeText={setComment}
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
            <View style={globalStyles.cardContainer}>
              <Text>{comment ?? "No comment"}</Text>
            </View>
          )}
        </View>
        <View style={{ rowGap: 20 }}>
          {feedbacks.length === 0 ? (
            <View style={globalStyles.cardContainer}>
              <Text>
                {feedback
                  ? feedback
                  : "This activity doesn’t have feedback yet."}
              </Text>
            </View>
          ) : (
            feedbacks.map((item, index) => (
              <SpeechDropdown
                items={item}
                placeholder={index}
                key={item.id}
                role={role}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#1F1F1F",
    lineHeight: 28,
    fontWeight: "500",
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 28,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
  feedbackText: {
    paddingHorizontal: 10,
    textAlign: "left",
    color: "#1F1F1F",
    fontSize: 16,
    lineHeight: 24,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default SpecializedScore;
