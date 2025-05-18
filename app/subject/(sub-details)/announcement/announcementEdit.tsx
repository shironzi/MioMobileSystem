import HeaderConfig from "@/utils/HeaderConfig";
import { editAnnouncements } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";

function AnnouncementEdit() {
  HeaderConfig("Announcement");
  const router = useRouter();

  const { subjectId, title, description, date, time, announcementId } =
    useLocalSearchParams<{
      subjectId: string;
      title: string;
      description: string;
      date: string;
      time: string;
      announcementId: string;
    }>();

  const [editTitle, setEditTitle] = useState(title || "");
  const [editDescription, setEditDescription] = useState(description || "");
  const [descHeight, setDescHeight] = useState(0);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      const response = await editAnnouncements(
        subjectId,
        announcementId,
        editTitle,
        editDescription
      );

      if (response.success) {
        console.log(response.message);
        router.back();
      } else {
        console.log("Failed to update the announcement");
      }
    } catch (err) {
      useAuthGuard(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "column" }}>
          <Text>Title: </Text>
          <TextInput
            style={globalStyles.inputContainer}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
          />
        </View>

        <Text style={styles.date}>
          {date} {time}
        </Text>

        <View style={{ flexDirection: "column" }}>
          <Text>Description: </Text>
          <TextInput
            value={editDescription}
            onChangeText={setEditDescription}
            multiline
            placeholder="Enter description…"
            style={[
              globalStyles.inputContainer,
              { height: Math.max(200, descHeight) },
            ]}
            onContentSizeChange={(e) =>
              setDescHeight(e.nativeEvent.contentSize.height)
            }
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AnnouncementEdit);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
  },
  saveButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
