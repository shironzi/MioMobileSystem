import React, { memo, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import AudioUpload from "@/components/trainingActivities/AudioUpload";
import AntDesign from "@expo/vector-icons/AntDesign";
import Recording from "@/components/trainingActivities/Recording";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import EditPlayer from "@/components/trainingActivities/EditPlayer";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  item_id: string | null;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audio_path: string[];
  filename: string[];
  audioType: ("upload" | "record")[];
}

const HomonymAudioUpload = (props: {
  item: HomonymItem;
  isTextEmpty: boolean;
  inputError: boolean;
  handleSelectAudioType: (id: string, value: "upload" | "record") => void;
  handleAddAudio: (id: string, file: FileInfo) => void;
  handleRemoveAudio: (id: string) => void;
  handleAudioRecording: (id: string, uri: string | null) => void;
  itemIndex: number;
  errorMessage: string | null | undefined;
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
      <Text style={globalStyles.text1}>Audio Type</Text>
      {!!props.errorMessage && (
        <Text style={styles.errorText}>{props.errorMessage}</Text>
      )}
      <View
        style={{
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 10,
        }}
      >
        <Picker
          mode="dropdown"
          selectedValue={props.item.audioType[props.itemIndex]}
          onValueChange={(value: "upload" | "record") =>
            props.handleSelectAudioType(props.item.id, value)
          }
        >
          <Picker.Item label="Upload an Audio File" value="upload" />
          <Picker.Item label="Record Using Microphone" value="record" />
        </Picker>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {props.item.audioType[props.itemIndex] === "upload" && (
          <View>
            {!props.item.audio?.[props.itemIndex] &&
            !props.item.audio_path?.[props.itemIndex] ? (
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
                  <Text>
                    {props.item.audio[props.itemIndex]?.name ||
                      props.item.filename[props.itemIndex]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.handleRemoveAudio(props.item.id)}
                  >
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                {(props.item.audio_path[props.itemIndex] ||
                  props.item.audio_path[props.itemIndex]) && (
                  <EditPlayer
                    uri={
                      props.item.audio?.[props.itemIndex]?.uri ??
                      props.item.audio_path[props.itemIndex]
                    }
                  />
                )}
              </View>
            )}
          </View>
        )}
        {props.item.audioType[props.itemIndex] === "record" && (
          <View>
            <Recording
              onStop={(uri: string | null) =>
                props.handleAudioRecording(props.item.id, uri)
              }
              inputError={props.inputError}
            />
            {props.item.audio?.[props.itemIndex] && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                {(props.item.audio_path ||
                  props.item.audio?.[props.itemIndex]) && (
                  <EditPlayer
                    uri={
                      props.item.audio?.[props.itemIndex].uri ??
                      props.item.audio_path!
                    }
                  />
                )}
              </View>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default memo(HomonymAudioUpload);
