import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";

const addAssignment = () => {
  const [submissionType, setSubmissionType] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [availabilityFrom, setAvailabilityFrom] = useState<Date | null>(null);
  const [availabilityTo, setAvailabilityTo] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

//   const [quizItems, setQuizItems] = useState<{ question: string; answer: string }[]>([]);

  const submissionOptions = ['Text Entry', 'File Upload'];

  HeaderConfig("Add Assignment");

  return (
    <ScrollView>
        <View style={styles.container}>
        <View style={styles.row}>
        <Text style={styles.label}>Submission Type</Text>
    
        <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
        >
            <View style={styles.inputRow}>
            <Text style={submissionType ? styles.selectedText : styles.dropdownButtonText}>
                {submissionType || "Text Entry"}
            </Text>
            <MaterialIcons
                name={dropdownVisible ? "arrow-drop-up" : "arrow-drop-down"}
                size={25}
                color="#ffbf18"
            />
            </View>
        </TouchableOpacity>
        </View>
    
        {dropdownVisible && (
        <View style={styles.dropdownList}>
            {submissionOptions.map((option) => (
            <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                setSubmissionType(option);
                setDropdownVisible(false);
                }}
            >
                <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
            ))}
        </View>
        )}

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
            <Text style={{ color: attempt ? "#000" : "#aaa", fontSize: 16 }}>
                {attempt || "1"}
             </Text>

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

        {submissionType === 'File Upload' && (
            <View style={styles.row}>
            <Text style={styles.label}>File Upload</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={async () => {
                try {
                    const result = await DocumentPicker.getDocumentAsync({
                    type: '*/*', 
                    copyToCacheDirectory: true,
                    });
                    if (!result.canceled) {
                    if (result.assets && result.assets.length > 0) {
                        console.log('File selected:', result.assets[0].uri);
                    }
                    }
                } catch (error) {
                    console.error('Error picking file:', error);
                }
                }}
            >
                <Text style={{ color: "#aaa" }}>Choose File</Text>
                <MaterialIcons name="attach-file" size={22} color="#ffbf18" />
            </TouchableOpacity>
            </View>
        )}
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
    
       

        <TouchableOpacity style={styles.button}>
            <View style={styles.buttonRow}>
                <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Assignment</Text>
        </View>

      </TouchableOpacity>

        </View>

    </ScrollView>
    
  );
};

export default memo(addAssignment);

const styles = StyleSheet.create({
container: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    position: "relative", 
},
row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
},
input:{

},
separator:{
    height:3,
    backgroundColor:"#f0f0f0",
    width:"113%",
    left:-20,
    top:5,
    marginBottom:20
  },
inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
},
label: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
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
dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    width: "55%",
},
dropdownButtonText: {
    color: "#aaa",
},
selectedText: {
    color: "#000",
},
dropdownList: {
    position: "absolute",
    top: 75, 
    left: 161, 
    width: "55%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    zIndex: 999,
},
dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
},
dropdownItemText: {
    color: "#333",
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
    elevation:5
},
buttonText: {
    color:"#fff",
    fontWeight:"bold",
    fontSize:16,
    left:5
}
      
});
