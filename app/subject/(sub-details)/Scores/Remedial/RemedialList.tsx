import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import React, { useEffect, useState } from "react";
import { getRemedialList, getRemedialListByStudent } from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import RemedialItem from "@/app/subject/(sub-details)/Scores/Remedial/RemedialItem";
import LoadingCard from "@/components/loadingCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";

interface Remedial {
  activity_title: string;
  remedialId: string;
  activityType: string;
  remedials: string[];
}

const RemedialList = () => {
  useHeaderConfig("Scores");

  const { subjectId, role, studentId, firstname } = useLocalSearchParams<{
    subjectId: string;
    role: string;
    studentId: string;
    firstname: string;
  }>();
  const [activeRemedial, setActivityRemedial] = useState<Remedial[]>([]);
  const [inactiveRemedial, setInactivityRemedial] = useState<Remedial[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);

  const handleAddSchedule = () => {
    if (!activeRemedial.length) {
      Alert.alert(
        "No Active Remedials",
        "There are currently no active remedial activities available for this student.",
      );
      return;
    }

    console.log(activityTypes);

    router.push({
      pathname: "/subject/(sub-details)/Scores/Remedial/AddRemedialSchedule",
      params: {
        subjectId,
        studentId,
        activeRemedials: JSON.stringify(activeRemedial),
        activityTypes: JSON.stringify(activityTypes),
        studentName: firstname,
      },
    });
  };

  useEffect(() => {
    const fetchRemedial = async () => {
      const res = studentId
        ? await getRemedialListByStudent(subjectId, studentId)
        : await getRemedialList(subjectId);

      console.log(res);
      if (res.success) {
        setActivityRemedial(res.active_remedials);
        setInactivityRemedial(res.inactive_remedials);
      }

      setLoading(false);
    };

    fetchRemedial();
  }, []);

  useEffect(() => {
    if (activeRemedial.length > 0) {
      const uniqueTypes = Array.from(
        new Set(activeRemedial.map((item) => item.activityType)),
      );
      setActivityTypes(uniqueTypes);
    }
  }, [activeRemedial]);

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
  console.log(firstname);

  return (
    <View style={[{ backgroundColor: "#fff", height: "100%", rowGap: 20 }]}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <View
          style={{
            top: 20,
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons name="add-circle" size={20} color="#ffbf18" />
          <Text style={styles.addText}>Add Remedial Schedule</Text>
        </View>
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 20, rowGap: 20 }}>
        <View style={globalStyles.cardContainer}>
          <Text style={globalStyles.textLabel}>Active</Text>
          <View style={globalStyles.divider}></View>
          {activeRemedial?.map((item, index) => (
            <RemedialItem
              subjectId={subjectId}
              remedialId={item.remedialId}
              activityType={item.activityType}
              remedial={item.remedials}
              activity_title={item.activity_title}
              key={index}
              role={role}
              studentId={studentId}
            />
          ))}
        </View>
        <View style={globalStyles.cardContainer}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
            onPress={() => setIsVisible(!isVisible)}
          >
            <Text style={styles.buttonText}>Archive</Text>
            <AntDesign
              name={isVisible ? "up" : "down"}
              size={24}
              color="#FFBF18"
            />
          </TouchableOpacity>
          {isVisible && <View style={globalStyles.divider}></View>}
          {isVisible && (
            <View>
              {inactiveRemedial ? (
                inactiveRemedial.map((item, index) => (
                  <RemedialItem
                    subjectId={subjectId}
                    remedialId={item.remedialId}
                    activityType={item.activityType}
                    remedial={item.remedials}
                    activity_title={item.activity_title}
                    key={index}
                    role={role}
                    studentId={studentId}
                  />
                ))
              ) : (
                <View style={{ height: 100 }}>
                  <Text>No Active</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    left: -8,
    width: "88%",
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 20,
    height: 60,
    marginVertical: 5,
    marginTop: 20,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default RemedialList;
