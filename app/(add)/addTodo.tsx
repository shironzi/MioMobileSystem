import React, { useState, memo } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import HeaderConfig from "@/components/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddTodo = () => {
  const [subject, setSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [subjectVisible, setSubjectVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const subjects = ["Math", "Science", "Speech", "Auditory"];
  HeaderConfig("Add To Do");

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>Subject</Text>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setSubjectVisible(!subjectVisible)}
          >
            <Text style={subject ? styles.selectedText : styles.placeholderText}>
              {subject || "Select Subject"}
            </Text>
            <MaterialIcons
              name={subjectVisible ? "arrow-drop-up" : "arrow-drop-down"}
              size={25}
              color="#ffbf18"
            />
          </TouchableOpacity>
          {subjectVisible && (
            <View style={styles.dropdownMenu}>
              {subjects.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSubject(item);
                    setSubjectVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: selectedDate ? "#000" : "#aaa" }}>
            {selectedDate ? selectedDate.toDateString() : "Select date"}
          </Text>
          <MaterialIcons name="date-range" size={22} color="#ffbf18" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              setShowDatePicker(false);
              if (selected) setSelectedDate(selected);
            }}
          />
        )}

        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: selectedTime ? "#000" : "#aaa" }}>
            {selectedTime
              ? selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Select time"}
          </Text>
          <MaterialIcons name="access-time" size={22} color="#ffbf18" />
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              setShowTimePicker(false);
              if (selected) setSelectedTime(selected);
            }}
          />
        )}

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Input Title"
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={2}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Input Details"
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={6}
          value={details}
          onChangeText={setDetails}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(AddTodo);

const styles = StyleSheet.create({
    container: {
      margin: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: 16,
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
    },
    placeholderText: {
      color: "#aaa",
      fontSize: 14,
    },
    selectedText: {
      color: "#000",
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
      fontSize: 14,
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
      fontSize: 14,
      textAlignVertical: "top",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: "#ffbf18",
      backgroundColor: "#ffffff",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 50,
      width: "45%",
      elevation: 3,
    },
    cancelText: {
      color: "#ffbf18",
      fontWeight: "bold",
      textAlign: "center",
    },
    sendButton: {
      backgroundColor: "#ffbf18",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 50,
      width: "45%",
      elevation: 3,
    },
    sendText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    dropdownMenu: {
      position: "absolute",
      top: 55,
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      zIndex: 10,
      // elevation: 5,
    },
    dropdownItem: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: "#eee",
    },
  });
  