import AudioUpload from "@/components/trainingActivities/AudioUpload";
import EditPlayer from "@/components/trainingActivities/EditPlayer";
import Recording from "@/components/trainingActivities/Recording";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { memo, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface FillItem {
  id: string;
  item_id: string | null;
  text: string;
  distractors: string[];
  audio: FileInfo | null;
  filename: string | null;
  audio_path: string | null;
  audioType: "upload" | "record";
}

const LanguageAudioUpload = (props: {
  item: FillItem;
  isTextEmpty: boolean;
  inputError: boolean;
  handleSelectAudioType: (id: string, value: "upload" | "record") => void;
  handleAddAudio: (id: string, file: FileInfo) => void;
  handleRemoveAudio: (id: string) => void;
  handleAudioRecording: (id: string, uri: string | null) => void;
}) => {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    return () => {
      if (status.playing) {
        player.pause();
      }
    };
  }, []);

  return (
    <View style={styles.audioRow}>
      <Text style={[globalStyles.text1, { marginVertical: 10, marginTop:-5 }]}>Audio Type</Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 10,
          borderColor:"#ddd"
        }}
      >
        <Picker
          mode="dropdown"
          selectedValue={props.item.audioType}
          onValueChange={(value: "upload" | "record") =>
            props.handleSelectAudioType(props.item.id, value)
          }
        >
          <Picker.Item label="Upload an Audio File" value="upload" />
          <Picker.Item label="Record Using Microphone" value="record" />
        </Picker>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {props.item.audioType === "upload" && (
          <View>
            {!props.item.audio && !props.item.audio_path ? (
              <AudioUpload
                handleFiles={(file: FileInfo) =>
                  props.handleAddAudio(props.item.id, file)
                }
                handleAudioRemove={() => props.handleRemoveAudio(props.item.id)}
                audioUri={null}
                isError={props.inputError}
                filename={null}
                audio_path={null}
              />
            ) : (
              <View style={{ flexDirection: "column", rowGap: 5 }}>
                <View style={styles.itemHeaderRow}>
                  <Text>{props.item.audio?.name ?? props.item.filename}</Text>
                  <TouchableOpacity
                    onPress={() => props.handleRemoveAudio(props.item.id)}
                  >
                    <AntDesign name="close" size={24} color="#db4141" />
                  </TouchableOpacity>
                </View>
                {(props.item.audio_path || props.item.audio) && (
                  <EditPlayer
                    uri={props.item.audio?.uri ?? props.item.audio_path!}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {props.item.audioType === "record" && (
          <View>
            <Recording
              onStop={(uri: string | null) =>
                props.handleAudioRecording(props.item.id, uri)
              }
              inputError={props.inputError}
            />
            {(props.item.audio_path || props.item.audio) && (
              <EditPlayer
                uri={props.item.audio?.uri ?? props.item.audio_path!}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioRow: {
    flexDirection: "column",
    justifyContent: "space-around",
  
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default memo(LanguageAudioUpload);
