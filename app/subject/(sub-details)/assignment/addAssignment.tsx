import { DatePickerField } from "@/components/DatePickerField";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import {
  createAssignment,
  editAssignment,
  getAssignmentById,
} from "@/utils/query";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

enum SubmissionOptions {
  Text = "Text",
  File = "File",
}

type SubmissionOption =
  (typeof SubmissionOptions)[keyof typeof SubmissionOptions];

const addAssignment = () => {
  HeaderConfig("Assignment");

  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [submissionType, setSubmissionType] = useState<SubmissionOptions>(
    SubmissionOptions.Text,
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deadline, setDeadline] = useState<Date>(tomorrow);
  const [publishDate, setPublishDate] = useState<Date>(new Date());
  const [availabilityFrom, setAvailabilityFrom] = useState<string>("");
  const [availabilityTo, setAvailabilityTo] = useState<string>("");
  const [attempt, setAttempt] = useState<number>(1);
  const [points, setPoints] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(true);
  const [fileSize, setFileSize] = useState<number>(0);

  const [fileTypes, setFileTypes] = useState<string[]>([]);

  const handleFileTypes = (value: string) => {
    if (fileTypes.includes(value)) {
      setFileTypes((prev) => prev.filter((types) => types !== value));
    } else {
      setFileTypes((prev) => [...prev, value]);
    }
  };

  const [error, setError] = useState<{ error: string }[]>([]);

  const handleAddAttempt = () => {
    setAttempt(attempt + 1);
  };

  const handleMinusAttempt = () => {
    if (attempt > 1) {
      setAttempt(attempt - 1);
    }
  };

  const sanitizeAttemptInput = (raw: string): string => {
    return raw.replace(/\D/g, "");
  };

  const handlePreviewAssignment = async () => {
    const errorList: { error: string }[] = [];

    if (isNaN(publishDate?.getTime())) {
      errorList.push({ error: "publishDate" });
    }

    if (isNaN(deadline?.getTime())) {
      errorList.push({ error: "deadline" });
    }

    if (fileSize < 5120 && submissionType === "File") {
      errorList.push({ error: "fileSize" });
    }

    if (fileTypes.length < 1 && submissionType === "File") {
      errorList.push({ error: "fileTypes" });
    }

    if (!availabilityFrom?.trim()) {
      errorList.push({ error: "availabilityFrom" });
    }

    if (!availabilityTo?.trim()) {
      errorList.push({ error: "availabilityTo" });
    }

    if (!title || !title.trim()) {
      errorList.push({ error: "title" });
    }

    if (!description) {
      errorList.push({ error: "description" });
    }

    if (!attempt || attempt < 1) {
      errorList.push({ error: "attempt" });
    }

    if (errorList.length > 0) {
      setError(errorList);
      console.log(errorList);
      return;
    }

    const res = assignmentId
      ? await editAssignment(
          subjectId,
          assignmentId,
          availabilityTo,
          availabilityFrom,
          title,
          description,
          attempt,
          submissionType.toLowerCase(),
          deadline,
          points,
          publishDate,
          fileSize,
          visibility,
          fileTypes,
        )
      : await createAssignment(
          subjectId,
          availabilityTo,
          availabilityFrom,
          title,
          description,
          attempt,
          submissionType.toLowerCase(),
          deadline,
          points,
          publishDate,
          fileSize,
          visibility,
          fileTypes,
        );

    console.log(res);

    if (res.success) {
      Alert.alert(
        "Success",
        "Successfully created the activity",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const optionValues = Object.values(SubmissionOptions) as SubmissionOption[];

  const handleAvailabilityFrom = (date: Date) => {
    setAvailabilityFrom(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  const handleAvailabilityTo = (date: Date) => {
    setAvailabilityTo(
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        setLoading(true);

        const res = await getAssignmentById(subjectId, assignmentId);

        if (res.success && res.assignment) {
          const assignment = res.assignment;

          setTitle(assignment.title);
          setDescription(assignment.description);
          setAttempt(assignment.attempts);
          setPoints(assignment.total);
          setVisibility(assignment.visibility);
          setFileTypes(assignment.file_types_types || []);

          const parsedPublishedAt = new Date(assignment.published_at);
          const parsedDeadline = new Date(assignment.deadline);

          setPublishDate(parsedPublishedAt);
          setDeadline(parsedDeadline);

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
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    // >
    //   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[globalStyles.cardContainer, { rowGap: 15 }]}>
        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Publish Date</Text>
          <DatePickerField
            date={publishDate}
            onChange={setPublishDate}
            error={error.some((err) => err.error === "publishDate")}
            style={styles.dropdown}
          />
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Deadline</Text>
          <DatePickerField
            date={deadline}
            onChange={setDeadline}
            error={error.some((err) => err.error === "deadline")}
            style={styles.dropdown}
          />
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Availability From</Text>
          <DatePickerField
            date={availabilityFrom}
            onChange={(value) => handleAvailabilityFrom(value)}
            error={error.some((err) => err.error === "availabilityFrom")}
            style={styles.dropdown}
            mode={"time"}
          />
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Availability To</Text>
          <DatePickerField
            date={availabilityTo}
            onChange={(value) => handleAvailabilityTo(value)}
            error={error.some((err) => err.error === "availabilityTo")}
            style={styles.dropdown}
            mode={"time"}
          />
        </View>

        <View style={styles.attemptContainer}>
          <Text style={globalStyles.textLabel}>Attempts</Text>
          <View
            style={[
              styles.attemptInputContainer,
              error.some((err) => err.error === "attempts")
                ? { borderColor: "#db4141", borderWidth: 1 }
                : { borderColor: "#ddd" },
            ]}
          >
            <TextInput
              style={styles.attemptInput}
              value={attempt.toString()}
              onChangeText={(text) => {
                const sanitized = sanitizeAttemptInput(text);
                setAttempt(sanitized ? parseInt(sanitized, 10) : 0);
              }}
              keyboardType={"numeric"}
            />
            <View style={styles.arrowContainer}>
              <TouchableOpacity onPress={handleAddAttempt}>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={25}
                  color="#ffbf18"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMinusAttempt}>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={25}
                  color="#ffbf18"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Points</Text>
          <TextInput
            style={[
              styles.dropdown,
              error.some((err) => err.error === "points")
                ? { borderColor: "#db4141", borderWidth: 1 }
                : { borderColor: "#ddd" },
            ]}
            placeholder="Points"
            placeholderTextColor="#aaa"
            value={points.toString()}
            onChangeText={(text) => {
              const sanitized = sanitizeAttemptInput(text);
              setPoints(sanitized ? parseInt(sanitized, 10) : 0);
            }}
          />
          <MaterialCommunityIcons
            name="numeric"
            size={25}
            color="#ffbf18"
            style={styles.iconInsideInput}
          />
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.textLabel}>Submission Type</Text>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              error.some((err) => err.error === "submissionType")
                ? { borderColor: "db4141", borderWidth: 1 }
                : null,
            ]}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <View style={styles.inputRow}>
              <Text style={{ color: submissionType ? "#000" : "#aaa" }}>
                {submissionType}
              </Text>
              <MaterialIcons
                name={dropdownVisible ? "arrow-drop-up" : "arrow-drop-down"}
                size={25}
                color="#ffbf18"
              />
            </View>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownList}>
              {optionValues.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSubmissionType(option);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={{ color: "#333" }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {submissionType !== "Text" && (
          <View>
            <View>
              <Text style={[globalStyles.textLabel, { marginBottom: 10 }]}>
                File Type
              </Text>
            </View>
            <View>
              {[
                "PDF",
                "DOCX",
                "PPTX",
                "MP3",
                "MP4",
                "JPG",
                "PNG",
                "XLSX",
                "TXT",
                "ZIP",
              ].map((fileType) => (
                <TouchableOpacity
                  key={fileType}
                  onPress={() => handleFileTypes(fileType.toLowerCase())}
                  style={{ flexDirection: "row", marginVertical: 3 }}
                >
                  {!fileTypes.includes(fileType.toLowerCase()) ? (
                    <Ionicons
                      name="square-outline"
                      size={20}
                      color="#aaa"
                      style={{ marginRight: 5 }}
                    />
                  ) : (
                    <Ionicons
                      name="checkbox"
                      size={20}
                      color="#ffbf18"
                      style={{ marginRight: 5 }}
                    />
                  )}
                  <Text>{fileType}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <Text style={[globalStyles.textLabel, { marginVertical: 15 }]}>
                File Size
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  fontWeight: 300,
                  marginTop: -10,
                  marginBottom: 15,
                }}
              >
                (max of 60mb per attachment)
              </Text>
            </View>

            <TextInput
              style={[
                styles.dropdown,
                error.some((err) => err.error === "fileSize")
                  ? { borderColor: "#db4141", borderWidth: 1 }
                  : { borderColor: "#ddd" },
                { width: 300, left: 0 },
              ]}
              placeholder="60"
              placeholderTextColor="#aaa"
              multiline={true}
              keyboardType="numeric"
              value={fileSize.toString()}
              onChangeText={(value: string) => {
                const sanitized = sanitizeAttemptInput(value);
                setFileSize(sanitized ? parseInt(sanitized, 10) : 5120);
              }}
              // onChangeText={(value: string) =>
              // 	setFileSize(parseInt(sanitizeAttemptInput(value)))
              // }

              // onChangeText={(value: string) =>
              //   // setFileSize(parseInt(sanitizeAttemptInput(value)))
              //   setFileSize(sanitized ? parseInt(sanitized, 10) : 0);
            />
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={globalStyles.textLabel}>Visibility</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => setVisibility(!visibility)}>
              {visibility ? (
                <FontAwesome5 name="toggle-on" size={30} color="#ffbf18" />
              ) : (
                <FontAwesome5 name="toggle-off" size={30} color="#ddd" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator}></View>

        <Text style={globalStyles.textLabel}>Title</Text>
        <View>
          <TextInput
            style={[
              styles.dropdown,
              error.some((err) => err.error === "title")
                ? { borderColor: "#db4141", borderWidth: 1 }
                : { borderColor: "#ddd" },
              { width: 300 },
            ]}
            placeholder="Enter title"
            placeholderTextColor="#aaa"
            multiline={true}
            value={title}
            onChangeText={setTitle}
          />
          <FontAwesome
            name="pencil-square-o"
            size={20}
            color="#ffbf18"
            style={styles.iconInsideInput}
          />
        </View>
        <View style={{ rowGap: 5 }}>
          <Text style={globalStyles.textLabel}>Description</Text>
          <TextInput
            style={[
              {
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                height: 150,
              },
              error.some((err) => err.error === "description")
                ? { borderColor: "#db4141", borderWidth: 1 }
                : { borderColor: "#ddd" },
            ]}
            textAlignVertical="top"
            placeholder="Enter description..."
            placeholderTextColor="#aaa"
            multiline={true}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            bottom: 0,
            marginTop: 40,
          }}
        >
          <TouchableOpacity
            style={[globalStyles.inactivityButton, { width: "48%" }]}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.inactivityButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.submitButton, { width: "48%" }]}
            onPress={handlePreviewAssignment}
          >
            <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
              {assignmentId ? "Update" : "Create"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    //   </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    height: 3,
    backgroundColor: "#f5f5f5",
    width: 350,
    left: -23,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "55%",
  },
  attemptInputContainer: {
    width: "55%",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 50,
  },
  attemptInput: {
    width: "85%",
  },
  arrowContainer: {
    marginVertical: "auto",
  },
  arrowIcon: {
    marginTop: 0,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    width: "55%",
  },
  dropdownList: {
    position: "absolute",
    top: 55,
    left: 135,
    width: "55%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  attemptContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconInsideInput: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

export default memo(addAssignment);
