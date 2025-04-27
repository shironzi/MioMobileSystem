import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type WordListProps = {
  children: React.ReactNode;
  title?: string;
};

const WordList = ({ children, title }: WordListProps) => {
  return (
    <GestureHandlerRootView style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.wordsContainer}>{children}</View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
});

export default WordList;
