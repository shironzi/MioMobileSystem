import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome6 } from "@expo/vector-icons";

const Talk2Me = () => {
  return (
    <View>
      <Ionicons name="person-circle-outline" size={24} color="black" />
      <View>
        <FontAwesome6 name="volume-high" size={20} color="#fff" />
      </View>
    </View>
  );
};

export default Talk2Me;
