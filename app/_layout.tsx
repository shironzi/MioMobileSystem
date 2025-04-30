import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext({ signOut: () => {} });
export const useAuth = () => useContext(AuthContext);

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const signOut = () => {
    setIsLoggedIn(false);
    router.replace("/index");
  };

  // if (!isLoggedIn) {
  // <Stack screenOptions={{ headerShown: false }}>
  //   <Stack.Screen
  //     name="index"
  //     options={{
  //       headerShown: false,
  //     }}
  //   />
  // </Stack>;
  // }

  // return (
  // <Stack screenOptions={{ headerShown: true }}>
  //   <Stack.Screen
  //     name="(drawer)"
  //     options={{
  //       headerShown: false,
  //     }}
  //   />
  // </Stack>
  // );

  return (
    <AuthContext.Provider value={{ signOut }}>
      {!isLoggedIn ? (
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      )}
    </AuthContext.Provider>
  );
}
