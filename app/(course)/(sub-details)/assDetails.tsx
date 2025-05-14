import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderConfig from "@/components/HeaderConfig";
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
    type: "Quiz",
  },
];

const assDetails = () => {
  HeaderConfig("Assignment");
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const assignmentId = parseInt(id as string);
  const selectedAssignment = data.find((item) => item.id === assignmentId);
  const answerTemp = "Oralism is an approach to use speaking rather than sign language"

  const [lastAttemptVisible, setLastAttemptVisible] = useState(false);

  if (!selectedAssignment) return <Text>Assignment not found</Text>;

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
          <Text style={styles.buttonText}>
            {selectedAssignment.type === "File Upload" ? "Upload File" : "Take Quiz"}
          </Text>
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

        {lastAttemptVisible && (
        <>
          {selectedAssignment.type === 'File Upload' ? (
            <View style={{marginTop: 10 }}>
              <View style={{flexDirection:"row", justifyContent:"space-between", top:-5}}>
                <Text style={{left:10, fontSize:14}}>File 1</Text>
                <TouchableOpacity>
                <Text style={{color:"#ffbf18", fontWeight:500,left:-190, textDecorationLine:"underline" }}>image.pdf</Text>
                <MaterialIcons name="download" size={20} color="#ffbf18" style={{left:43, top:-20}} />
                </TouchableOpacity>

              </View>
     
              <View style={styles.imageContainer}>
                <Text style={{margin:15, fontSize:14, top:-10, left:-10}}>Preview of image.pdf</Text>
                <FontAwesome name="times" size={20} color="#808080" style={{ position: "absolute", right: 10, top: 15 }} />
                
                <ScrollView style={{ height: 440 }}>
                  <Image
                    source={require("@/assets/1.png")}
                    style={{ width: "100%", height: 800, alignSelf: "center", }}
                    resizeMode="stretch"
                  />
                </ScrollView>
            </View>
          
            </View>
          ) : (
            <TextInput
              style={styles.textInput}
              value={answerTemp}
              editable={false}
              multiline
            />
          )}
        </>
      )}
      
      </View>
  
      
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
    backgroundColor: "#eee",
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
