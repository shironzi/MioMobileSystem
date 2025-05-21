import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { createAssignment } from "@/utils/query";
import { MaterialIcons } from "@expo/vector-icons";

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
};

const AssignmentPreview = () => {
  useHeaderConfig("Preview");

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
  } = useLocalSearchParams<Params>();

  const handleCreateAssignment = async () => {
    try {
      const data = await createAssignment(
        subjectId,
        { start: availabilityFrom, end: availabilityTo },
        title,
        description,
        parseInt(attempt),
        submissionType,
        deadline,
        parseInt(points),
      );
      console.log(data);
    } catch (err) {
      console.error(err);
    }
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
      <TouchableOpacity
        style={[
          globalStyles.submitButton,
          { flexDirection: "row", justifyContent: "center" },
        ]}
        onPress={handleCreateAssignment}
      >
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={globalStyles.submitButtonText}>Add Assignment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(AssignmentPreview);
