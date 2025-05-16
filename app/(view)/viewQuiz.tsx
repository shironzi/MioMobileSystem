import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderConfig from "@/components/HeaderConfig";
import { RadioButton } from "react-native-paper"; 

const data = [
    {
      id: 1,
      title: "Quiz 1",
      deadline: "January 12, 2024",
      points: 50,
      availability: "January 11, 2024 9:00 AM - January 12, 2024 9:00 AM",
      attempt: 1,
      type: "Multiple Choice, True/False, Fill in the Blank",
    },
  ];

const quizDetails = () => {
    HeaderConfig("Quiz");
    const [textEntry, setTextEntry] = useState("");
    const [selectedChoice, setSelectedChoice] = useState<any>({}); 

    const questions = [
        {
            id: 1,
            question: "What is the capital of France?",
            type: "multipleChoice",
            choices: ["A. Paris", "B. London", "C. Berlin", "D. Madrid"],
            answer: "Paris",
        },
        {
            id: 2,
            question: "Is the sky blue?",
            type: "trueFalse",
            answer: "True",
        },
        {
            id: 3,
            question: "The capital of Japan is _____",
            type: "fillInTheBlank",
            answer: "Tokyo",
        },
    ];
    const quizDesc ="Hello Learners! \n" + "This quiz is composed of multiple choice, true/false and fill in the blanks. Choose the correct answer. Good luck!";
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
                    <Text style={styles.type}>Quiz Type: {item.type}</Text>
                    </View>
                    </Card>

                    <View style={styles.quesHeader}>
                        <View>
                            <View style={styles.header}></View>
                            <Text style={[{top:-50, color:"#fff", fontWeight:500, fontSize:18, alignItems:"center", left:10}]}>Quiz Description</Text>
                        </View>
                        <Text style={{marginTop:-30, lineHeight:20, left:10}}>{quizDesc}</Text>
                    </View>

                    {questions.map((question, index) => (
                    <View key={question.id} style={styles.quesHeader}>
                        <View>
                        <View style={styles.header}></View>
                        <Text
                            style={styles.headerText}> Question {index + 1}
                        </Text>
                        </View>
                        <Text style={{ marginTop: -25, lineHeight: 20, left: 10, marginBottom: 10 }}>
                        {index + 1}. {question.question}
                        </Text>

                        {question.type === "multipleChoice" && (
                        question.choices?.map((choice, choiceIndex) => (
                            <View key={choiceIndex} style={styles.choiceContainer}>
                            <View style={{ transform: [{ scale: 0.7}] }} >
                            <RadioButton
                                uncheckedColor="#aaa"
                                color="#ffbf18"
                                value={choice}
                                status={selectedChoice[question.id] === choice ? "checked" : "unchecked"}
                                onPress={() =>
                                setSelectedChoice((prev: Record<number, string>) => ({ ...prev, [question.id]: choice }))
                                }
                                
                            />
                            </View>
                            <Text style={styles.choiceText}>{choice}</Text>
                            </View>
                        ))
                        )}

                        {question.type === "trueFalse" && (
                        <View>
                            <View style={styles.choiceContainer}>
                            <View style={{ transform: [{ scale: 0.7}] }} >
                            <RadioButton
                                value="True"
                                status={selectedChoice[question.id] === "True" ? "checked" : "unchecked"}
                                onPress={() =>
                                setSelectedChoice((prev: Record<number, string>)=> ({ ...prev, [question.id]: "True" }))
                                }
                                color="#ffbf18"
                                uncheckedColor="#aaa"
                            />
                            </View>
                            <Text style={styles.choiceText}>True</Text>
                            </View>
                            <View style={styles.choiceContainer}>
                            <View style={{ transform: [{ scale: 0.7}] }} >
                            <RadioButton
                                value="False"
                                status={selectedChoice[question.id] === "False" ? "checked" : "unchecked"}
                                onPress={() =>
                                setSelectedChoice((prev: Record<number, string>)=> ({ ...prev, [question.id]: "False" }))
                                }
                                color="#ffbf18"
                                uncheckedColor="#aaa"
                            />
                            </View>
                            <Text style={styles.choiceText}>False</Text>
                            </View>
                        </View>
                        )}

                        {question.type === "fillInTheBlank" && (
                        <TextInput
                            style={styles.quesAnswer}
                            placeholder="Your answer..."
                            placeholderTextColor="#aaa"
                            multiline={true}
                            value={textEntry}
                            onChangeText={setTextEntry}
                        />
                        )}
                    </View>
                    ))}

                </View>
                 ))}
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    )


};

export default memo(quizDetails);

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
      margin: 20,
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
    quesHeader: {
      padding: 15,
      margin: 10,
      borderRadius: 10,
      backgroundColor: "#fff",
      borderWidth: 0,
      elevation: 5,
    },
    header: {
        backgroundColor: "#1f1f1f",
        height: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        top:-15,
        left:-15,
        width: 353,
    },
    headerText:{
        top: -50,
        color: "#fff",
        fontWeight: 500,
        fontSize: 18,
        alignItems: "center",
        left: 10,
    },
    quesAnswer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        width: "94%",
        marginBottom:5, 
        marginHorizontal: 10,
    },
    choiceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        padding: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
    },
    choiceText: {
        fontSize: 14,
        color: "#000",
        marginLeft: 0,
    },
  
  });