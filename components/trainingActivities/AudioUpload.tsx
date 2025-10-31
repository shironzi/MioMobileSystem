import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import * as DocumentPicker from "expo-document-picker";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const AudioUpload = (props: {
  handleFiles: (file: FileInfo) => void;
  handleAudioRemove: () => void;
  isError: boolean;
  filename: string | null;
  audio_path: string | FileInfo | null;
}) => {
  const [file, setFile] = useState<FileInfo | null>(null);

  const handleFileUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["audio/*"],
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      setFile(res.assets[0]);
    }
  };

  useEffect(() => {
    if (file) {
      props.handleFiles(file);
    }
  }, [file]);

  return (
    <View style={{ rowGap: 18 }}>
      <View style={{ paddingVertical: 9, rowGap: 18 }}>
        {props.audio_path ? (
          <View style={styles.fileRow}>
            <View style={{ flexDirection: "row" }}></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "125%",
                alignItems: "center",
                marginVertical: -10,
              }}
            >
              <Text
                style={{ maxWidth: 250, marginVertical: 10, flexWrap: "wrap" }}
              >
                {typeof props.audio_path === "object"
                  ? props.audio_path?.name
                  : props.filename}
              </Text>
              <TouchableOpacity
                onPress={props.handleAudioRemove}
                style={styles.fileUpload}
              >
                <AntDesign name="close" size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={[
                styles.addFileRow,
                props.isError
                  ? { borderColor: "#db4141" }
                  : { borderColor: "#ffbf18" },
              ]}
              onPress={handleFileUpload}
            >
              <Feather name="upload" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>
                Browse files to upload audio
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadHeader: {
    backgroundColor: "#ddd",
    paddingVertical: 9,
    paddingHorizontal: 26,
  },
  uploadHeaderText: {
    color: "#fff",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileUpload: {
    padding: 9,
    width: 100,
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
  },
  filename: {
    flex: 1,
    color: "#333",
  },
  addFileRow: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 2.5,
    borderStyle: "dashed",
    padding: 15,
    width: "110%",
    borderRadius: 20,
    rowGap: 10,
    height: 100,
    left: -13,
  },
  addFileText: {
    color: "#1F1F1F68",
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 28,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default memo(AudioUpload);
