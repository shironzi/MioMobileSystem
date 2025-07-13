import globalStyles from "@/styles/globalStyles";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { memo, useState } from "react";

interface Props {
  time: Date | null;
  setTime: (time: Date) => void;
  hasError?: boolean;
}

const Time = ({ time, setTime, hasError }: Props) => {
  const [pickerShow, setPickerShow] = useState<boolean>(false);

  return (
    <View
      style={[globalStyles.cardContainer, hasError && { borderColor: "red" }]}
    >
      <TouchableOpacity
        onPress={() => setPickerShow(true)}
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <Text style={{ color: time ? "#000" : "#aaa" }}>
          {time
            ? time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Select time"}
        </Text>
        <MaterialIcons name="access-time" size={22} color="#ffbf18" />
      </TouchableOpacity>

      {pickerShow && (
        <DateTimePicker
          value={time ?? new Date()}
          mode={"time"}
          display="default"
          onChange={(_, selected) => {
            setPickerShow(false);
            if (selected) setTime(selected);
          }}
        />
      )}
    </View>
  );
};

export default memo(Time);
