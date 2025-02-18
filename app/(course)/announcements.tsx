import { View, Text } from "react-native";
import React, { memo, useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "expo-router";

const announcements = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Announcement",
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
      <Text>announcements</Text>
    </View>
  );
};

export default memo(announcements);
