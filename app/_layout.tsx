import { getAuth } from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  SafeAreaView,
  Text,
  Vibration,
  View,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import EarthquakeAlertModal from "@/components/modals/EarthquakeAlertModal";
import * as Notifications from "expo-notifications";
import FireAlertModal from "@/components/modals/FireAlertModal";
import FloodAlertModal from "@/components/modals/FloodAlertModal";
import SchoolThreat from "@/components/modals/SchoolThreat";
import PowerOutageModal from "@/components/modals/PowerOutageModal";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [showFloodAlert, setFloodAlert] = useState(false);
  const [showSchoolThreat, setSchoolThreat] = useState(false);
  const [showPowerOutage, setPowerOutage] = useState(false);
  const [showFireAlert, setFireAlert] = useState(false);

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

      if (type === "flood") {
        setModalTitle(title);
        setModalBody(body);
        setFloodAlert(true);
      }

      if (type === "fire") {
        setModalTitle(title);
        setModalBody(body);
        setFireAlert(true);
      }

      if (type === "school threat") {
        setModalTitle(title);
        setModalBody(body);
        setSchoolThreat(true);
      }

      if (type === "power outage") {
        setModalTitle(title);
        setModalBody(body);
        setPowerOutage(true);
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
        console.log("notification");
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
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
      </Stack>

      <EarthquakeAlertModal
        visible={showAlert}
        onClose={() => {
          setShowAlert(false);
          Vibration.cancel();
        }}
        title={modalTitle}
        body={modalBody}
      />

      <FireAlertModal
        visible={showFireAlert}
        onClose={() => {
          setFireAlert(false);
          Vibration.cancel();
        }}
        title={modalTitle}
        body={modalBody}
      />

      <FloodAlertModal
        visible={showFloodAlert}
        onClose={() => {
          setFloodAlert(false);
          Vibration.cancel();
        }}
        title={modalTitle}
        body={modalBody}
      />

      <SchoolThreat
        visible={showSchoolThreat}
        onClose={() => {
          setSchoolThreat(false);
          Vibration.cancel();
        }}
        title={modalTitle}
        body={modalBody}
      />

      <PowerOutageModal
        visible={showPowerOutage}
        onClose={() => {
          setPowerOutage(false);
          Vibration.cancel();
        }}
        title={modalTitle}
        body={modalBody}
      />
    </SafeAreaView>
  );
}
