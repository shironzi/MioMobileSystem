import React, { useEffect } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import globalStyles from "@/styles/globalStyles";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Vibration } from "react-native";

const FireAlertModal = ({
  visible,
  onClose,
  title,
  body,
}: {
  title: string;
  body: string;
  visible: boolean;
  onClose: () => void;
}) => {
  const audioSource = require("../../assets/audio/emergency.mp3");

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  if (status.didJustFinish) {
    console.log("hello");
    player.seekTo(0);
    player.play();
  }

  useEffect(() => {
    if (visible) {
      player.seekTo(0);
      player.play();
      const vibrationPattern = [
        200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100,
        200,
      ];
      Vibration.vibrate(vibrationPattern, true);
    } else {
      player.pause();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Emergency Alert!</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Image
            source={require("@/assets/emergency/warning.png")}
            style={styles.icon}
          />
          {/*<Text style={styles.title}>{title}</Text>*/}
          <Text style={styles.body}>{body}</Text>

          <TouchableOpacity
            style={[globalStyles.submitButton, { width: "70%" }]}
            onPress={onClose}
          >
            <Text style={[globalStyles.submitButtonText]}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  header: {
    backgroundColor: "#d9534f",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
  },
  body: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export default FireAlertModal;
