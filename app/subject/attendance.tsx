import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { formattedDate, formatTime12Hour } from "@/utils/DateFormat";
import HeaderConfig from "@/utils/HeaderConfig";
import { getAttendance, getStudentAttendance } from "@/utils/query";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";

const attendanceDetails = () => {
  HeaderConfig("Attendance");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();
  const [attendanceList, setAttendanceList] = useState<
    { id: string; date: string; date_created: string; date_updated?: string }[]
  >([]);
  const [studentAttendance, setStudentAttendance] = useState<
    { date: string; status: string }[]
  >([]);
  const [data, setData] = useState<{ value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAttendanceSelect = (attendanceId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/AddAttendance",
      params: { subjectId: subjectId, attendanceId: attendanceId },
    });
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      const res =
        role === "teacher"
          ? await getAttendance(subjectId)
          : await getStudentAttendance(subjectId);
      if (res.success && role === "teacher") {
        const mapped = Object.entries(res.attendance).map(
          ([id, details]: any) => ({
            id,
            date: details.date,
            date_created: details.date_created,
            date_updated: details.date_updated ?? null,
          }),
        );
        setAttendanceList(mapped);
      }

      if (res.success) {
        setStudentAttendance(res.attendnace);

        setData([
          { value: res.present_count, color: "green" },
          { value: res.absent_count, color: "red" },
          { value: res.late_count, color: "yellow" },
        ]);
      }

      setLoading(false);
    };

    fetchAttendance();
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
    <View style={[globalStyles.container, { flex: 1 }]}>
      <View style={styles.content}>
        {role === "teacher" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 70 }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  router.push({
                    pathname: "/subject/(sub-details)/AddAttendance",
                    params: { subjectId },
                  })
                }
              >
                <View
                  style={{
                    top: 20,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="#ffbf18" />
                  <Text style={styles.addText}>Add Attendance</Text>
                </View>
              </TouchableOpacity>

              {attendanceList.length > 0 ? (
                attendanceList.map((item) => (
                  <TouchableOpacity
                    style={[
                      globalStyles.cardContainer,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                    key={item.id}
                    onPress={() => handleAttendanceSelect(item.id)}
                  >
                    <View style={styles.yellowBulletin}></View>
                    <Text>{formattedDate(item.date)}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No attendance records yet.</Text>
              )}
            </View>
          </ScrollView>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: "auto" }}>
            <PieChart data={data} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", columnGap: 5 }}>
                <View style={styles.labelBox} />
                <Text style={{ fontWeight: "bold" }}>Present</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 5 }}>
                <View style={[styles.labelBox, { backgroundColor: "red" }]} />
                <Text style={{ fontWeight: "bold" }}>Absent</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 5 }}>
                <View
                  style={[styles.labelBox, { backgroundColor: "yellow" }]}
                />
                <Text style={{ fontWeight: "bold" }}>Late</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              globalStyles.cardContainer,
              { marginTop: 20, padding: 0, marginBottom: 70 },
            ]}
          >
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerText]}>Date</Text>
              <Text style={[styles.cell, styles.headerText]}>Time</Text>
              <Text style={[styles.cell, styles.headerText]}>Status</Text>
            </View>
            {studentAttendance.map((item, index) => {
              const [datePart, timePart] = item.date.split(" ");
              const time = formatTime12Hour(timePart);
              const status =
                item.status.charAt(0).toUpperCase() + item.status.slice(1);
              let statusColor = "green";
              if (status === "Late") statusColor = "yellow";
              if (status === "Absent") statusColor = "red";

              return (
                <View style={styles.row} key={index}>
                  <Text style={styles.cell}>{datePart}</Text>
                  <Text style={styles.cell}>{time}</Text>
                  <Text
                    style={[
                      styles.cell,
                      { color: statusColor, fontWeight: 500 },
                    ]}
                  >
                    {status}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  content: {
    rowGap: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    left: -28,
    width: "98%",
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 20,
    height: 60,
    marginVertical: 5,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginLeft: -15,
    marginRight: 15,
    height: 30,
  },
  labelBox: {
    backgroundColor: "green",
    width: 18,
    borderWidth: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: "bold",
  },
});

export default memo(attendanceDetails);
