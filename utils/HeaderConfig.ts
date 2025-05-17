import { useCallback } from "react";
import { useNavigation, useFocusEffect } from "expo-router";

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
