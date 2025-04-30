import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const assCard = (props: { 
    title: string; 
    date: Date; 
    time: string;
    score: string;
    type: string;
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
      onPress={() => router.navigate("/(sub-details)/assDetails")}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.cardContent}>
        <View style={[styles.linkDecoration]}>
          <View style={styles.leftContent}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.leftSection}>
              <Text style={styles.score}>{props.score}</Text>
              <Text style={styles.type}>| {props.type}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.date}>
              {formatDate(props.date)} {props.time}
            </Text>
            <Entypo name="chevron-small-right" size={30} color="#ccc" />
          </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    padding: 20,
    paddingEnd: 13,
    margin: 15,
    marginBottom: 0,
    borderRadius: 10,
    elevation: 5
  },
  cardContainer: {
    padding: 0,
    paddingLeft: 10,
    margin: 0,
    borderWidth: 0, 
    shadowColor: "transparent",

  },
  cardContent: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    color: "#000",
    marginBottom: 5,
  },
  leftSection: {
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 10, 
  },
  score: {
    fontSize: 12,
    color: "#888",
    marginRight: 5,
  },
  type: {
    fontSize: 12,
    color: "#888",
  },
  rightSection: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "flex-end",
    right: -15,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginRight: 10,
  },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    flexDirection: "row",
    left: -10,
    paddingLeft: 15,
    justifyContent: "space-between",
    width: "100%",
    height: 45,
  },
});

export default memo(assCard);