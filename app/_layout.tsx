import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { verifyToken } from "@/utils/auth";

export default function Layout() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await verifyToken();
      setIsLoggedIn(ok);
      if (!ok) {
        router.replace("/index");
      }
    })();
  }, []);

  if (isLoggedIn === null) {
    return null;
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
