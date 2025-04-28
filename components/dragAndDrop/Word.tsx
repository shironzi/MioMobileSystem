import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Word = (props: { id: number; word: string }) => {
  return (
    <View>
      <View style={[styles.wordContainer]}>
        <Text style={styles.text}>{props.word}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    backgroundColor: "#E8F1FD",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});

export default Word;
