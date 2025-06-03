import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddBingoAudio from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddBingoAudio";
import AddMatchingAudio from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddMatchingAudio";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "@/styles/globalStyles";
import React from "react";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Items {
  id: string;
  file: FileInfo | null;
  image_path: string | null;
}

interface Audio {
  audio_path: string | null;
  audio: FileInfo | null;
}

const ListFooter = (props: {
  activityType: string;
  bingoAudio: Audio[];
  matchingAudio: Audio[];
  handleAudioUpload: (index: number, file: FileInfo) => void;
  handleAudioRemove: (index: number) => void;
  handleAddItem: () => void;
  handleAddAudio: () => void;
  handleRoute: () => void;
}) => (
  <View>
    <View style={styles.addItems}>
      <TouchableOpacity
        style={styles.addFileRow}
        onPress={() => props.handleAddItem()}
      >
        <MaterialIcons name="add" size={24} color="#FFBF18" />
        <Text style={styles.addFileText}>Add Image</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
    {props.activityType === "bingo"
      ? props.bingoAudio.map((item, index) => (
          <AddBingoAudio
            key={index}
            isFirst={index === 0}
            audio={item.audio ?? null}
            handleFileUpload={(file) => props.handleAudioUpload(index, file)}
            handleFileRemove={() => props.handleAudioRemove(index)}
          />
        ))
      : props.matchingAudio.map((item, index) => (
          <AddMatchingAudio
            key={index}
            isFirst={index === 0}
            audio={item.audio ?? null}
            handleFileUpload={(file) => props.handleAudioUpload(index, file)}
            handleFileRemove={() => props.handleAudioRemove(index)}
          />
        ))}

    <View style={styles.addItems}>
      <TouchableOpacity
        style={styles.addFileRow}
        onPress={() => props.handleAddAudio()}
      >
        <MaterialIcons name="add" size={24} color="#FFBF18" />
        <Text style={styles.addFileText}>Add Audio</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.continueContainer}>
      <TouchableOpacity
        style={globalStyles.submitButton}
        onPress={props.handleRoute}
      >
        <Text style={[globalStyles.submitButtonText, styles.continueButton]}>
          Continue to Answer Selection
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  addItems: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
  },
  addFileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    borderRadius: 20,
    marginVertical: 15,
  },
  continueContainer: {
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  addFileText: {
    color: "#FFBF18",
    fontSize: 16,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "auto",
    justifyContent: "center",
    columnGap: 15,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
  },
});

export default ListFooter;
