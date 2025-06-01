import * as DocumentPicker from "expo-document-picker";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const ImageUpload = (props: {
  handleFiles: (file: FileInfo) => void;
  handleImageRemove: () => void;
  imageUri: string | null;
  isError: boolean;
}) => {
  const [file, setFile] = useState<FileInfo | null>(null);

  const handleFileUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const { uri, name, mimeType } = res.assets[0];
      setFile({ uri, name, mimeType });
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
        {props.imageUri !== null ? (
          <View style={styles.fileRow}>
            <Image
              source={props.imageUri}
              style={{ width: 150, height: 150 }}
              contentFit="contain"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={handleFileUpload}
                style={styles.fileUpload}
              >
                <MaterialIcons name="edit" size={24} color="#FFBF18" />
                <Text style={{ color: "#FFBF18" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={props.handleImageRemove}
                style={styles.fileUpload}
              >
                <AntDesign name="close" size={24} color="red" />
                <Text style={{ color: "red" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.addFileRow,
              props.isError
                ? { borderColor: "red" }
                : { borderColor: "#ffbf18" },
            ]}
            onPress={handleFileUpload}
          >
            <FontAwesome name="image" size={24} color="#FFBF18" />
            <Text style={styles.addFileText}>Browse files to upload image</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: "column",
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
    width: "100%",
    borderRadius: 20,
    rowGap: 10,
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

export default memo(ImageUpload);
