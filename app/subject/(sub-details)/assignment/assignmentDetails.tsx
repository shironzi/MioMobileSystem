import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FileUpload from "@/components/FileUpload";
import MultipleChoiceQuestion from "@/components/assignment/MultipleChoiceQuestion";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const assignmentDetails = () => {
  HeaderConfig("Assignment");

  const {
    title,
    deadline,
    availabilityStart,
    availabilityEnd,
    attempts,
    totalPoints,
    submission_type,
  } = useLocalSearchParams<{
    title: string;
    deadline: string;
    availabilityStart: string;
    availabilityEnd: string;
    attempts: string;
    totalPoints: string;
    submission_type: string;
  }>();

  const [descHeight, setDescHeight] = useState<number>(200);
  const [assignmentStatus, setAssignmentStatus] = useState<
    "notStarted" | "inProgress" | "completed"
  >("notStarted");
  const [answer, setAnswer] = useState<string | string[] | FileInfo[] | null>();
  const choices: Record<string, string>[] = [
    { A: "choice 1" },
    { B: "choice 2" },
    { C: "choice 3" },
    { D: "choice 4" },
  ];

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleTakeAssignment = () => {
    // request from the backend first

    setAssignmentStatus("inProgress");
  };

  const handleSubmit = () => {
    console.log(answer);
  };

  const handleFileUpload = (files: FileInfo[]) => {
    setAnswer(files);
  };

  const handleChoice = (choice: string | string[]) => {
    setAnswer(choice);
  };

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      <View style={globalStyles.cardContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Text style={styles.deadline}>
            Deadline:{" "}
            {deadline === null || deadline === ""
              ? "No Due Date"
              : formatDateTime(deadline)}
          </Text>
          <Text style={styles.points}>Points: {totalPoints}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Text>Availability: </Text>
          <Text style={styles.availability}>
            {formatDateTime(availabilityStart)} -{" "}
            {formatDateTime(availabilityEnd)}
          </Text>
        </View>

        <Text style={styles.attempt}>Attempts: {attempts}</Text>
        <Text>Submission Type: {submission_type}</Text>
        {assignmentStatus !== "inProgress" ? (
          <TouchableOpacity
            style={globalStyles.submitButton}
            onPress={handleTakeAssignment}
          >
            <Text style={globalStyles.submitButtonText}>Take Assignment</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={[
          globalStyles.cardContainer,
          globalStyles.cardBody,
          { minHeight: 100 },
        ]}
      >
        <Text style={globalStyles.sectionHeader}>Question</Text>
        <Text
          style={{
            paddingHorizontal: 26,
            marginTop: 15,
          }}
        >
          What is your opinion about...?
        </Text>
        {assignmentStatus === "inProgress" ? (
          <View style={[globalStyles.contentPadding, { rowGap: 15 }]}>
            {submission_type === "quiz" ? (
              <MultipleChoiceQuestion
                choices={choices}
                handleChoice={handleChoice}
                allowsMultipleChoice={false}
              />
            ) : submission_type === "text" ? (
              <>
                {/*<TextInput*/}
                {/*  style={[globalStyles.inputContainer, { height: 50 }]}*/}
                {/*/>*/}
                <TextInput
                  placeholder="Your Answer Here"
                  onChangeText={setAnswer}
                  style={[
                    globalStyles.inputContainer,
                    { height: Math.max(200, descHeight) },
                  ]}
                  multiline
                  onContentSizeChange={(e) =>
                    setDescHeight(e.nativeEvent.contentSize.height)
                  }
                  textAlignVertical="top"
                />
              </>
            ) : submission_type === "file" ? (
              <FileUpload handleFiles={handleFileUpload} />
            ) : (
              <>
                <Text>Error</Text>
              </>
            )}

            <TouchableOpacity
              style={[globalStyles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={globalStyles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {assignmentStatus !== "inProgress" ? (
        <View style={[globalStyles.cardContainer, { rowGap: 20 }]}>
          <Text>Latest Attempt</Text>
          <Text>Dropdown (View Attempt)</Text>
          <TextInput
            placeholder="Your attempt Here"
            style={[
              globalStyles.inputContainer,
              { height: Math.max(200, descHeight) },
            ]}
            multiline
            onContentSizeChange={(e) =>
              setDescHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#2264dc",
    marginBottom: 15,
    fontWeight: "bold",
    marginTop: -5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  deadline: {
    fontSize: 16,
    color: "#000",
    marginRight: 10,
  },
  points: {
    fontSize: 16,
    color: "#000",
  },
  availabilityContainer: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
    maxWidth: "80%",
    flexDirection: "row",
  },
  availability: {
    flexWrap: "wrap",
    maxWidth: "70%",
  },
  attempt: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
});

export default memo(assignmentDetails);
