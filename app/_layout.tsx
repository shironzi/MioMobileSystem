import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(notification)" options={{ headerShown: false }} />
      <Stack.Screen name="(course)" options={{ headerShown: false }} />
    </Stack>
  );
}
