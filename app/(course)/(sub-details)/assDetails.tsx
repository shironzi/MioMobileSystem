import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useCallback } from "react";
import { Card } from "@rneui/themed";
import HeaderConfig from "@/components/HeaderConfig";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";


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
    type: "Text Entry",
  },
];

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
  return (
    <ScrollView>
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
          <Text style={styles.type}>Submission Type: {selectedAssignment.type}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            selectedAssignment.type === "File Upload"
              ? router.push("viewAssFile")
              : router.push("viewAss")
          }
        >
          {/* <Text style={styles.buttonText}>
            {selectedAssignment.type === "File Upload" ? "Upload File" : "Start Assignment"}
          </Text> */}
          <Text style={styles.buttonText}>Start Assignment</Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.attemptCard}>
      <Text style={styles.last}>Latest Attempt</Text>
        <TouchableOpacity onPress={() => setLastAttemptVisible(!lastAttemptVisible)}>
        <View style={styles.attemptRow}>
        <Text style={styles.view}>View Attempt</Text>
        
        <MaterialIcons
              name={lastAttemptVisible ? "arrow-drop-up" : "arrow-drop-down"}
              color="#ffbf18"
              size={25}
              style={{ top:-2 }}
            />
           </View>

        </TouchableOpacity>

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
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.row}>
              <Text style={styles.deadline}>
                Deadline: {formatDate(deadline)}
              </Text>
              <Text style={styles.points}>Points: {pointsTotal}</Text>
              </View>
     
              <View style={styles.imageContainer}>
              <View style={{backgroundColor:"#eee", height:50, margin:0, padding:0, top:-10,
                 width:321, left:-10, borderTopLeftRadius:10, borderTopRightRadius:10}}>
                  <Text style={{ fontSize: 14, top: 15, left: 15, color:"#000" }}>Preview of image.pdf</Text>
                  </View>
              
              <FontAwesome name="times" size={20} color="#808080" style={{ position: "absolute", right: 10, top: 15 }} />
              
              <ScrollView
                style={{ height: 300 }}
                // contentContainerStyle={{ alignItems: "center" }}
                showsVerticalScrollIndicator={true}
              >
                <Image
                  source={require("@/assets/1.png")}
                  style={{ width: "100%" }}
                  resizeMode="cover"
                />
              </ScrollView>
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
        </Card>
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
  textInput:{
    backgroundColor:"#f5f5f5",
    borderRadius:10,
    borderColor:"#ddd",
    borderWidth:1,
    paddingHorizontal:10,
    marginHorizontal:5,
    marginTop:10
  }, 
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    top: -10,
    height: 300,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom:10,
    position: "relative",
    borderColor:"#aaa",
    borderWidth:1
  }
 
});

export default memo(assDetails);
