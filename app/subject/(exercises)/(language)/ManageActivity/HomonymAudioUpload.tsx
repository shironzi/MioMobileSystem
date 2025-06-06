import React, { memo, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import AudioUpload from "@/components/trainingActivities/AudioUpload";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Recording from "@/components/trainingActivities/Recording";
import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import SystemSetting from "react-native-system-setting";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface HomonymItem {
  id: string;
  text: string[];
  answer: string[];
  distractors: string[];
  audio: FileInfo[];
  audioType: ("upload" | "record" | "system")[];
}

const HomonymAudioUpload = (props: {
  item: HomonymItem;
  isTextEmpty: boolean;
  inputError: boolean;
  handleSelectAudioType: (
    id: string,
    value: "upload" | "record" | "system",
  ) => void;
  handleAddAudio: (id: string, file: FileInfo) => void;
  handleRemoveAudio: (id: string) => void;
  handleAudioRecording: (id: string, uri: string | null) => void;
  itemIndex: number;
}) => {
  const player = useAudioPlayer();

  const speak = async () => {
    Speech.speak(props.item.text[props.itemIndex], {
      pitch: 1,
      rate: 0.5,
      language: "en-US",
      voice: "com.apple.ttsbundle.Samantha-compact",
    });
  };

  const handleAudioPlay = async (id: string, uri: string | undefined) => {
    if (!uri) return;
    player.replace({ uri });
    player.play();
  };

  useEffect(() => {
    SystemSetting.setVolume(0.9);
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
          selectedValue={props.item.audioType[props.itemIndex]}
          onValueChange={(value: "upload" | "record" | "system") =>
            props.handleSelectAudioType(props.item.id, value)
          }
        >
          <Picker.Item label="Upload an Audio File" value="upload" />
          <Picker.Item label="Record Using Microphone" value="record" />
          <Picker.Item label="Use System-Generated Speech" value="system" />
        </Picker>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        {props.item.audioType[props.itemIndex] === "upload" && (
          <View>
            {!props.item.audio[props.itemIndex] ? (
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
                  <Text>{props.item.audio[props.itemIndex]?.name}</Text>
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
                        props.item.id,
                        props.item.audio[props.itemIndex]?.uri,
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
        {props.item.audioType[props.itemIndex] === "record" && (
          <View>
            <Recording
              onStop={(uri: string | null) =>
                props.handleAudioRecording(props.item.id, uri)
              }
              inputError={props.inputError}
            />
            {props.item.audio[props.itemIndex] && (
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
                      props.item.id,
                      props.item.audio[props.itemIndex]?.uri,
                    )
                  }
                >
                  <AntDesign name="playcircleo" size={30} color="black" />
                </TouchableOpacity>
                {!props.isTextEmpty && (
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
                )}
              </View>
            )}
          </View>
        )}
        {props.item.audioType[props.itemIndex] === "system" && (
          <View style={{ flexDirection: "column", rowGap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <TouchableOpacity onPress={speak}>
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
            <View
              style={{
                alignItems: "center",
                marginHorizontal: "auto",
                flexDirection: "row",
                backgroundColor: "#FFF3CD",
                borderWidth: 1,
                borderRadius: 15,
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}
            >
              <Text style={{ alignItems: "center", textAlign: "center" }}>
                {props.isTextEmpty
                  ? "⚠️ Note: Please enter a sentence before playing the system-generated audio."
                  : "⚠️ Note: The speech output is generated in real time and is not stored in the system. If you need to keep a copy, consider recording manually or using the file upload."}
              </Text>
            </View>
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

export default memo(HomonymAudioUpload);
