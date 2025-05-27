import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Alert, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const HeaderConfigScoreDetails = (title: string) => {
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
              navigation.goBack();
              navigation.goBack();
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

export default HeaderConfigScoreDetails;
