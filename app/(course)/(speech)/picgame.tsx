import { useFocusEffect, useNavigation } from "expo-router";
import React, {memo, useCallback} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PicgameCard from "@/components/PicgameCard";

const pictureFlashcard = [
  {
    imageSrc: "@/assets/flashcards/apple.jpg",
    isAnswered: false,
  },
  {
    imageSrc: "@/assets/flashcards/apple.jpg",
    isAnswered: false,
  },
  {
    imageSrc: "@/assets/flashcards/apple.jpg",
    isAnswered: false,
  },
  {
    imageSrc: "@/assets/flashcards/apple.jpg",
    isAnswered: false,
  },
  {
    imageSrc: "@/assets/flashcards/apple.jpg",
    isAnswered: false,
  },
];

const picgame = () => {
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