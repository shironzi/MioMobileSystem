import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import {Text, View} from "react-native";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await SecureStore.getItemAsync("sessionData");
        if (data) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Failed to load session:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [router]);

  if (isLoading) {
    return (
        <View>
          <Text>Loading</Text>
        </View>
    );
  }

  return (
      <Stack
          screenOptions={{
            headerShown: true,
          }}
      >
        {isLoggedIn ? (
            <Stack.Screen name="(drawer)" />
        ) : (
            <Stack.Screen name="index" />
        )}
      </Stack>
  );
}
