import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const addAnnouncement = () => {
  useHeaderConfig("Announcement");
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descHeight, setDescHeight] = useState<number>(200);
  const [files, setFiles] = useState<FileInfo[]>([]);

  const handleAddFile = () => {
    setFiles((prev) => [...prev, { uri: "", name: "", mimeType: undefined }]);
  };

  const handleFileUpload = async (index: number) => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/*", "video/*", "audio/*"],
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const { uri, name, mimeType } = res.assets[0];
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { uri, name, mimeType } : f))
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    router.push({
      pathname: "/subject/(sub-details)/announcement/announcementPreview",
      params: {
        title,
        description,
        files: JSON.stringify(files),
      },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 20 }}>
        <View style={{ paddingHorizontal: 26, paddingVertical: 18 }}>
          <View>
            <Text>Title:</Text>
            <TextInput
              placeholder="Title"
              style={globalStyles.inputContainer}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text>Description:</Text>
            <TextInput
              style={[
                globalStyles.inputContainer,
                { height: Math.max(200, descHeight) },
              ]}
              placeholder="Description"
              multiline
              onContentSizeChange={(e) =>
                setDescHeight(e.nativeEvent.contentSize.height)
              }
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        <View style={{ rowGap: 18 }}>
          <View style={styles.uploadHeader}>
            <Text style={styles.uploadHeaderText}>File Upload</Text>
          </View>

          <View
            style={{ paddingVertical: 9, paddingHorizontal: 26, rowGap: 18 }}
          >
            {files.map((file, idx) => (
              <View key={idx} style={styles.fileRow}>
                <TouchableOpacity
                  onPress={() => handleFileUpload(idx)}
                  style={styles.fileUpload}
                >
                  <Text>Choose File</Text>
                </TouchableOpacity>

                {file.name ? (
                  <Text style={styles.filename}>{file.name}</Text>
                ) : null}

                {file.name ? (
                  <TouchableOpacity onPress={() => handleRemoveFile(idx)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}

            <TouchableOpacity style={styles.addFileRow} onPress={handleAddFile}>
              <AntDesign name="plus" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>Add File</Text>
            </TouchableOpacity>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePreview}
              >
                <Text>Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadHeader: {
    width: "100%",
    backgroundColor: "#434242",
    paddingVertical: 9,
    paddingHorizontal: 26,
  },
  uploadHeaderText: {
    color: "#fff",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileUpload: {
    padding: 9,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.10)",
    backgroundColor: "#F4F4F4",
    elevation: 5,
    width: 100,
    alignItems: "center",
  },
  filename: {
    marginLeft: 10,
    flex: 1,
  },
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  addFileText: {
    color: "#FFBF18",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    backgroundColor: "#FFBF18",
    borderRadius: 50,
    paddingHorizontal: 17,
    paddingVertical: 9,
  },
});

export default memo(addAnnouncement);
