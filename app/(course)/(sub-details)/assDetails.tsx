import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderConfig from "@/components/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";

const data = [
  {
    id: 1,
    title: "Activity 1",
    deadline: "January 12, 2024",
    points: 50,
    availability: "January 11, 2024 9:00 AM - January 12, 2024 9:00 AM",
    attempt: 1,
    type: "File Upload",
  },
  {
    id: 2,
    title: "Activity 2",
    deadline: "January 15, 2024",
    points: 100,
    availability: "January 14, 2024 9:00 AM - January 15, 2024 9:00 AM",
    attempt: 2,
    type: "Quiz",
  },
];

const assDetails = () => {
  HeaderConfig("Assignment");
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const assignmentId = parseInt(id as string);
  const selectedAssignment = data.find((item) => item.id === assignmentId);

  const [lastAttemptVisible, setLastAttemptVisible] = useState(false);

  if (!selectedAssignment) return <Text>Assignment not found</Text>;

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{selectedAssignment.title}</Text>
          <View style={styles.row}>
            <Text style={styles.deadline}>Deadline: {selectedAssignment.deadline}</Text>
            <Text style={styles.points}>Points: {selectedAssignment.points}</Text>
          </View>
          <Text style={styles.availability}>Availability: {selectedAssignment.availability}</Text>
          <Text style={styles.attempt}>Attempts: {selectedAssignment.attempt}</Text>
          <Text style={styles.type}>Type: {selectedAssignment.type}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            selectedAssignment.type === "File Upload"
              ? router.push("viewAssFile")
              : router.push("viewAss")
          }
        >
          <Text style={styles.buttonText}>
            {selectedAssignment.type === "File Upload" ? "Upload File" : "Take Quiz"}
          </Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.attemptCard}>
      <Text style={styles.last}>Last Attempt</Text>
        <TouchableOpacity onPress={() => setLastAttemptVisible(!lastAttemptVisible)}>
        <View style={styles.attemptRow}>
        <Text style={styles.view}>View Answer</Text>
        
        <MaterialIcons
              name={lastAttemptVisible ? "arrow-drop-up" : "arrow-drop-down"}
              color="#ffbf18"
              size={25}
              style={{ top:-2 }}
            />
           </View>

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
    elevation: 5,
    marginBottom: 10,
  },
  cardContent: {
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
    fontSize: 14,
    color: "#000",
    marginRight: 10,
  },
  points: {
    fontSize: 14,
    color: "#000",
  },
  availability: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
  },
  attempt: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  type: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    margin: 10,
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginTop: -5,
    marginBottom: 15,
    elevation:5
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  attemptCard: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    elevation: 5,
  },
  last: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  view: {
    fontSize: 14,
    color: "#2264dc",
    textDecorationLine: "underline",
    marginTop: 8,
    marginBottom: 15,
    marginRight: 13,
    marginLeft: 8,
  },
  attemptRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:-10
    
  },

});

export default memo(assDetails);
