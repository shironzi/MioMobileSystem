import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

export default function useHeaderConfig(
  title: string,
  bgColor: string = "#2264DC"
) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: title,
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: "#fff",
        headerShown: true,
      });
    }, [navigation, title, bgColor])
  );
}
