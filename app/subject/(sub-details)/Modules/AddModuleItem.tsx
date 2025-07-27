import globalStyles from "@/styles/globalStyles";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FileUpload from "@/components/FileUpload";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React from "react";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  files: FileInfo[];
  videoLink: string[];
}

interface Error {
  name: string;
  id?: string;
  index?: number;
}

interface Props {
  index: number;
  item: ModuleSection;
  inputErrors: Error[];
  setSectionTitle: (id: string, value: string) => void;
  setSectionDesc: (id: string, value: string) => void;
  setSectionFile: (id: string, file: FileInfo[]) => void;
  setSectionLink: (id: string, value: string, idx: number) => void;
  handleAddLink: (id: string) => void;
  deleteSectionLink: (id: string, index: number) => void;
}

const AddModuleItem = ({
  index,
  item,
  inputErrors,
  setSectionTitle,
  setSectionDesc,
  setSectionFile,
  setSectionLink,
  handleAddLink,
  deleteSectionLink,
}: Props) => {
  return (
    <View style={[globalStyles.cardContainer1, { marginTop: 0 }]}>
      {index === 0 && <Text style={globalStyles.text1}>Sub-sections</Text>}
      <View>
        <Text style={globalStyles.text1}>Sub-section Title</Text>
        {inputErrors.some(
          (err) => err.name === "subsection_title" && err.id === item.id,
        ) && <Text style={globalStyles.errorText}>This field is required</Text>}
        <TextInput
          value={item.title}
          onChangeText={(value) => setSectionTitle(item.id, value)}
          style={[
            globalStyles.textInputContainer,
            inputErrors.some(
              (err) => err.name === "subsection_title" && err.id === item.id,
            ) && {
              borderColor: "red",
            },
          ]}
        />
      </View>
      <View>
        <Text style={globalStyles.text1}>Description</Text>
        <TextInput
          value={item.description}
          onChangeText={(value) => setSectionDesc(item.id, value)}
          style={[
            globalStyles.textInputContainer,
            { minHeight: 150, textAlignVertical: "top" },
          ]}
          multiline
        />
      </View>
      <View>
        <Text style={[globalStyles.text2, { marginBottom: 0 }]}>
          Image / PDF / PPT / Document Files
        </Text>
        <FileUpload
          handleFiles={(file: FileInfo[]) => {
            setSectionFile(item.id, file);
          }}
          FileUploads={item.files}
        />
        <Text style={globalStyles.text2}>
          Accepts PDF, PPT, video, images, etc. (Max: 100MB per file)
        </Text>
      </View>
      {item?.videoLink.map?.((video, idx) => (
        <View key={idx}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              value={video}
              onChangeText={(value) => setSectionLink(item.id, value, idx)}
              style={[
                { width: "90%" },
                globalStyles.textInputContainer,
                inputErrors.some(
                  (err) => err.name === "videoLink" && err.id === item.id,
                ) && { borderColor: "red" },
              ]}
            />
            <TouchableOpacity onPress={() => deleteSectionLink(item.id, idx)}>
              <FontAwesome6 name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
          <Text style={globalStyles.text2}>Video Links (YouTube, etc.)</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addFileRow}
        onPress={() => handleAddLink(item.id)}
      >
        <View
          style={{
            flexDirection: "row",
            left: -20,
          }}
        >
          <MaterialIcons name="add" size={20} color="#FFBF18" />
          <Text style={styles.addFileText}>Add Link</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    left: 10,
    padding: 5,
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
    marginLeft: 5,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default AddModuleItem;
