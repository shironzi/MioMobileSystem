import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Alert, Image, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const HeaderConfigQuiz = (title: string) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: title,
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#fff",
        headerShown: true,
        headerTitleStyle: {
          color: "#282727",
          fontWeight: "bold",
        },

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
            <FontAwesome6 name="arrow-left-long" size={24} color="#282727" />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <Image
            source={require("@/assets/onboard/mio.png")}
            style={{ width: 70, height: 70, marginRight: 10 }}
            resizeMode="contain"
          />
        ),

        headerBackTitleVisible: false,
      });
    }, [navigation, title]),
  );
};

export default HeaderConfigQuiz;
