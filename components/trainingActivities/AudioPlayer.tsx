import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useAudioPlayer } from "expo-audio";

const AudioPlayer = (props: { uri: string; play: () => void }) => {
  const player = useAudioPlayer();

  useEffect(() => {
    player.replace({ uri: props.uri });
  }, [props.uri]);

  return (
    <TouchableOpacity
      onPress={() => {
        player.play();
      }}
    >
      <Text>Play</Text>
    </TouchableOpacity>
  );
};

export default AudioPlayer;
