import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const level = () => {
  const router = useRouter();

  HeaderConfig("Levels");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Difficulty Level</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/subject/(exercises)/play")}
        >
          <MaterialIcons
            name="star"
            size={50}
            color="#009c41"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#009c41" }]}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FFda03"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FFda03" }]}>Average</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FFa700"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FFa700" }]}>Difficult</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons
            name="star"
            size={50}
            color="#FF0000"
            style={styles.icon}
          />
          <Text style={[styles.cardText, { color: "#FF0000" }]}>Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    // alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    left: 0,
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    // flexWrap: "wrap",
    gap: 20,
  },
  card: {
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    // marginTop: 10,
    left: 80,
    marginTop: -35,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  icon: {
    left: 15,
    marginTop: 20,
  },
});

export default memo(level);
