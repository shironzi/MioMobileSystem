import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import {
  addAttendance,
  editAttendance,
  getAttendanceById,
  getAttendanceStudents,
} from "@/utils/query";
import { formattedDate } from "@/utils/DateFormat";

const AddAttendance = () => {
  useHeaderConfig("Add Attendance");

  const { subjectId, attendanceId } = useLocalSearchParams<{
    subjectId: string;
    attendanceId: string;
  }>();

  const [students, setStudents] = useState<
    { student_id: string; name: string; status: string | null }[]
  >([]);
  const [emptyStatus, setEmptyStatus] = useState<{ student_id: string }[]>([]);
  const [attendance_id, setAttendanceId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

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
                : info.name?.trim() || "(No Name)",
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
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={[globalStyles.cardContainer]}>
        <View>
          <Text>Attendance</Text>
          <Text style={styles.dateText}>today, {formattedDate(date)}</Text>
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
                student.status === "select" && { borderColor: "#828282" },
                emptyStatus.some(
                  (s) => s.student_id === student.student_id,
                ) && {
                  borderColor: "red",
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

        <TouchableOpacity
          style={globalStyles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateText: { fontSize: 16, color: "#888", marginBottom: 10 },
  row: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  name: { flex: 1, fontSize: 14 },
  pickerContainer: {
    backgroundColor: "#82828257",
    borderRadius: 6,
    width: 140,
    overflow: "hidden",
    borderWidth: 1,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -20,
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
