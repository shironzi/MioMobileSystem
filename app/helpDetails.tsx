import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const helpDetails = () => {
  const [issue, setIssue] = useState("");

  HeaderConfig("Help & Support");
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Report an Issue</Text>
        <MaterialIcon
          name="plagiarism"
          size={90}
          color="#ffbf18"
          style={{ marginBottom: 10, alignSelf: "center", margin: 20 }}
        />
        <Text style={styles.description}>
          Is there anything wrong with the app?
        </Text>
      </View>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          placeholder="State the issue you are experiencing.."
          placeholderTextColor="#aaa"
          value={issue}
          onChangeText={setIssue}
          multiline={true}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.button}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
    width: "100%",
  },
  inputCard: {
    left: -15,
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    height: 250,
    elevation: 5,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    color: "#000",
    height: 100,
    textAlignVertical: "top",
    width: "100%",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ffbf18",
    color: "#fff",
    padding: 15,
    borderRadius: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    elevation: 5,
  },
});

export default memo(helpDetails);
