import globalStyles from "@/styles/globalStyles";
import headerConfigScoreDetails from "@/utils/HeaderConfigScoreDetails";
import {
  addAuditoryComment,
  getAuditoryRemedialAttempt,
  getStudentRemedialAuditory,
} from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LoadingCard from "@/components/loadingCard";
import SpeechDetailedDropdown from "@/app/subject/(sub-details)/Scores/SpeechDetailedDropdown";

interface Feedback {
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

const AuditoryScores = () => {
  headerConfigScoreDetails("Score Details");

  const { subjectId, activityType, remedialId, studentId, attemptId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      remedialId: string;
      studentId: string;
      attemptId: string;
      role: string;
    }>();

  const [overallScore, setOverallScore] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>("");
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
    const res = await addAuditoryComment(
      subjectId,
      activityType,
      remedialId,
      studentId,
      attemptId,
      comment,
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
    const fetchAttempt = async () => {
      const res = studentId
        ? await getAuditoryRemedialAttempt(
            subjectId,
            activityType,
            remedialId,
            studentId,
            attemptId,
          )
        : await getStudentRemedialAuditory(subjectId, activityType, remedialId);

      if (res.success) {
        setOverallScore(res.overall_score ?? 0);
        setFeedbacks(res.feedbacks);
        setFeedback(res.feedback);
        setComment(res.comment);
        console.log(res.feedbacks);
      }

      setLoading(false);
    };

    fetchAttempt();
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
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View
        style={[
          globalStyles.container,
          {
            marginBottom: 50,
            rowGap: 20,
          },
        ]}
      >
        {overallScore !== null && (
          <View style={[globalStyles.cardContainer, { paddingVertical: 25 }]}>
            <Text style={styles.sectionTitle}>Score</Text>
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
        )}

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
            <View style={globalStyles.cardContainer}>
              <Text>{comment ?? "No comment"}</Text>
            </View>
          )}
        </View>
        <View style={{ rowGap: 20 }}>
          {feedbacks.length === 0 ? (
            <View style={globalStyles.cardContainer}>
              <Text style={styles.sectionTitle}>Mio Feedback</Text>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : (
            feedbacks.map((item, index) => (
              <SpeechDetailedDropdown
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

export default memo(AuditoryScores);
