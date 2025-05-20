import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { memo, useState } from "react";
import HeaderConfig from "@/utils/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createAssignment } from "@/utils/query";
import { string } from "yup";
import { useLocalSearchParams } from "expo-router";

interface Availability {
  start: string;
  deadline: string;
}

const addAssignment = () => {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [submissionType, setSubmissionType] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [availabilityFrom, setAvailabilityFrom] = useState<Date | null>(null);
  const [availabilityTo, setAvailabilityTo] = useState<Date | null>(null);
  const [showDatePickerDeadline, setShowDatePickerDeadline] = useState(false);
  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false);
  const [showDatePickerTo, setShowDatePickerTo] = useState(false);
  const [attempt, setAttempt] = useState<string>("3");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddAttempt = () => {
    setAttempt((parseInt(attempt) + 1).toString());
  };
  const handleMinusAttempt = () => {
    if (parseInt(attempt) > 1) {
      setAttempt((parseInt(attempt) - 1).toString());
    }
  };

  const handleAttemptInput = (value: string) => {
    const num = parseInt(value);
    if (!/^\d*$/.test(value)) return; // Prevent non-numeric input

    if (num < 1 && value !== "") {
      setAttempt("1");
    } else {
      setAttempt(value);
    }
  };

  //   const [quizItems, setQuizItems] = useState<{ question: string; answer: string }[]>([]);

  const submissionOptions = ["Text Entry", "File Upload"];

  HeaderConfig("Add Assignment");

  const handleAddAssignment = async () => {
    // should not require null values also the dates should be type of string
    try {
      const { data } = await createAssignment(
        subjectId,
        {
          from: availabilityFrom,
          to: availabilityTo,
        },
        title,
        description,
        parseInt(attempt),
        submissionType,
        deadline,
      );

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

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
              <Text
                style={
                  submissionType
                    ? styles.selectedText
                    : styles.dropdownButtonText
                }
              >
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
            onPress={() => setShowDatePickerDeadline(true)}
          >
            <Text style={{ color: deadline ? "#000" : "#aaa" }}>
              {deadline ? deadline.toDateString() : "Select deadline"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
          </TouchableOpacity>

          {showDatePickerDeadline && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="date"
              display={"default"}
              onChange={(event, selected) => {
                setShowDatePickerDeadline(false);
                if (selected) setDeadline(selected);
              }}
            />
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Availability From</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePickerFrom(true)}
          >
            <Text style={{ color: availabilityFrom ? "#000" : "#aaa" }}>
              {availabilityFrom
                ? availabilityFrom.toDateString()
                : "Select date"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
          </TouchableOpacity>

          {showDatePickerFrom && (
            <DateTimePicker
              value={availabilityFrom || new Date()}
              mode="date"
              display={"default"}
              onChange={(event, selected) => {
                setShowDatePickerFrom(false);
                if (selected) setAvailabilityFrom(selected);
              }}
            />
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Availability To</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePickerTo(true)}
          >
            <Text style={{ color: availabilityTo ? "#000" : "#aaa" }}>
              {availabilityTo ? availabilityTo.toDateString() : "Select date"}
            </Text>
            <MaterialIcons name="date-range" size={22} color="#ffbf18" />
          </TouchableOpacity>

          {showDatePickerTo && (
            <DateTimePicker
              value={availabilityTo || new Date()}
              mode="date"
              display={"default"}
              onChange={(event, selected) => {
                setShowDatePickerTo(false);
                if (selected) setAvailabilityTo(selected);
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.label}>Attempts</Text>
          <View
            style={{
              width: "55%",
              borderWidth: 1,
              borderColor: "#ddd",
              paddingHorizontal: 10,
              borderRadius: 10,
              backgroundColor: "#f9f9f9",
              flexDirection: "row",
              height: 50,
            }}
          >
            <TextInput
              style={{ width: "85%" }}
              value={attempt}
              onChangeText={(value) => handleAttemptInput(value)}
              keyboardType={"numeric"}
            />
            <View style={{ marginVertical: "auto" }}>
              <TouchableOpacity onPress={handleAddAttempt}>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={25}
                  color="#ffbf18"
                  style={{ marginTop: 0 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMinusAttempt}>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={25}
                  color="#ffbf18"
                  style={{ marginTop: -10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
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

        <TouchableOpacity style={styles.button} onPress={handleAddAssignment}>
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
  input: {},
  separator: {
    height: 3,
    backgroundColor: "#f0f0f0",
    width: "113%",
    left: -20,
    top: 5,
    marginBottom: 20,
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
    width: "55%",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffbf18",
    padding: 14,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    left: 5,
  },
});
