import { useFocusEffect, useNavigation } from "expo-router";
import React, { memo, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const initialData = [
  {
    id: 1,
    imageSrc: require("@/assets/flashcards/apple.jpg"),
    word: "Apple",
    isAnswered: false,
  },
  {
    id: 2,
    imageSrc: require("@/assets/flashcards/fireExtinguisher.jpg"),
    word: "Banana",
    isAnswered: false,
  },
  {
    id: 3,
    imageSrc: require("@/assets/flashcards/scissors.png"),
    word: "Orange",
    isAnswered: false,
  },
  {
    id: 4,
    imageSrc: require("@/assets/flashcards/teacher.jpg"),
    word: "Grapes",
    isAnswered: false,
  },
  {
    id: 5,
    imageSrc: require("@/assets/flashcards/whisper.png"),
    word: "Strawberry",
    isAnswered: false,
  },
];

const Picgame = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Picture Flashcards",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );
  return (
    <View style={{ marginHorizontal: 23 }}>
      <View>
        <Text
          style={{
            fontSize: 17,
            color: "#1F1F1F",
            marginTop: 13,
            fontWeight: 800,
          }}
        >
          Easy
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 13,
            gap: 10,
          }}
        >
          {data?.map((ques, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                borderColor: "#CBCBCB",
                borderWidth: 1,
                backgroundColor: "#CBCBCB",
                borderRadius: 5,
                height: 25,
                width: "auto",
              }}
            />
          ))}
        </View>
        <Text style={{ color: "#434242", fontSize: 15, marginTop: 25 }}>
          Guess the picture
        </Text>
      </View>
    </View>
  );
};

export default memo(picgame);
