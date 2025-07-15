import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { formattedDate } from "@/utils/DateFormat";
import useHeaderConfig from "@/utils/HeaderConfig";
import {
  addAttendance,
  editAttendance,
  getAttendanceById,
  getAttendanceStudents,
} from "@/utils/query";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AddAttendance = () => {
  const { subjectId, attendanceId } = useLocalSearchParams<{
    subjectId: string;
    attendanceId: string;
  }>();
  useHeaderConfig(attendanceId ? "Update Attendance" : "Add Attendance");

  const [students, setStudents] = useState<
    { student_id: string; name: string; status: string | null }[]
  >([]);
  const [emptyStatus, setEmptyStatus] = useState<{ student_id: string }[]>([]);
  const [attendance_id, setAttendanceId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStatusChange = (studentId: string, value: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student_id === studentId
          ? { ...student, status: value }
          : student,
      ),
    );

    setEmptyStatus((prev) =>
      prev.filter((err) => err.student_id !== studentId),
    );
  };

  const handleSubmit = async () => {
    setEmptyStatus([]);
    const empty = students.filter((s) => !s.status || s.status === "select");

    if (empty.length > 0) {
      const emptyIds = empty.map((s) => ({ student_id: s.student_id }));
      setEmptyStatus(emptyIds);
      return;
    }

    const payload = students
      .filter((s) => s.status && s.status !== "select")
      .map(({ student_id, status }) => ({
        student_id,
        status: status!.toLowerCase(),
      }));

    setIsSubmitting(true);
    const res = attendanceId
      ? await editAttendance(subjectId, attendance_id, payload)
      : await addAttendance(subjectId, attendance_id, payload);

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
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

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const res = attendanceId
        ? await getAttendanceById(subjectId, attendanceId)
        : await getAttendanceStudents(subjectId);

      if (res.success) {
        const studentEntries = Object.entries(res.students).map(
          ([id, info]: any) => ({
            student_id: id,
            name:
              info.first_name || info.last_name
                ? `${info.first_name ?? ""} ${info.last_name ?? ""}`.trim()
                : info.name?.trim() || "No Name",
            status: info.status ?? null,
          }),
        );
        setAttendanceId(res.attendance_id);
        setDate(res.date);
        setStudents(studentEntries);
        setLoading(false);
      }
    };

    fetchStudents();
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.container, { flex: 1 }]}
    >
      <View style={[globalStyles.cardContainer, { marginBottom: 50 }]}>
        <View>
          <Text style={[globalStyles.text1, { fontSize: 20 }]}>Attendance</Text>
          <Text style={styles.dateText}>{formattedDate(date)}</Text>
          <View style={styles.divider}></View>
        </View>

        {students.map((student) => (
          <View style={styles.row} key={student.student_id}>
            <Text style={styles.name}>{student.name}</Text>
            <View
              style={[
                styles.pickerContainer,
                student.status === "present"
                  ? styles.present
                  : student.status === "absent"
                    ? styles.absent
                    : student.status === "late" && styles.late,
                student.status === "select" && { borderColor: "#aaa" },
                emptyStatus.some(
                  (s) => s.student_id === student.student_id,
                ) && {
                  borderColor: "#db4141",
                },
              ]}
            >
              <Picker
                selectedValue={student.status || "select"}
                onValueChange={(value) =>
                  handleStatusChange(student.student_id, value)
                }
                mode={"dropdown"}
                dropdownIconColor={"none"}
              >
                <Picker.Item label={"Select"} value={"select"} />
                <Picker.Item label={"Present"} value={"present"} />
                <Picker.Item label={"Late"} value={"late"} />
                <Picker.Item label={"Absent"} value={"absent"} />
              </Picker>
            </View>
          </View>
        ))}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            top: 10,
            // bottom: 10,
            // marginTop: 70,
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
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={[globalStyles.submitButtonText, { top: 3 }]}>
              {attendanceId
                ? isSubmitting
                  ? "Updating...."
                  : "Update"
                : isSubmitting
                  ? "Submitting..."
                  : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateText: { fontSize: 14, fontWeight: 300, marginBottom: 20 },
  row: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  name: { flex: 1, fontSize: 14 },
  pickerContainer: {
    backgroundColor: "#ddd",
    borderRadius: 6,
    width: 140,
    height: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#aaa",
  },
  picker: {
    fontSize: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: -25,
    marginBottom: 20,
  },
  present: {
    backgroundColor: "#2D861B7D",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#2D861B",
  },
  absent: {
    backgroundColor: "#FF564680",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#F21818",
  },
  late: {
    backgroundColor: "#FFBF184F",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#FAD573",
  },
});

export default AddAttendance;
