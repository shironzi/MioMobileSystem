import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";

const ErrorModal = ({
  errorMessageModal,
  setErrorMessageModal,
  scoreError,
}: {
  errorMessageModal: boolean;
  setErrorMessageModal: () => void;
  scoreError: string;
}) => {
  return (
    <Modal
      transparent={true}
      visible={errorMessageModal}
      animationType="fade"
      onRequestClose={() => setErrorMessageModal()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View
            style={[
              globalStyles.sectionHeader,
              {
                backgroundColor: "#DA4848",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={[
                globalStyles.text1,
                { color: "#fff", lineHeight: 20, fontSize: 20 },
              ]}
            >
              Error Message
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorMessageModal()}
            >
              <AntDesign name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 20 }}>
            <Text style={styles.modalText}>{scoreError}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorMessageModal()}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: "red",
  },
  modalButton: {
    backgroundColor: "#FFBF18",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "50%",
    marginHorizontal: "auto",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ErrorModal;
