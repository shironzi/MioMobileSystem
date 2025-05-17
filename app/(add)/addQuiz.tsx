import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native";
import QuizContainer from "@/components/QuizContainer";
import QuizQuestion from "@/components/QuizQuestion";
import { FontAwesome } from "@expo/vector-icons";


const AddQuiz = () => {
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isTrueFalse, setIsTrueFalse] = useState(false);
  const [isFillInTheBlanks, setIsFillInTheBlanks] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [availabilityFrom, setAvailabilityFrom] = useState<Date | null>(null);
  const [availabilityTo, setAvailabilityTo] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [ques, setQues] = useState('');
  const [points, setPoints] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  const updateQuestionDescription = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].description = text;
    setQuestions(updated);
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex] = text;
    setQuestions(updated);
  };

  const addChoice = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices.push("");
    setQuestions(updated);
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices.splice(cIndex, 1);
    setQuestions(updated);
  };

  const deleteQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  HeaderConfig("Add Quiz");

  return (
    <ScrollView>
        <QuizContainer>
        <Text style={[styles.label, {marginBottom:10}]}>Quiz Type</Text>
        <View style={[styles.row, {marginBottom:-10}]}>
        <Text style={styles.label}>Multiple choice</Text>
         <Switch
            trackColor={{ false: "#ccc", true: "#ffd964" }}
            thumbColor={isMultipleChoice ? "#ffbf18" : "#aaa"}
            onValueChange={() => setIsMultipleChoice(prev => !prev)}
            value={isMultipleChoice}
             />
        </View>
        <View style={[styles.row, {marginBottom:-10}]}>
        <Text style={styles.label}>True/False</Text>
        <Switch
            trackColor={{ false: "#ccc", true: "#ffd964" }}
            thumbColor={isTrueFalse ? "#ffbf18" : "#aaa"}
            onValueChange={() => setIsTrueFalse(prev => !prev)}
            value={isTrueFalse}
        />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Fill in the blanks</Text>
        <Switch
            trackColor={{ false: "#ccc", true: "#ffd964" }}
            thumbColor={isFillInTheBlanks ? "#ffbf18" : "#aaa"}
            onValueChange={() => setIsFillInTheBlanks(prev => !prev)}
            value={isFillInTheBlanks}
        />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={{ color: deadline ? "#000" : "#aaa" }}>
                {deadline ? deadline.toDateString() : "Select deadline"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
            </TouchableOpacity>

            {showDatePicker && (
            <DateTimePicker
                value={deadline || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) setDeadline(selected);
                }}
            />
            )}
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Availability From</Text>
            <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={{ color: availabilityFrom ? "#000" : "#aaa" }}>
                {availabilityFrom ? availabilityFrom.toDateString() : "Select date"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
            </TouchableOpacity>

            {showDatePicker && (
            <DateTimePicker
                value={availabilityFrom || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) setAvailabilityFrom(selected);
                }}
            />
            )}
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Availability To</Text>
             <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={{ color: availabilityTo ? "#000" : "#aaa" }}>
                {availabilityTo ? availabilityTo.toDateString() : "Select date"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
            </TouchableOpacity>

            {showDatePicker && (
            <DateTimePicker
                value={availabilityTo || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) setAvailabilityTo(selected);
                }}
            />
            )}
        </View>
    
        <View style={styles.row}>
        <Text style={styles.label}>Attempts</Text>
        <View style={[styles.dropdown, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
        <Text style={{ color: attempt ? "#000" : "#aaa", fontSize: 16 }}>{attempt || "1"} </Text>

        <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TouchableOpacity
            onPress={() => {
                const numericValue = parseInt(attempt, 10) || 0;
                if (numericValue < 10) {
                setAttempt((numericValue + 1).toString());
                }
            }}
            >
            <MaterialIcons name="arrow-drop-up" size={25} color="#ffbf18" style={{marginTop:-10}}/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {
                const numericValue = parseInt(attempt, 10) || 0;
                if (numericValue > 1) {
                setAttempt((numericValue - 1).toString());
                }
            }}
            >
            <MaterialIcons name="arrow-drop-down" size={25} color="#ffbf18" style={{marginTop:-15, marginBottom:-10}} />
            </TouchableOpacity>
        </View>
        </View>
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Questions</Text>             
        <TextInput
            style={styles.dropdown}
            keyboardType="numeric"
            placeholder="No. of Questions"
            placeholderTextColor="#aaa"
            value={ques}
            onChangeText={setQues}
            />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Points</Text>
        <TextInput
            style={styles.dropdown}
            keyboardType="numeric"
            placeholder="Points"
            placeholderTextColor="#aaa"
            value={points}
            onChangeText={setPoints}
            />
        </View>

        <View style={styles.separator}></View>
    
        <View style={styles.row}>
        <Text style={styles.label}>Title</Text>
        <TextInput
            style={styles.dropdown}
            placeholder="Title"
            placeholderTextColor="#aaa"
            multiline={true}
            value={title}
            onChangeText={setTitle}
            />
        </View>
       
        <View style={styles.row}>
        <Text style={styles.label}>Description</Text>
        <TextInput
            style={styles.dropdown}
            placeholder="Description"
            placeholderTextColor="#aaa"
            multiline={true}
            value={description}
            onChangeText={setDescription}
            />
        </View>
       </QuizContainer>

      {questions.map((question, qIndex) => (
        <QuizQuestion
            key={qIndex}
            question={question}
            qIndex={qIndex}
            totalQuestions={questions.length}
            updateQuestionDescription={updateQuestionDescription}
            handleChoiceChange={handleChoiceChange}
            addChoice={addChoice}
            removeChoice={removeChoice}
            deleteQuestion={deleteQuestion}
  />
      ))}
        {isMultipleChoice && (
        <TouchableOpacity onPress={() => {
            setQuestions([...questions, { type: "multipleChoice", description: "", choices: ["", ""] }]);
        }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
            <FontAwesome name="plus" size={12} color="#ffbf18" style={{ left: 20 }} />
            <Text style={styles.addQuestionText}>Add Multiple Choice</Text>
            </View>
        </TouchableOpacity>
        )}

        {isTrueFalse && (
        <TouchableOpacity onPress={() => {
            setQuestions([...questions, { type: "trueFalse", description: "", choices: [] }]);
        }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
            <FontAwesome name="plus" size={12} color="#ffbf18" style={{ left: 20 }} />
            <Text style={styles.addQuestionText}>Add True/False</Text>
            </View>
        </TouchableOpacity>
        )}

        {isFillInTheBlanks && (
        <TouchableOpacity onPress={() => {
            setQuestions([...questions, { type: "fillInTheBlank", description: "", choices: [] }]);
        }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}>
            <FontAwesome name="plus" size={12} color="#ffbf18" style={{ left: 20 }} />
            <Text style={styles.addQuestionText}>Add Fill in the Blank</Text>
            </View>
        </TouchableOpacity>
        )}

      <TouchableOpacity style={styles.button}>
        <View style={styles.buttonRow}>
            <MaterialIcons name="add" size={20} color="#fff" style={{left:-10}} />
             <Text style={styles.buttonText}>Add Quiz</Text>
         </View>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default memo(AddQuiz);

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2c240",
    marginBottom: 15,
    paddingVertical: 5,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width:"55%"
  },
  separator:{
    height:3,
    backgroundColor:"#f0f0f0",
    width:"113%",
    left:-20,
    top:5,
    marginBottom:20
  },
  buttonRow: {
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
 },
  button: {
    backgroundColor:"#ffbf18",
    padding:14,
    borderRadius:50,
    elevation:5,
    margin:20,
    top:-20
 },
 buttonText: {
    color:"#fff",
    fontWeight:"bold",
    fontSize:16,
    left:0,
    textAlign:"center"
 },
 addQuestionText: {
    color: "#ffbf18",
    textDecorationLine:"underline",
    left:25,
    top:0,
    marginVertical:10,
    paddingVertical:-10
 },
});
