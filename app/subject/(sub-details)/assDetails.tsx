import HeaderConfig from "@/components/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const assDetails = () => {
  HeaderConfig("Assignment");

  const {
    title,
    deadline,
    createdAt,
    availabilityStart,
    availabilityEnd,

    attempts,
    pointsTotal,
  } = useLocalSearchParams<{
    title: string;
    deadline: string;
    createdAt: string;
    availabilityStart: string;
    availabilityEnd: string;
    attempts: string;
    pointsTotal: string;
  }>();

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
    <View style={styles.container}>
      <View>
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.row}>
              <Text style={styles.deadline}>
                Deadline: {formatDate(deadline)}
              </Text>
              <Text style={styles.points}>Points: {pointsTotal}</Text>
            </View>
            <View style={styles.availabilityContainer}>
              <Text>Availability: </Text>
              <Text style={styles.availability}>
                {formatDate(deadline)} {formatTime(availabilityStart)} -{" "}
                {formatDate(createdAt)} {formatTime(availabilityEnd)}
              </Text>
            </View>

            <Text style={styles.attempt}>Attempts: {attempts}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  cardContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    // shadowColor: "transparent",
    elevation: 5,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 10,
  },
  title: {
    fontSize: 20,
    color: "#2264dc",
    marginBottom: 15,
    fontWeight: "bold",
    marginTop: -5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  deadline: {
    fontSize: 16,
    color: "#000",
    marginRight: 10,
  },
  points: {
    fontSize: 16,
    color: "#000",
  },
  availabilityContainer: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
    maxWidth: "80%",
    flexDirection: "row",
  },
  availability: {
    flexWrap: "wrap",
    maxWidth: "80%",
  },
  attempt: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    margin: 10,
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default memo(assDetails);
