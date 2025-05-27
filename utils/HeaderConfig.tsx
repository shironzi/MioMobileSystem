import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function useHeaderConfig(title: string) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: title,
        headerStyle: { backgroundColor: "#2264DC" },
        headerTintColor: "#fff",
        headerShown: true,

        headerLeft: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 14 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      });
    }, [navigation, title]),
  );
}
