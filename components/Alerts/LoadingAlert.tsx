import { Text, View, StyleSheet, Modal } from "react-native";
import { Image } from "expo-image";

const LoadingAlert = () => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={require("@/assets/Alerts/loading.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Saving your comment...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "80%",
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default LoadingAlert;
