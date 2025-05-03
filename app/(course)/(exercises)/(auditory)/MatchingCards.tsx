import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";

const Data = [
  { id: "1", image: require("@/assets/flashcards/apple.jpg"), word: "bird" },
  { id: "2", image: require("@/assets/logo.png"), word: "fence" },
  {
    id: "3",
    image: require("@/assets/flashcards/fireExtinguisher.jpg"),
    word: "fence",
  },
  { id: "4", image: require("@/assets/flashcards/scissors.png"), word: "bird" },
  { id: "5", image: require("@/assets/flashcards/teacher.jpg"), word: "Dog" },
];

const MatchingCards = () => {
  HeaderConfig("Matching Cards");
  return (
    <View style={{ padding: 20 }}>
      <View style={{ marginVertical: "auto" }}>
        {Data.map((item) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.itemContainer}>
              <View
                style={{
                  backgroundColor: "#FFBF18",
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  margin: "auto",
                  borderRadius: 180,
                }}
              >
                <FontAwesome6 name="volume-high" size={20} color="#fff" />
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Image
                key={item.id}
                source={item.image}
                style={{ width: 100, height: 100, margin: "auto" }}
              />
            </View>
          </View>
        ))}
      </View>
      <View>
        <TouchableOpacity>
          <Text>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 116,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 14,
  },
  icon: {
    backgroundColor: "#FFBF18",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 180,
    margin: "auto",
  },
});

export default MatchingCards;
