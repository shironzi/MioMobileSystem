import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SpeechStyles from "@/styles/SpeechStyles";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const ImageUpload = (props: {
  handleFiles: (uri: string | FileInfo) => void;
  handleImageRemove: () => void;
  image_path: string | null;
  isError: boolean;
  showPreview: boolean;
  index: number;
}) => {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
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

  useEffect(() => {
    if (props.image_path) {
      try {
        const urlNoFile = new URL(props.image_path);
        const fileNameOrDefault =
          urlNoFile.pathname.split("/").pop() || "No file name found";
        setFileName(fileNameOrDefault);
      } catch (e) {
        console.warn("Invalid image path", props.image_path);
      }
    } else {
      setFileName("");
    }
  }, [props.image_path]);

  return (
    <View style={{ rowGap: 18 }}>
      <View style={{ paddingVertical: 9, rowGap: 18 }}>
        {props.image_path ? (
          <View style={[styles.fileRow]}>
            {props.showPreview ? (
              <View>
                <Image
                  source={{ uri: props.image_path }}
                  style={SpeechStyles.imageContainer}
                  contentFit="contain"
                />
                <View style={styles.fileSettings}>
                  <TouchableOpacity
                    onPress={handleFileUpload}
                    style={styles.fileUpload}
                  >
                    <MaterialIcons name="edit" size={24} color="#FFBF18" />
                    <Text style={{ color: "#FFBF18", fontWeight: 500 }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={props.handleImageRemove}
                    style={styles.fileUpload}
                  >
                    <AntDesign name="close" size={24} color="#db4141" />
                    <Text style={{ color: "#db4141", fontWeight: 500 }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.textImage}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flex: 1 }}
                >
                  {props.index + 1}. {fileName}
                </Text>
                <TouchableOpacity
                  onPress={props.handleImageRemove}
                  style={[styles.fileUpload]}
                >
                  <AntDesign name="close" size={20} color="#ddd" />
                </TouchableOpacity>
              </View>
            )}
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
              <FontAwesome name="image" size={24} color="#FFBF18" />
              <Text style={styles.addFileText}>
                Browse files to upload image
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
    marginHorizontal: 40,
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
  textImage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "125%",
    marginVertical: -10,
  },
  fileSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
  },
});

export default memo(ImageUpload);
