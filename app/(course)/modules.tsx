import { View, Text } from "react-native";
import React, { memo, useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";

const modules = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Modules",
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
    <View>
      <Text>modules</Text>
    </View>
  );
};

export default memo(modules);
