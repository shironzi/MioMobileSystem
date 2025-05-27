import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Alert, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const HeaderConfigQuiz = (title: string) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: title,
        headerStyle: { backgroundColor: "#2264DC" }, // don’t forget the “#”
        headerTintColor: "#fff",
        headerShown: true,

        headerLeft: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              Alert.alert("Hold on!", "Are you sure you want to exit?", [
                { text: "Stay", style: "cancel" },
                {
                  style: "destructive",
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        ),

        headerBackTitleVisible: false,
      });
    }, [navigation, title]),
  );
};

export default HeaderConfigQuiz;
