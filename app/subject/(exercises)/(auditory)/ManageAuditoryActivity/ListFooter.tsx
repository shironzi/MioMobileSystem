import AddBingoAudio from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddBingoAudio";
import AddMatchingAudio from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddMatchingAudio";
import globalStyles from "@/styles/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Audio {
  filename: string | null;
  audio_id: string | null;
  audio_path: string;
  audio: FileInfo | null;
}
const router = useRouter();
const ListFooter = (props: {
  activityType: string | null;
  activityId: string;
  bingoAudio: Audio[];
  matchingAudio: Audio[];
  handleAudioUpload: (index: number, file: FileInfo) => void;
  handleAudioRemove: (index: number) => void;
  handleAddItem: () => void;
  handleAddAudio: () => void;
  handleRoute: () => void;
  errors?: {
    errorMessage: string;
    error: string;
  };
}) => (
  <View style={[{ marginBottom: 50, flex: 1 }]}>
    <View style={[styles.addItems, { marginBottom: -10 }]}>
      <TouchableOpacity
        style={styles.addFileRow}
        onPress={() => props.handleAddItem()}
      >
        <MaterialIcons name="add" size={20} color="#FFBF18" />
        <Text style={styles.addFileText}>Add Image</Text>
      </TouchableOpacity>
      {/* <View style={styles.divider} /> */}
    </View>
    {props.activityType === "bingo"
      ? props.bingoAudio.map((item, index) => (
          <AddBingoAudio
            key={index}
            isFirst={index === 0}
            audio={item.audio ?? null}
            filename={item.filename}
            audio_path={item.audio_path}
            handleFileUpload={(file) => props.handleAudioUpload(index, file)}
            handleFileRemove={() => props.handleAudioRemove(index)}
          />
        ))
      : props.matchingAudio.map((item, index) => (
          <AddMatchingAudio
            key={index}
            isFirst={index === 0}
            filename={item.filename}
            audio_path={item.audio_path}
            audio={item.audio ?? null}
            handleFileUpload={(file) => props.handleAudioUpload(index, file)}
            handleFileRemove={() => props.handleAudioRemove(index)}
          />
        ))}

    <View style={[styles.addItems]}>
      <TouchableOpacity
        style={styles.addFileRow}
        onPress={() => props.handleAddAudio()}
      >
        <MaterialIcons name="add" size={20} color="#FFBF18" />
        <Text style={styles.addFileText}>Add Audio</Text>
      </TouchableOpacity>
    </View>
    <View style={{ width: "70%", marginHorizontal: "auto" }}>
      <Text style={[{ textAlign: "center" }, globalStyles.errorText]}>
        {props.errors?.errorMessage}
      </Text>
    </View>
    <View style={styles.continueContainer}>
      <TouchableOpacity
        style={[globalStyles.inactivityButton, { width: "48%" }]}
        onPress={() => router.back()}
      >
        <Text style={[globalStyles.inactivityButtonText]}>
          Cancel
          {/* {props.activityId ? "Update" : "Create"} */}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.submitButton, { width: "48%" }]}
        onPress={props.handleRoute}
      >
        <Text style={[globalStyles.submitButtonText, styles.continueButton]}>
          Preview
          {/* {props.activityId ? "Preview" : "Create"} */}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  addItems: {
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    // marginVertical:-5
  },
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    borderRadius: 20,
    marginVertical: 15,
  },
  continueContainer: {
    flexDirection: "row",
    columnGap: 10,
    marginHorizontal: 30,
    marginTop: 10,
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  continueButton: {
    top: 3,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});

export default ListFooter;
