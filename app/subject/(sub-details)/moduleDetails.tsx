import HeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <View key={item.id} style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.desc}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="download" size={24} color="#fff" />
            <Text style={styles.buttonText}>Module 1.pdf</Text>
          </TouchableOpacity>
        </View>
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
    elevation: 5,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2264dc",
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
