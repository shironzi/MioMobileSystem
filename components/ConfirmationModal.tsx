import React, { memo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ConfirmationModal = (props: {
  isVisible: boolean;
  description: string;
  cancelDisplay: string;
  approveDisplay: string;
  handleCancel: () => void;
  handleApprove: () => void;
}) => {
  return (
    <Modal
      visible={props.isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => props.handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{props.description}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => props.handleCancel}
            >
              <Text style={styles.cancelText}>{props.cancelDisplay}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={props.handleApprove}
            >
              <Text style={styles.deleteText}>{props.approveDisplay}</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#eee",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#FF5646",
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default memo(ConfirmationModal);
