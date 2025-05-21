import React, { useState } from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

type DatePickerFieldProps = {
  date: Date | null;
  onChange: (d: Date) => void;
  error?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

export function DatePickerField({
  date,
  onChange,
  error = false,
  placeholder = "Select date",
  style,
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

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
          {date ? date.toDateString() : placeholder}
        </Text>
        <MaterialIcons name="date-range" size={22} color="#ffbf18" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
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
