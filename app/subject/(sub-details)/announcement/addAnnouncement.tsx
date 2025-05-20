import FileUpload from "@/components/FileUpload";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
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

  const handleFileUpload = (files: FileInfo[]) => {
    setFiles(files);
  };

  return (
    <View style={{ padding: 20, rowGap: 15 }}>
      <View style={[globalStyles.contentPadding, globalStyles.cardContainer]}>
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
      <View style={[globalStyles.cardContainer, globalStyles.cardBody]}>
        <Text style={globalStyles.sectionHeader}>File Upload</Text>

        <View style={globalStyles.contentPadding}>
          <FileUpload handleFiles={handleFileUpload} />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[globalStyles.submitButton, { width: "47%" }]}
            >
              <Text style={globalStyles.submitButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.submitButton, { width: "47%" }]}
              onPress={handlePreview}
            >
              <Text style={globalStyles.submitButtonText}>Preview</Text>
            </TouchableOpacity>
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
});

export default memo(addAnnouncement);
