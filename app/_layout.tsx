import { getAuth } from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import EarthquakeAlertModal from "@/components/modals/EarthquakeAlertModal";
import * as Notifications from "expo-notifications";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");

  useEffect(() => {
    return getAuth().onAuthStateChanged(() => {
      setLoading(false);
    });
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  async function messageListener() {
    // Foreground
    messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title ?? "No Title";
      const body = remoteMessage.notification?.body ?? "No Body";
      const type = remoteMessage.data?.type ?? "No Type";

      console.log(type);

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
      } else if (type === "notification") {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: remoteMessage.data,
          },
          trigger: null,
        });
      }
    });
  }

  useEffect(() => {
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
