import { View, Text } from "react-native";
import React, { memo } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { AntDesign } from "@expo/vector-icons";

const addMessage = () => {
    HeaderConfig("Add Message");
  return (
    <View>
      <Text>Add Message</Text>
    </View>
  );
};

export default memo(addMessage);
