import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { updateFCMToken } from "@/utils/notification";
import EarthquakeAlertModal from "@/components/modals/EarthquakeAlertModal";
import * as Notifications from "expo-notifications";

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  useEffect(() => {
    return getAuth().onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [loading, user, router]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken && user?.uid) {
        await updateFCMToken(user?.uid, fcmToken);
        console.log(fcmToken);
      }
    }
  }

  async function messageListener() {
    // Foreground
    messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title ?? "No Title";
      const body = remoteMessage.notification?.body ?? "No Body";
      const type = remoteMessage.data?.type ?? "No Type";

      if (type === "earthquake") {
        setModalTitle(title);
        setModalBody(body);
        setShowAlert(true);
      }

      if (type === "message") {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: remoteMessage.data,
          },
          trigger: null,
        });
      }
    });
  }

  useEffect(() => {
    requestUserPermission();
    messageListener();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
      </Stack>

      <EarthquakeAlertModal
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title={modalTitle}
        body={modalBody}
      />
    </>
  );
}
