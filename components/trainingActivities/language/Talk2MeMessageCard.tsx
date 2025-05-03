import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome6 } from "@expo/vector-icons";

const Talk2Me = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        columnGap: 15,
        alignItems: "center",
        width: "auto",
        height: "auto",
      }}
    >
      <Ionicons name="person-circle-outline" size={50} color="black" />
      <View
        style={{
          flexDirection: "row",
          columnGap: 10,
          alignItems: "center",
          backgroundColor: "#fff",
          paddingRight: 20,
          paddingLeft: 10,
          paddingVertical: 15,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#FFBF18",
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderRadius: 180,
          }}
        >
          <FontAwesome6 name="volume-high" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text>Mio</Text>
          <Text style={{ flexWrap: "wrap", maxWidth: 225 }}>
            {/* Hello! Can you tell me what your favorite hobby is today? */}
            Hello, How are you?
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Talk2Me;
