import React, { useState, memo } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import HeaderConfig from "@/components/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";

const AddMessage = () => {
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [subjectVisible, setSubjectVisible] = useState(false);
  const [toVisible, setToVisible] = useState(false);

  const subjects = ["Math", "Science", "Speech", "Auditory"];
  const recipients = ["All", "Ava Arce", "Aaron Baon", "Jorell Finez", "Julia Mendoza"];

  HeaderConfig("Add Message");

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
              <MaterialIcons name={subjectVisible ? "arrow-drop-up" :  "arrow-drop-down"}
               size={25}
               color="#ffbf18"/>
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

        <Text style={styles.label}>To</Text>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setToVisible(!toVisible)}
          >
            <Text style={to ? styles.selectedText : styles.placeholderText}>
              {to || "Select Names (ex. All)"}
            </Text>
        
            <MaterialIcons name={toVisible ? "arrow-drop-up" :  "arrow-drop-down"}
            size={25}
            color="#ffbf18"/>
                
          </TouchableOpacity>
          {toVisible && (
            <View style={styles.dropdownMenu}>
              {recipients.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setTo(item);
                    setToVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Input Message"
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(AddMessage);

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
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
