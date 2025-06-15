import { registerRootComponent } from "expo";

import App from "./app";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

registerRootComponent(App);
