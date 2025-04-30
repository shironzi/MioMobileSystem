import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Card } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "Module 1",
    desc: "Lorem ipsum dolor sit amet consectetur adipisice elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  },
];

const moduleDetails = () => {
  HeaderConfig("Module");

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <Card key={item.id} containerStyle={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.desc}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="download" size={24} color="#fff" />
            <Text style={styles.buttonText}>Module 1.pdf</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  cardContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    lineHeight: 30,
    width: "100%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    width: "50%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 5,
    textAlign: "center",
  },
});

export default memo(moduleDetails);
