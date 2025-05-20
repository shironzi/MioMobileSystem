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
    createdAt,
    availabilityStart,
    availabilityEnd,
    attempts,
    totalPoints,
    submission_type,
  } = useLocalSearchParams<{
    title: string;
    deadline: string;
    createdAt: string;
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
  const [files, setFiles] = useState<FileInfo[]>();
  const [answer, setAnswer] = useState<string | string[] | null>();
  const choices: Record<string, string>[] = [
    { A: "choice 1" },
    { B: "choice 2" },
    { C: "choice 3" },
    { D: "choice 4" },
  ];

  const formatDate = useCallback(
    (date: string) => {
      const newDate = new Date(date);
      return newDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },
    [Date],
  );

  const formatTime = useCallback(
    (timeStr: string) => {
      const [hourStr, minute] = timeStr.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    },
    [Date],
  );

  const handleTakeAssignment = () => {
    // request from the backend first

    setAssignmentStatus("inProgress");
  };

  const handleSubmit = (answer: string) => {
    console.log("Submitted");
    console.log(answer);
  };

  const handleFileUpload = (files: FileInfo[]) => {
    setFiles(files);
  };

  const handleChoice = (choice: string | string[]) => {
    setAnswer(choice);
    console.log(answer);
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
              : formatDate(deadline)}
          </Text>
          <Text style={styles.points}>Points: {totalPoints}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Text>Availability: </Text>
          <Text style={styles.availability}>
            {formatDate(deadline)} {formatTime(availabilityStart)} -{" "}
            {formatDate(createdAt)} {formatTime(availabilityEnd)}
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
          <View style={globalStyles.contentPadding}>
            <MultipleChoiceQuestion
              choices={choices}
              handleChoice={handleChoice}
              allowsMultipleChoice={false}
            />
            {/*<TextInput style={[globalStyles.inputContainer, { height: 50 }]} />*/}
            {/*<TextInput*/}
            {/*  placeholder="Your Answer Here"*/}
            {/*  onChangeText={setAnswer}*/}
            {/*  style={[*/}
            {/*    globalStyles.inputContainer,*/}
            {/*    { height: Math.max(200, descHeight) },*/}
            {/*  ]}*/}
            {/*  multiline*/}
            {/*  onContentSizeChange={(e) =>*/}
            {/*    setDescHeight(e.nativeEvent.contentSize.height)*/}
            {/*  }*/}
            {/*  textAlignVertical="top"*/}
            {/*/>*/}
            {/*<FileUpload handleFiles={handleFileUpload} />*/}
            <TouchableOpacity style={[globalStyles.submitButton]}>
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
    maxWidth: "80%",
  },
  attempt: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
});

export default memo(assignmentDetails);
