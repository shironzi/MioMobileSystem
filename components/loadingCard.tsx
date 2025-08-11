import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const LoadingCard = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/load/loading.png")}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.line1}>Loading, Please Wait..</Text>
      <Text style={styles.line2}>
        We're preparing for you.{"\n"}This won't take long
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
    alignSelf: "center",
    top: -50,
  },
  line1: {
    left: 5,
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    top: -80,
  },
  line2: {
    fontSize: 14,
    fontWeight: 300,
    textAlign: "center",
    top: -60,
    lineHeight: 20,
  },
});

export default memo(LoadingCard);
