import { Text, View, StyleSheet, Modal, TouchableOpacity } from "react-native";

interface Props {
  handleApprove: () => void;
  handleReject: () => void;
}

const CancelAlert = ({ handleApprove, handleReject }: Props) => {
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>Are you sure you want to cancel?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.approve} onPress={handleReject}>
              <Text style={[styles.buttonText, { color: "#28a745" }]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={handleApprove}>
              <Text style={[styles.buttonText, { color: "#D32F2F" }]}>Yes</Text>
            </TouchableOpacity>
          </View>
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
  approve: {
    borderColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancel: {
    borderColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default CancelAlert;
