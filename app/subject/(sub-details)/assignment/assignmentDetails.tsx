import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAssignmentById, submitAssignment } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import FileUploadSingle from "@/components/FileUploadSingle";
import LoadingCard from "@/components/loadingCard";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

enum SubmissionOptions {
  Text = "Text",
  File = "File",
}

const AssignmentDetails = () => {
  HeaderConfig("Assignment");

  const { subjectId, assignmentId, role } = useLocalSearchParams<{
    subjectId: string;
    assignmentId: string;
    role: string;
  }>();

  const [submissionType, setSubmissionType] = useState<SubmissionOptions>(
    SubmissionOptions.Text,
  );
  const [deadline, setDeadline] = useState<any>();
  const [publishDate, setPublishDate] = useState<any>();
  const [availabilityFrom, setAvailabilityFrom] = useState<string>("");
  const [availabilityTo, setAvailabilityTo] = useState<string>("");
  const [attempt, setAttempt] = useState<number>(1);
  const [points, setPoints] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [answer, setAnswer] = useState<any>();
  const [answerFiles, setAnswerFiles] = useState<FileInfo>();
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    try {
      setIsSubmitting(true);
      const response = await submitAssignment(
        subjectId,
        assignmentId,
        answer,
        answerFiles,
        submissionType,
      );

      if (response.success) {
        Alert.alert("Success", "Your answer has been submitted!");
        router.back();
        return;
      } else {
        Alert.alert("Failed", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        setLoading(true);

        try {
          const res = await getAssignmentById(subjectId, assignmentId);

          if (res.success && res.assignment) {
            const assignment = res.assignment;

            setTitle(assignment.title);
            setDescription(assignment.description);
            setAttempt(assignment.attempts);
            setPoints(assignment.total);
            setFileTypes(assignment.allowed_file_types || []);
            setPublishDate(assignment.published_at);
            setDeadline(assignment.deadline);
            setAvailabilityFrom(assignment.availability.start);
            setAvailabilityTo(assignment.availability.end);
            setSubmissionType(
              assignment.submission_type === "file"
                ? SubmissionOptions.File
                : SubmissionOptions.Text,
            );

            setLoading(false);
          } else {
            Alert.alert("Error", "Failed to fetch the assignment details.");
          }
        } catch (error) {
          console.error("Error fetching assignment: ", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
          setLoading(false);
        }
        setLoading(false);
      };

      fetchAssignment();
    }
  }, [assignmentId, subjectId]);

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      style={[globalStyles.container, { backgroundColor: "#fff" }]}
    >
      <View
        style={{
          borderWidth: 1,
          borderRadius: 20,
          padding: 20,
          borderColor: "#00000024",
          marginBottom: 10,
        }}
      >
        <Text style={[globalStyles.text1, { fontSize: 18 }]}>{title}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <Text style={globalStyles.text1}>Deadline</Text>
            <Text>{deadline}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <Text style={globalStyles.text1}>Points</Text>
            <Text>{points}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", columnGap: 10 }}>
          <Text style={globalStyles.text1}>Availability</Text>
          <Text style={{ flexWrap: "wrap", width: "60%" }}>
            {publishDate +
              " " +
              availabilityFrom +
              " " +
              deadline +
              " " +
              availabilityTo}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", columnGap: 10, alignItems: "center" }}
        >
          <Text style={globalStyles.text1}>Attempts</Text>
          <Text>{attempt}</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <Text style={globalStyles.text1}>Submission Type</Text>
          <Text>{submissionType} Entry</Text>
        </View>
        {role === "student" && (
          <View>
            {!isAnswering && (
              <TouchableOpacity
                style={[
                  globalStyles.submitButton,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: "auto",
                    marginVertical: 20,
                  },
                ]}
                onPress={() => setIsAnswering(true)}
              >
                <Text style={globalStyles.submitButtonText}>
                  Take Assignment
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {isAnswering && (
        <View>
          <View
            style={{
              marginVertical: 10,
              borderRadius: 20,
              backgroundColor: "#fff",
              borderColor: "#00000024",
              borderWidth: 1,
              minHeight: 150,
              rowGap: 20,
            }}
          >
            <View>
              <View style={globalStyles.sectionHeader}>
                <Text style={[globalStyles.text1, { lineHeight: 20 }]}>
                  {submissionType} Entry
                </Text>
              </View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text>{description}</Text>
              </View>
            </View>
            <View>
              {submissionType.toLowerCase() === "text" ? (
                <TextInput
                  style={{
                    minHeight: 150,
                    padding: 15,
                    borderColor: "#00000024",
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 15,
                  }}
                  placeholder={"Write your answer here...."}
                  value={answer}
                  onChangeText={(value) => setAnswer(value)}
                  textAlignVertical="top"
                  multiline={true}
                />
              ) : (
                <View style={{ width: "80%", marginHorizontal: "auto" }}>
                  <FileUploadSingle
                    handleFile={(file: FileInfo) => {
                      setAnswerFiles(file);
                    }}
                    fileTypes={fileTypes}
                  />
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[
              globalStyles.submitButton,
              { marginHorizontal: "auto", marginTop: 10 },
            ]}
            disabled={isSubmitting}
            onPress={handleSubmitAnswer}
          >
            <Text style={globalStyles.submitButtonText}>
              {isSubmitting ? "Submitting.... " : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/*{!isAnswering && (*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      borderRadius: 20,*/}
      {/*      backgroundColor: "#fff",*/}
      {/*      borderColor: "#00000024",*/}
      {/*      borderWidth: 1,*/}
      {/*      minHeight: 150,*/}
      {/*      padding: 20,*/}
      {/*      marginVertical: 10,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Text style={globalStyles.text1}>Latest Attempt</Text>*/}
      {/*    <View style={{ width: "40%" }}>*/}
      {/*      <Picker*/}
      {/*        // selectedValue={selectedValue} // Pass selected value*/}
      {/*        // onValueChange={(itemValue) => setSelectedValue(itemValue)} // Update selected value*/}
      {/*        // style={styles.picker}*/}
      {/*        mode={"dropdown"}*/}
      {/*      >*/}
      {/*        <Picker.Item label="Java" value="java" />*/}
      {/*      </Picker>*/}
      {/*    </View>*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        borderRadius: 20,*/}
      {/*        backgroundColor: "#fff",*/}
      {/*        borderColor: "#00000024",*/}
      {/*        borderWidth: 1,*/}
      {/*        minHeight: 125,*/}
      {/*      }}*/}
      {/*    ></Text>*/}
      {/*  </View>*/}
      {/*)}*/}
    </ScrollView>
  );
};

export default memo(AssignmentDetails);
