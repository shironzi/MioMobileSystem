import HeaderConfig from "@/utils/HeaderConfig";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { deleteAnnouncements } from "@/utils/query";

const AnnouncementDetails = () => {
  HeaderConfig("Announcement");
  const router = useRouter();

  const { subjectId, title, description, date, time, announcementId, role } =
    useLocalSearchParams<{
      subjectId: string;
      title: string;
      description: string;
      date: string;
      time: string;
      announcementId: string;
      role: string;
    }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "archive" | null>(
    null,
  );

  const onEdit = useCallback(() => {
    setMenuVisible(false);
    router.push({
      pathname: "/subject/(sub-details)/announcement/announcementEdit",
      params: {
        subjectId,
        title,
        date,
        time,
        description,
        announcementId,
      },
    });
  }, [title, date, time, description, announcementId, router, subjectId]);

  const requestDelete = useCallback(() => {
    setMenuVisible(false);
    setConfirmType("delete");
    setConfirmVisible(true);
  }, []);

  const requestArchive = useCallback(() => {
    setMenuVisible(false);
    setConfirmType("archive");
    setConfirmVisible(true);
  }, []);

  const handleDelete = async () => {
    const response = await deleteAnnouncements(subjectId, announcementId);

    console.log(response);
  };

  const onConfirm = useCallback(() => {
    if (confirmType === "delete") {
      handleDelete();
    } else if (confirmType === "archive") {
      console.log("Announcement archived");
    }
    setConfirmVisible(false);
    setConfirmType(null);
  }, [confirmType]);

  const onCancelConfirm = useCallback(() => {
    setConfirmVisible(false);
    setConfirmType(null);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            {role === "teacher" ? (
              <TouchableOpacity
                onPress={() => setMenuVisible((v) => !v)}
                style={styles.threeDots}
              >
                <Entypo name="dots-three-vertical" size={20} color="#333" />
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={styles.date}>{date}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Action Menu */}
          <Modal
            transparent
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.dropdownBox}>
              <TouchableOpacity onPress={onEdit} style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Edit</Text>
              </TouchableOpacity>
              <View style={styles.divider} />

              <TouchableOpacity
                onPress={requestDelete}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>Delete</Text>
              </TouchableOpacity>
              <View style={styles.divider} />

              <TouchableOpacity
                onPress={requestArchive}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>Archive</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            transparent
            visible={confirmVisible}
            animationType="fade"
            onRequestClose={onCancelConfirm}
          >
            <TouchableWithoutFeedback onPress={onCancelConfirm}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>
                Are you sure you want to {confirmType} this announcement?
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  onPress={onCancelConfirm}
                  style={[styles.confirmButton, styles.cancelButton]}
                >
                  <Text style={styles.confirmButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[styles.confirmButton, styles.confirmActionButton]}
                >
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  cardContainer: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardContent: { flexDirection: "column" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  threeDots: { padding: 8 },
  title: { fontSize: 20, color: "#2264dc", fontWeight: "bold" },
  date: { fontSize: 14, color: "#888", marginVertical: 8 },
  description: { fontSize: 16, color: "#333", lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  dropdownBox: {
    position: "absolute",
    top: 60,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 10,
    paddingVertical: 4,
    width: 140,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownItemText: { fontSize: 16, color: "#333" },
  divider: { height: 1, backgroundColor: "#e0e0e0" },
  confirmBox: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  confirmText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButtons: { flexDirection: "row", justifyContent: "flex-end" },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: "#6c757d" },
  confirmActionButton: { backgroundColor: "#dc3545" },
  confirmButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default memo(AnnouncementDetails);
