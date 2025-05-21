import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Availability {
  start: string;
  deadline: string;
}

const assCard = (props: {
  assignment_id: string;
  subjectId: string;
  attempts: string;
  availability: Availability;
  createdAt: string;
  description: string;
  totalPoints: string;
  title: string;
  submission_type: string;
  role: string;
}) => {
  const router = useRouter();

  const handleSelect = () => {
    if (props.role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/assignment/addAssignment",
        params: {
          subjectId: props.subjectId,
          assignmentId: props.assignment_id,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/assignment/assignmentDetails",
        params: {
          assignmentId: props.assignment_id,
          attempts: props.attempts,
          title: props.title,
          description: props.description,
          createdAt: props.createdAt,
          availabilityStart: props.availability.start,
          availabilityEnd: props.availability.deadline,
          totalPoints: props.totalPoints,
          submission_type: props.submission_type,
        },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleSelect} style={styles.touchableOpacity}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.yellowBulletin} />
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.score}>- / {props.totalPoints}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <View style={styles.deadline}>
              <Text style={{ color: "red" }}>Not Yet Submitted</Text>
            </View>
            <Entypo name="chevron-small-right" size={30} color="#aaa" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    top: 15,
  },
  cardContainer: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
    borderRadius: 16,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  yellowBulletin: {
    width: "1.5%",
    height: 55,
    backgroundColor: "#FFBF18",
    borderRadius: 3,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 13,
    color: "#888",
  },
  type: {
    fontSize: 13,
    color: "#888",
  },
  deadline: {
    marginVertical: "auto",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    textAlign: "right",
  },
  icons: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    top: -8,
  },
});

export default memo(assCard);
