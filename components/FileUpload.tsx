import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { memo, useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const FileUpload = (props: { handleFiles: (file: FileInfo[]) => void }) => {
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
        prev.map((f, i) => (i === index ? { uri, name, mimeType } : f)),
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    props.handleFiles(files);
  }, [files]);

  return (
    <View style={{ rowGap: 18 }}>
      <View style={{ paddingVertical: 9, rowGap: 18 }}>
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
});

export default memo(FileUpload);
