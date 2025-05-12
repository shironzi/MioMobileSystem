import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import {useRouter} from "expo-router";
import HeaderConfig from "@/components/HeaderConfig";


const data = [
    {
      id: 1,
      title: "Activity 1",
      deadline: "January 12, 2024",
      points: 50,
      availability: "January 11, 2024 9:00 AM - January 12, 2024 9:00 AM",
      attempt: 1,
      type:"File Upload"
    },
  ];

const ques = "Define what is oralism in a paragraph."

const viewAss = () => {
    const router = useRouter();
    const [answer, setAnswer] = useState("");
    HeaderConfig("Activity 1");
    return (
        <ScrollView>
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
                 <Text style={styles.type}>Type: {item.type}</Text>
                </View>
              </Card>
            <View style={styles.question}>
                <View style={styles.header}></View>
                <Text style={styles.headerText}>Question</Text>
                <Text style={styles.quesText}>{ques}</Text>
                <TextInput
                style={styles.quesAnswer}
                placeholder="Your answer..."
                placeholderTextColor="#aaa"
                multiline={true}
                value={answer}
                onChangeText={setAnswer}
                />                

            </View>
              <TouchableOpacity style={styles.button} >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
             
            </View>
          ))}
        </View>

        </ScrollView>

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
    elevation:5,
    paddingBottom:-10
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  question: {
    marginTop:20,
    margin:10,
    padding:10,
    backgroundColor:"#fff",
    borderRadius:10,
    elevation:5,
    borderWidth:0
  },
  header: {
    height:50,
    backgroundColor:"#1f1f1f",
    margin:-10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    marginBottom:10
  },
  headerText: {
    color:"#fff",
    fontSize:18,
    fontWeight:"bold",
    top:-48,
    left: 10
  },
  quesText: {
    fontSize: 14,
    padding:10,
    top:-30
  },
  quesAnswer:{
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
    textAlignVertical: "top",
    top:-33,
    margin:8,
    marginBottom:-15
  }
});

export default memo(viewAss);
