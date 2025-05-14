import { Stack, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { verifyToken } from "@/utils/auth";
import * as SecureStore from "expo-secure-store";
import { StackActions } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useAuthGuard } from "@/utils/useAuthGuard";

export default function Layout() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAuthError, setHasAuthError] = useState(false);

  const rootNav = navigation.getParent();

  useAuthGuard(hasAuthError);

  useEffect(() => {
    let redirected = false;

    async function checkAuth() {
      try {
        const serverUserId = await verifyToken();
        const raw = await SecureStore.getItemAsync("sessionData");

        if (!raw) {
          throw new Error("No session");
        }

        const { userId } = JSON.parse(raw);
        if (userId !== serverUserId) {
          // session mismatch → clear & redirect
          await SecureStore.deleteItemAsync("sessionData");
          redirected = true;
          rootNav?.dispatch(StackActions.replace("/index"));
          return;
        }

        // valid session
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        if (!redirected) {
          setIsLoggedIn(false);
          rootNav?.dispatch(StackActions.replace("/index"));
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []); // run once on mount

  if (isLoggedIn === null) {
    return null;
  }

  if (loading) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <Stack.Screen name="index" />
      )}
    </Stack>
  );
}
