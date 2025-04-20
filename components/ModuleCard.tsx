import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const moduleCard = (props: { 
    title: string; 
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/(sub-details)/moduleDetails")}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={[styles.row, styles.linkDecoration]}>
          <Text style={styles.title}>{props.title}</Text>
          <Entypo name="chevron-small-right" size={30} color="#ccc" />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    padding: 15,
    paddingEnd: 0,
    margin: 15,
    marginBottom: 0,
    borderRadius: 10,
  },
  cardContainer: {
    padding: 0,
    margin: 0,
    borderWidth: 0, 
    shadowColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
  },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

});

export default memo(moduleCard);