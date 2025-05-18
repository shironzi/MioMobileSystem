import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HelpCard = (props: {
  name: string;
  time: string;
  msg: string;
  type?: string;
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Image source={require("@/assets/images/1.png")} style={styles.image} />
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{props.name}</Text>
            <Text style={styles.time}>{props.time}</Text>
          </View>
          <Text style={styles.msg}>{props.msg}</Text>
          <TouchableOpacity>
            <Text style={styles.type}>{props.type}</Text>
            <MaterialIcon
              name="verified"
              size={20}
              color="#348312"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "113%",
    left: -40,
    paddingHorizontal: 30,
    backgroundColor: "#f5f5f5",
    marginBottom: -15,
  },
  row: {
    width: "97%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    paddingRight: 40,
    left: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  msg: {
    fontSize: 14,
  },
  type: {
    fontSize: 14,
    color: "#348312",
    backgroundColor: "#a3c385",
    borderColor: "#009c41",
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: -15,
    width: "50%",
    textAlign: "center",
  },
  icon: {
    top: -10,
    left: 15,
    marginRight: 10,
  },
});
export default memo(HelpCard);
