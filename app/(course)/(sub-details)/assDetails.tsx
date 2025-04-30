import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Card } from "@rneui/themed";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "Activity 1",
    deadline: "January 12, 2024",
    points: 50,
    availability: "January 11, 2024 9:00 AM - January 12, 2024 9:00 AM",
    attempt: 1,
  },
];

const assDetails = () => {
  HeaderConfig("Assignment");

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id}>
          <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.row}>
                <Text style={styles.deadline}>Deadline: {item.deadline}</Text>
                <Text style={styles.points}>Points: {item.points}</Text>
              </View>
              <Text style={styles.availability}>
                Availability: {item.availability}
              </Text>
              <Text style={styles.attempt}>Attempts: {item.attempt}</Text>
            </View>
          </Card>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Take Quiz</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 0,
    shadowColor: "transparent",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    color: "#000",
    marginBottom: 15,
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
  availability: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
  },
  attempt: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    margin: 10,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(assDetails);
