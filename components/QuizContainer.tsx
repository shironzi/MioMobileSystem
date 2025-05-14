import React,{memo}from "react";
import { View, StyleSheet } from "react-native";

interface QuizContainerProps {
  children: React.ReactNode;
}

const QuizContainer = ({ children }: QuizContainerProps) => {
  return <View style={styles.container}>{children}</View>;
};

export default memo(QuizContainer);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    position: "relative",
    marginBottom: 30,
    flex: 1,
  },
});
