import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import {
  createAssignment,
  editAnnouncement,
  editAssignment,
} from "@/utils/query";

type Params = {
  subjectId: string;
  availabilityFrom: string;
  availabilityTo: string;
  deadline: string;
  title: string;
  description: string;
  attempt: string;
  points: string;
  submissionType: string;
  assignmentId: string;
};

const AssignmentPreview = () => {
  useHeaderConfig("Preview");

  const router = useRouter();

  const {
    subjectId,
    availabilityFrom,
    availabilityTo,
    deadline,
    title,
    description,
    attempt,
    points,
    submissionType,
    assignmentId,
  } = useLocalSearchParams<Params>();

  const handleCreateAssignment = async () => {
    let isSuccess = false;
    if (assignmentId !== null) {
      const res = await editAssignment(
        subjectId,
        { start: availabilityFrom, end: availabilityTo },
        title,
        description,
        parseInt(attempt),
        submissionType,
        deadline,
        parseInt(points),
      );

      isSuccess = res.success;

      console.log(res);
    } else {
      try {
        const res = await createAssignment(
          subjectId,
          { start: availabilityFrom, end: availabilityTo },
          title,
          description,
          parseInt(attempt),
          submissionType,
          deadline,
          parseInt(points),
        );
        isSuccess = res.success;

        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }

    if (!isSuccess) return;

    router.back();
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        Preview Assignment for Subject {subjectId}
      </Text>
      <Text>Title: {title}</Text>
      <Text>Description: {description}</Text>
      <Text>Submission Type: {submissionType}</Text>
      <Text>Attempts Allowed: {attempt}</Text>
      <Text>Points: {points}</Text>
      <Text>Available From: {availabilityFrom}</Text>
      <Text>Available To: {availabilityTo}</Text>
      <Text>Deadline: {deadline}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.submitButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.submitButton, { width: "48%" }]}
          onPress={handleCreateAssignment}
        >
          <Text style={globalStyles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(AssignmentPreview);
