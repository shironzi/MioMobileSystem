import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { Stack, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Layout() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    setIsLoggedIn(!!user); // Update isLoggedIn based on user presence
    setLoading(false); // Stop loading once auth state is determined
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // Unsubscribe on component unmount
  }, []);

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
