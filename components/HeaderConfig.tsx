import {useMemo, useCallback, memo, useEffect} from "react";
import { useNavigation } from "expo-router";
import {StackActions, useFocusEffect} from "@react-navigation/native";
import {verifyToken} from "@/utils/auth";

function HeaderConfig(title: string, bgColor: string = "#2264DC") {
  const navigation = useNavigation();

  const options = useMemo(
    () => ({
      headerTitle: title,
      headerStyle: { backgroundColor: bgColor },
      headerTintColor: "#fff",
    }),
    [title, bgColor]
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions(options);
      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: { backgroundColor: "" },
          headerTintColor: "",
        });
      };
    }, [navigation, options])
  );
}

export default HeaderConfig;
