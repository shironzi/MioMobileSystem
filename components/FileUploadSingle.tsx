import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Props {
  handleFile: (file: FileInfo) => void;
  fileTypes: string[];
  showAddFile?: boolean;
  hasError?: boolean;
}

const FileUploadSingle = ({
  handleFile,
  fileTypes,
  showAddFile = true,
  hasError = false,
}: Props) => {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [fileError, setFileError] = useState<boolean>(false);

  console.log(hasError);

  const mapFileTypesToMimes = () => {
    return fileTypes
      .map((type) => {
        switch (type) {
          case "pdf":
            return "application/pdf";
          case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          case "pptx":
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          case "zip":
            return "application/zip";
          case "img":
          case "png":
          case "jpeg":
          case "jpg":
            return "image/*";
          case "mp4":
            return "video/mp4";
          case "mp3":
            return "audio/mpeg";
          default:
            return null;
        }
      })
      .filter((mimeType) => mimeType !== null);
  };

  const handleFileUpload = async () => {
    const mimeTypes = mapFileTypesToMimes();
    const res = await DocumentPicker.getDocumentAsync({
      type: mimeTypes,
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const { uri, name, mimeType } = res.assets[0];
      setFile({ uri, name, mimeType });
      setFileError(false);
      handleFile({ uri, name, mimeType });
    } else {
      setFileError(true);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(false);
  };

  return (
    <View style={{ paddingVertical: 9 }}>
      <View style={styles.fileRow}>
        <View style={styles.fileInfoContainer}>
          <TouchableOpacity
            onPress={handleFileUpload}
            style={[
              styles.fileUpload,
              (fileError || hasError) && { borderColor: "#db4141" },
            ]}
          >
            <Text>Choose File</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.filename,
              (fileError || hasError) && { color: "#db4141" },
            ]}
          >
            {file ? file.name : "No file chosen"}
          </Text>
        </View>

        {file ? (
          <TouchableOpacity onPress={handleRemoveFile}>
            <AntDesign name="close" size={24} color="#aaa" />
          </TouchableOpacity>
        ) : null}
      </View>

      {showAddFile && (
        <TouchableOpacity style={styles.addFileRow} onPress={handleFileUpload}>
          <View style={styles.addFileTextContainer}>
            <MaterialIcons name="add" size={20} color="#FFBF18" />
            <Text style={styles.addFileText}>Add File</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    columnGap: 10,
  },
  fileUpload: {
    padding: 9,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: "#F4F4F4",
    width: 100,
    alignItems: "center",
  },
  filename: {
    flex: 1,
    color: "#333",
  },
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    padding: 5,
    width: 120,
    borderRadius: 20,
    marginTop: 20,
  },
  addFileTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default memo(FileUploadSingle);
