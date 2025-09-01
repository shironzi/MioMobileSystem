import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

const CompletedAlert = ({
  message,
  handleButton,
}: {
  message: string;
  handleButton: () => void;
}) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={require("@/assets/Alerts/completed.png")}
            style={styles.image}
          />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={handleButton}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingBottom: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CompletedAlert;
