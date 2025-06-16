import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getAttendance } from "@/utils/query";
import globalStyles from "@/styles/globalStyles";
import { formattedDate } from "@/utils/DateFormat";

const attendanceDetails = () => {
  HeaderConfig("Attendance");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();
  const [attendanceList, setAttendanceList] = useState<
    { id: string; date: string; date_created: string; date_updated?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const handleAttendanceSelect = (attendanceId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/AddAttendance",
      params: { subjectId: subjectId, attendanceId: attendanceId },
    });
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await getAttendance(subjectId);
      if (res?.success && res.attendance) {
        const mapped = Object.entries(res.attendance).map(
          ([id, details]: any) => ({
            id,
            date: details.date,
            date_created: details.date_created,
            date_updated: details.date_updated ?? null,
          }),
        );
        setAttendanceList(mapped);
        setLoading(false);
      }
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
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { flex: 1 }]}>
      <ScrollView>
        <View style={styles.content}>
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
      {role && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push({
              pathname: "/subject/(sub-details)/AddAttendance",
              params: { subjectId },
            });
          }}
        >
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
});

export default memo(attendanceDetails);
