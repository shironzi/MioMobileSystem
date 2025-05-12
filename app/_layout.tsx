import {Stack, useNavigation, useRouter} from "expo-router";
import { useEffect, useState } from "react";
import { verifyToken } from "@/utils/auth";
import * as SecureStore from "expo-secure-store";
import {StackActions} from "@react-navigation/native";
import {Text, View} from "react-native";

export default function Layout() {
  const navigation = useNavigation()
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const rootNav = navigation.getParent();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {

      const serverUserId = await verifyToken();

      console.log(serverUserId)
      if (!mounted) return;

      if (!serverUserId) {
        setIsLoggedIn(false);
        rootNav?.dispatch(StackActions.replace("index"));
        return;
      }

      const raw = await SecureStore.getItemAsync("sessionData");
      if (!mounted) return;

      if (!raw) {
        setIsLoggedIn(false);
        rootNav?.dispatch(StackActions.replace("index"));
        return;
      }

      const { userId } = JSON.parse(raw);
      if (userId === serverUserId) {
        setIsLoggedIn(true);
      } else {
        await SecureStore.deleteItemAsync("sessionData");
        setIsLoggedIn(false);
        rootNav?.dispatch(StackActions.replace("index"));
      }

      setLoading(false)
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isLoggedIn === null) {
    return null;
  }

  if(loading){
    return (
        <View>
          <Text>
            Loading.......
          </Text>
        </View>
    )
  }

  return (
      <Stack screenOptions={{ headerShown: true }}>
        {isLoggedIn ? (
            <Stack.Screen name="(drawer)" />
        ) : (
            <Stack.Screen name="index" />
        )}
      </Stack>
  );
}
