import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import globalStyles from "@/styles/globalStyles";

interface QuizFooterProps {
  onAddItem: () => void;
}

const QuizFooter = ({ onAddItem }: QuizFooterProps) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.buttonWrapper} onPress={onAddItem}>
        <Text
          style={[globalStyles.text1, { textAlign: "center", color: "#fff" }]}
        >
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizFooter;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 60,
    justifyContent: "space-evenly",
  },
  buttonWrapper: {
    width: 130,
    backgroundColor: "#FFBF18",
    paddingVertical: 8,
    color: "#fff",
    borderRadius: 15,
  },
});
