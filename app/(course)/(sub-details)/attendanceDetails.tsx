import { View, Text, } from "react-native";
import React, { memo } from "react";
import HeaderConfig from "@/components/HeaderConfig";


const attendanceDetails = () => {
  HeaderConfig("Attendance");

  return (
    <View>
      <Text>Hi</Text>
    </View>
  )

};

export default memo(attendanceDetails);
