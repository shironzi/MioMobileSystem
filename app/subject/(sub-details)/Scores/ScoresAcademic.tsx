import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  getStudentAssignmentAttempt,
  submitAssignmentEval,
} from "@/utils/query";
import globalStyles from "@/styles/globalStyles";
import ErrorModal from "@/components/modals/ErrorModal";
import * as FileSystem from "expo-file-system";
import LoadingCard from "@/components/loadingCard";

interface StudentAnswer {
  comments: string;
  feedback: string;
  work: string;
  score: string;
}

const ScoresAcademic = () => {
  useHeaderConfig("Scores");

  const [activityInfo, setActivityInfo] = useState<{
    title: string;
    description: string;
    deadline: string;
    published_at: string;
    availabilityFrom: string;
    availabilityTo: string;
    submission_type: string;
    total: string;
  }>();

  const [student_answer, setStudent_answer] = useState<StudentAnswer>({
    comments: "",
    feedback: "",
    work: "",
    score: "",
  });

  const { subjectId, activityType, activityId, studentId, role } =
    useLocalSearchParams<{
      subjectId: string;
      activityType: string;
      activityId: string;
      studentId: string;
      role: string;
    }>();

  const [scoreError, setScoreError] = useState<string>("");
  const [errorMessageModal, setErrorMessageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!student_answer?.score || student_answer?.score.trim() === "") {
      setScoreError("Score is required. Please enter a valid score.");
    } else if (student_answer?.score <= "0") {
      setScoreError(
        "Score cannot be negative. Please enter a valid positive number.",
      );
    } else if (
      activityInfo?.total &&
      parseInt(student_answer?.score) > parseInt(activityInfo?.total)
    ) {
      setScoreError(
        `Score cannot exceed the maximum value of ${activityInfo.total}. Please enter a valid score.`,
      );
    } else {
      setScoreError("");
    }

    if (scoreError.length) {
      setErrorMessageModal(true);
      console.log(scoreError);
      return;
    }

    const res = await submitAssignmentEval(
      studentId,
      activityId,
      subjectId,
      student_answer.comments,
      student_answer.feedback,
      student_answer.score,
    );

    console.log(res);
  };

  const getMimeTypeFromFilename = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      zip: "application/zip",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      mp4: "video/mp4",
      txt: "text/plain",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      rtf: "application/rtf",
      img: "image/*",
    };

    return (extension && mimeTypes[extension]) || "application/octet-stream";
  };

  const filename = "download";
  const mimeTypeFromFilename = getMimeTypeFromFilename(student_answer.work);

  const generateScoreBook = async () => {
    const fileUri = FileSystem.documentDirectory + filename;

    const url = student_answer.work;
    if (!url) {
      return;
    }

    const result = await FileSystem.downloadAsync(url, fileUri);

    const mimeType = result.headers["Content-Type"] || mimeTypeFromFilename;
    await saveFile(result.uri, filename, mimeType);
  };

  const saveFile = async (uri: string, filename: string, mimeType: string) => {
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permission.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (mimeType) {
        const savedUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            permission.directoryUri,
            filename,
            mimeType,
          );

        await FileSystem.writeAsStringAsync(savedUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
    }
  };

  useEffect(() => {
    const fetchScores = async () => {
      const res = await getStudentAssignmentAttempt(
        subjectId,
        activityId,
        studentId,
      );

      if (res.success) {
        setActivityInfo(res.assignment_info);
        setStudent_answer(res.student_answer);
      } else {
        console.error("Failed to fetch data");
      }

      setLoading(false);
    };

    fetchScores();
  }, [activityType, subjectId, activityId, studentId]);

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
      style={{ padding: 20, backgroundColor: "#fff", height: "100%" }}
    >
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
          <View
            style={[
              globalStyles.sectionHeader,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text
              style={[globalStyles.text1, { lineHeight: 20, width: "70%" }]}
            >
              {activityInfo?.submission_type === "text" ? "Text" : "File"} Entry
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <TextInput
                style={[
                  globalStyles.text1,
                  {
                    lineHeight: 16,
                    borderWidth: 1,
                    width: 50,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    borderColor: scoreError ? "#DA4848" : "#00000024",
                  },
                ]}
                value={student_answer?.score}
                keyboardType="numeric"
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  setScoreError("");
                  setStudent_answer((prev) => ({
                    ...prev,
                    score: numericValue,
                  }));
                }}
              />
              <Text style={[globalStyles.text1, { lineHeight: 20 }]}>
                /{activityInfo?.total}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text>{activityInfo?.description}</Text>
          </View>
        </View>
        <View>
          {activityInfo?.submission_type.toLowerCase() === "text" ? (
            <View>
              <View>
                <Text
                  style={[
                    globalStyles.text1,
                    { marginHorizontal: 20, marginBottom: -10 },
                  ]}
                >
                  Answer
                </Text>
                <TextInput
                  style={{
                    minHeight: 250,
                    padding: 15,
                    borderColor: "#00000024",
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 15,
                  }}
                  placeholder={"Write your answer here...."}
                  value={student_answer?.work}
                  textAlignVertical="top"
                  multiline={true}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>

              <View>
                <Text
                  style={[
                    globalStyles.text1,
                    { marginHorizontal: 20, marginBottom: -10 },
                  ]}
                >
                  Feedback
                </Text>
                <TextInput
                  style={{
                    minHeight: 100,
                    padding: 15,
                    borderColor: "#00000024",
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 15,
                  }}
                  placeholder={"Write your Feedback here...."}
                  value={student_answer?.feedback}
                  onChangeText={(value) => {
                    setStudent_answer((prev) => ({
                      ...prev,
                      feedback: value,
                    }));
                  }}
                  textAlignVertical="top"
                  multiline={true}
                />
              </View>
              <View>
                <Text
                  style={[
                    globalStyles.text1,
                    { marginHorizontal: 20, marginBottom: -10 },
                  ]}
                >
                  Comments
                </Text>
                <TextInput
                  style={{
                    minHeight: 100,
                    padding: 15,
                    borderColor: "#00000024",
                    borderWidth: 1,
                    borderRadius: 10,
                    margin: 15,
                  }}
                  placeholder={"Write your comments here...."}
                  value={student_answer?.comments}
                  textAlignVertical="top"
                  multiline={true}
                  onChangeText={(value) => {
                    setStudent_answer((prev) => ({
                      ...prev,
                      comments: value,
                    }));
                  }}
                />
              </View>
            </View>
          ) : (
            <View style={{ width: "80%", marginHorizontal: "auto" }}>
              {activityInfo?.submission_type === "JPG" ||
              activityInfo?.submission_type === "PNG" ? (
                <View>
                  <Image />
                </View>
              ) : (
                <View style={{ marginBottom: 20 }}>
                  <TouchableOpacity onPress={generateScoreBook}>
                    <Text>Download Student Answer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
          marginBottom: 50,
        }}
      >
        <TouchableOpacity
          style={[
            {
              borderWidth: 1,
              borderRadius: 15,
              borderColor: "#FFBF189E",
              width: 165,
              marginBottom: 10,
              paddingVertical: 15,
            },
          ]}
        >
          <Text style={[globalStyles.submitButtonText, { color: "#FFBF18" }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ErrorModal
        errorMessageModal={errorMessageModal}
        scoreError={scoreError}
        setErrorMessageModal={() => setErrorMessageModal(false)}
      />
    </ScrollView>
  );
};

export default ScoresAcademic;
