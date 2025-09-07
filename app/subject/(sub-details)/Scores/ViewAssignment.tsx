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
import { getStudentAssignment } from "@/utils/assignment";
import CancelAlert from "@/components/Alerts/CancelAlert";
import { FileInfo } from "@/app/subject/(exercises)/(language)/ManageActivity/AddLanguageActivity";
import LoadingCard from "@/components/loadingCard";

const ViewAssignment = () => {
  useHeaderConfig("Assignment");

  const { studentId, role, subjectId, activityId } = useLocalSearchParams<{
    studentId: string;
    role: string;
    subjectId: string;
    activityId: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState("0");
  const [showAlert, setShowAlert] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState<{
    work: string | FileInfo[];
    title: string;
    total: number;
    comment: string;
    submission_type: string;
    description: string;
  }>();

  const handleCancel = () => {
    router.back();
    router.back();
    router.back();
  };

  useEffect(() => {
    const getAssignment = async () => {
      const res = await getStudentAssignment(subjectId, activityId, studentId);

      setStudentAnswer(res.assignment);
      setLoading(false);
    };

    getAssignment();
  });

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <Text style={globalStyles.text1}>Latest Attempt</Text>
        <View style={{ rowGap: 20 }}>
          <AcademicItemCard
            title={"Description"}
            question={studentAnswer?.description}
            hasScore={false}
          />

          <AcademicItemCard
            title={"Question 1"}
            score={score}
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
            />
          </View>
        </View>

        <View style={[globalStyles.buttonContainer, { marginTop: 25 }]}>
          <TouchableOpacity
            style={globalStyles.inactivityButton}
            onPress={() => setShowAlert(true)}
          >
            <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.submitButton}>
            <Text style={globalStyles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {showAlert && (
          <CancelAlert
            handleApprove={handleCancel}
            handleReject={() => setShowAlert(false)}
          />
        )}
      </View>
    </ScrollView>
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
    paddingVertical: 10,
  },
});

export default ViewAssignment;
