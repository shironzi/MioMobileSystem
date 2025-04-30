import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const announceCard = (props: { 
    title: string; 
    date: Date; 
    time: string 
}) => {
  const router = useRouter();

  const formatDate = useCallback(
    (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },
    [Date]
  );

  return (
    <TouchableOpacity
      onPress={() => router.push("/(sub-details)/announceDetails")}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={[styles.row, styles.linkDecoration]}>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.rightSection}>
            <Text style={styles.date}>
              {formatDate(props.date)} {props.time}
            </Text>
            <Entypo name="chevron-small-right" size={30} color="#ccc" />
          </View>
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
    elevation: 5
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
    fontSize: 18,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: -10,
  },
});

export default memo(announceCard);