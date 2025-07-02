import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const NoAssignments = () => {
  return (
    <View>
      <Image
        source={require("@/assets/load/assignments.png")}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.line1}>No Assignments Yet</Text>
      <Text style={styles.line2}>
        There’s nothing available in this. {"\n"}section right now.{" "}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    margin: 20,
    alignSelf: "center",
    top: -120,
  },
  line1: {
    // left: 5,
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    top: -150,
  },
  line2: {
    fontSize: 14,
    fontWeight: 300,
    textAlign: "center",
    top: -130,
    lineHeight: 20,
  },
});

export default memo(NoAssignments);
