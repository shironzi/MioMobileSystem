import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AudioPlayer = (props: { uri: string }) => {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    player.replace({ uri: props.uri });
    player.pause();
  }, [props.uri]);

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        rowGap: 5,
        borderWidth: 1,
        borderColor: "#00000024",
        padding: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (status?.playing) {
            player.pause();
          } else {
            status.didJustFinish && player.seekTo(0);
            player.play();
          }
        }}
        style={styles.micButton}
      >
        <AntDesign
          name={status?.playing ? "pausecircleo" : "playcircleo"}
          size={20}
          color="black"
        />
      </TouchableOpacity>

      {status?.isLoaded && (
        <Slider
          style={{ height: 40, width: "90%" }}
          minimumValue={0}
          maximumValue={status.duration ?? 1}
          value={player.currentTime ?? 0}
          onSlidingComplete={(value) => {
            player.seekTo(value);
            player.pause();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioPlayer;
