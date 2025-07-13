import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Image, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const HeaderConfigScoreDetails = (title: string, activity_type?: string) => {
  const navigation = useNavigation();

  console.log(activity_type);

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
              navigation.goBack();
              navigation.goBack();
              if (
                activity_type === "picture" ||
                activity_type === "phrase" ||
                activity_type === "question"
              ) {
                navigation.goBack();
              }
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
    }, [navigation, title, activity_type]),
  );
};

export default HeaderConfigScoreDetails;
