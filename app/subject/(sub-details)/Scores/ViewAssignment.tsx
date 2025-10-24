import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";
import AcademicItemCard from "@/app/subject/(sub-details)/Scores/AcademicItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { getStudentAssignment, submitAssignmentEval } from "@/utils/assignment";
import CancelAlert from "@/components/Alerts/CancelAlert";
import LoadingCard from "@/components/loadingCard";
import CompletedAlert from "@/components/Alerts/CompletedAlert";

const ViewAssignment = () => {
  useHeaderConfig("Assignment");

  const { studentId, subjectId, activityId } = useLocalSearchParams<{
    studentId: string;
    subjectId: string;
    activityId: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState("0");
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [studentAnswer, setStudentAnswer] = useState<{
    work: string;
    title: string;
    total: number;
    comments: string;
    submission_type: string;
    description: string;
    score: number;
  }>();

  const handleCancel = () => {
    router.back();
    router.back();
    router.back();
  };

  const handleSubmit = async () => {
    const newScore = parseInt(score);

    if (!studentAnswer?.total) {
      setErrorMessage(
        "Unable to retrieve the total score.\nPlease check the assignment setup Details",
      );
      setShowAlert(true);
      return;
    }

    if (newScore > studentAnswer.total) {
      setErrorMessage(
        `Score cannot exceed the total score (${studentAnswer.total}).`,
      );
      setShowAlert(true);
      return;
    }

    if (isNaN(newScore) || newScore < 0) {
      setErrorMessage("Please enter a valid score.");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    const res = await submitAssignmentEval(
      studentId,
      activityId,
      subjectId,
      comment,
      newScore,
    );

    if (res.success) {
      setShowAlert(true);
      setErrorMessage("Score was successfully updated.");
    } else {
      setShowAlert(true);
      setErrorMessage("Failed to submit the score. Please try again.");
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const getAssignment = async () => {
      const res = await getStudentAssignment(subjectId, activityId, studentId);

      setLoading(false);
      if (res.success) {
        setStudentAnswer(res.assignment);
        setComment(res.assignment.comments);
      } else {
        setShowModal(true);
        setMessage(res.message);
      }
    };

    getAssignment();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  if (showModal) {
    return (
      <CompletedAlert
        message={message}
        handleButton={() => {
          router.back();
          router.back();
          router.back();
          setShowModal(false);
        }}
      />
    );
  }

  return (
    <View style={[globalStyles.container, { height: "100%" }]}>
      <ScrollView>
        <Text style={globalStyles.text1}>Latest Attempt</Text>
        <View style={{ rowGap: 20 }}>
          <AcademicItemCard
            title={"Description"}
            question={studentAnswer?.description}
            hasScore={false}
          />

          <AcademicItemCard
            title={"Question 1"}
            score={studentAnswer?.score.toString() ?? ""}
            setScore={setScore}
            totalScore={studentAnswer?.total.toString()}
            answerType={studentAnswer?.submission_type}
            studentAnswer={studentAnswer?.work}
          />

          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.text1}>Comments</Text>
            <TextInput
              style={styles.commentTextBox}
              multiline={true}
              textAlignVertical={"top"}
              value={comment}
              onChangeText={setComment}
            />
          </View>
        </View>

        <View style={[globalStyles.buttonContainer, { marginTop: 25 }]}>
          <TouchableOpacity
            style={globalStyles.inactivityButton}
            onPress={() => setShowCancelAlert(true)}
            disabled={isSubmitting}
          >
            <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={globalStyles.submitButtonText}>
              {isSubmitting ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        {showCancelAlert && (
          <CancelAlert
            handleApprove={handleCancel}
            handleReject={() => setShowCancelAlert(false)}
          />
        )}

        {showAlert && (
          <CompletedAlert
            message={errorMessage}
            handleButton={() => setShowAlert(false)}
            autoClose={true}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreText: {
    fontSize: 24,
    color: "#1F1F1F",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  commentTextBox: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 100,
    borderColor: "#ddd",
    padding: 10,
  },
});

export default ViewAssignment;
