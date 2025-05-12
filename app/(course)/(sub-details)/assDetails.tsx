import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import {useRouter} from "expo-router";
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
  },
];

const assDetails = () => {
  const [lastAttempt, setLastAttempt] = useState("");

  const router = useRouter();
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
            <TouchableOpacity style={styles.button} onPress={()=>router.push("viewAssFile")}>
            <Text style={styles.buttonText}>Take Quiz</Text>
          </TouchableOpacity>
          </Card>

          <View style={styles.attemptCard}>
            <Text style={styles.last}>Last Attempt</Text>
            <View style={styles.attemptRow}>
              <Text style={styles.view}>View Answer</Text>
              <TouchableOpacity>
              <MaterialIcons name={lastAttempt ? "arrow-drop-up" :  "arrow-drop-down"} 
              color="#ffbf18" size={25} style={{top:5}}/>
              </TouchableOpacity>
              
            </View>
            

          </View>

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
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    elevation:5,
    paddingBottom:-10,
    marginBottom:10
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin:10
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
  button: {
    backgroundColor: "#FFBF18",
    margin: 10,
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginTop: -5,
    marginBottom:15
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
    elevation:5,
    paddingBottom:-10
  },
  last: {
    left:8,
    fontSize:16,
    fontWeight:500,  
    
  },
  view: {
    left:8,
    marginTop:8,
    fontSize:14,
    color:"#2264dc",
    textDecorationLine:"underline",
    marginBottom:15,
    marginRight:13
    
  },
  attemptRow: {
    flexDirection: "row"

  }
    
});

export default memo(assDetails);
