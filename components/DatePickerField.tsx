import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import globalStyles from "@/styles/globalStyles";

type DatePickerFieldProps = {
  date: string | Date | null;
  onChange: (d: Date) => void;
  error?: boolean;
  style?: StyleProp<ViewStyle>;
  mode?: "date" | "time" | "datetime";
};

export function DatePickerField({
  date,
  onChange,
  error = false,
  style,
  mode = "date",
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  let newDate: Date | null = null;
  if (date instanceof Date) {
    newDate = new Date(date);
  }

  newDate = newDate ?? new Date();

  const formatToLongDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          style,
          error
            ? { borderColor: "red", borderWidth: 1 }
            : { borderColor: "#ddd", borderWidth: 1 },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: date ? "#000" : "#aaa" }}>
          {date instanceof Date ? formatToLongDate(date) : date ? date : ""}
        </Text>
        <MaterialIcons name="date-range" size={22} color="#ffbf18" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={newDate}
          mode={mode}
          display="default"
          onChange={(_, selected) => {
            setShowPicker(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </>
  );
}

const addAssignment = () => {
  const [quizInfo, setQuizInfo] = useState({
    deadline: null as string | null,
  });

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={[globalStyles.title, { width: "40%" }]}>Deadline</Text>
      <TouchableOpacity
        onPress={() => setShowDeadlinePicker(true)}
        style={[globalStyles.inputContainer, { width: "60%" }]}
      >
        <Text>
          {quizInfo.deadline
            ? new Date(quizInfo.deadline).toDateString()
            : "Set Deadline"}{" "}
        </Text>
      </TouchableOpacity>
      {showDeadlinePicker && (
        <DateTimePicker
          value={quizInfo.deadline ? new Date(quizInfo.deadline) : new Date()}
          mode="date"
          display={"default"}
          onChange={(event, selectedDate) => {
            setShowDeadlinePicker(false);
            if (selectedDate) {
              setQuizInfo((prev) => ({
                ...prev,
                deadline: selectedDate.toISOString(),
              }));
            }
          }}
        />
      )}
    </View>
  );
};

export default addAssignment;
