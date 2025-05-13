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

      try{
        const serverUserId = await verifyToken();
        const raw = await SecureStore.getItemAsync("sessionData");

        if (raw != null) {
          const {userId} = JSON.parse(raw);

          if (userId === serverUserId) {
            setIsLoggedIn(true);
          } else {
            await SecureStore.deleteItemAsync("sessionData");
            setIsLoggedIn(false);
            rootNav?.dispatch(StackActions.replace("index"));
          }
        }

      }catch (err){
        setIsLoggedIn(false);
        rootNav?.dispatch(StackActions.replace("index"));

        return;
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
