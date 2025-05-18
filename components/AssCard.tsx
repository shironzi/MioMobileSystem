import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

interface Availability {
  start: string;
  end: string;
}

interface Points {
  earned: string;
  total: string;
}

const assCard = (props: {
  assignment_id: string;
  attempts: string;
  availability: Availability;
  deadline: string;
  createdAt: string;
  description: string;
  points: Points;
  title: string;
}) => {
  const router = useRouter();

  const formatDate = useCallback(
    (date: string) => {
      const newDate = new Date(date);
      return newDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },
    [Date]
  );

  const formatTime = useCallback(
    (timeStr: string) => {
      const [hourStr, minute] = timeStr.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    },
    [Date]
  );

  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/subject/(sub-details)/assDetails",
          params: {
            assignmentId: props.assignment_id,
            attempts: props.attempts,
            title: props.title,
            description: props.description,
            deadline: props.deadline,
            createdAt: props.createdAt,
            availabilityStart: props.availability.start,
            availabilityEnd: props.availability.end,
            pointsEarned: props.points.earned,
            pointsTotal: props.points.total,
          },
        })
      }
      style={styles.touchableOpacity}
    >
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.yellowBulletin} />
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.score}>
                {props.points.earned}\{props.points.total}
              </Text>
              {/*<Text style={styles.type}>  |  </Text>*/}
            </View>
          </View>
          <View style={styles.rightSection}>
            {/*  <View style={styles.icons}>*/}
            {/*  <TouchableOpacity>*/}
            {/*    <Entypo name="edit" size={15} color="#aaa" style={{marginRight:8}} />*/}
            {/*  </TouchableOpacity>*/}
            {/*  <TouchableOpacity>*/}
            {/*    <Entypo name="trash" size={15} color="#aaa" />*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
            <View style={styles.deadline}>
              <Text>
                {formatDate(props.deadline)}{" "}
                {formatTime(props.availability.end)}
              </Text>
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
