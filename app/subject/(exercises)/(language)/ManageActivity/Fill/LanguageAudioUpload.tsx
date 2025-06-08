import React, { memo, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import AudioUpload from "@/components/trainingActivities/AudioUpload";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Recording from "@/components/trainingActivities/Recording";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import SystemSetting from "react-native-system-setting";

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

  const handleAudioPlay = async (uri: string | null) => {
    if (!uri) return;
    player.pause();
    player.replace({ uri: uri });
    await player.seekTo(0);
    player.play();
  };

  useEffect(() => {
    SystemSetting.setVolume(1);
  }, []);

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
      <View
        style={{
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 10,
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
                    <AntDesign name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleAudioPlay(
                        props.item.audio?.uri ?? props.item.audio_path,
                      )
                    }
                  >
                    <AntDesign name="playcircleo" size={30} color="black" />
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: 15 }).map((_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name="waveform"
                        size={24}
                        color="black"
                        style={{ marginHorizontal: -4 }}
                      />
                    ))}
                  </View>
                </View>
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
            {props.item.audio && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    handleAudioPlay(
                      props.item.audio?.uri ?? props.item.audio_path,
                    )
                  }
                >
                  <AntDesign name="playcircleo" size={30} color="black" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <MaterialCommunityIcons
                      key={index}
                      name="waveform"
                      size={24}
                      color="black"
                      style={{ marginHorizontal: -4 }}
                    />
                  ))}
                </View>
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
});

export default memo(LanguageAudioUpload);
