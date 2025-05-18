import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TodoCardProps = {
  sub: string;
  title: string;
  date: string;
  time: string;
  type: string;
};

const todoCard: React.FC<TodoCardProps> = (props) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.cardImage}>
          <MaterialIcons
              name="image"
              size={50}
              color="#FFBF18"
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.sub}>{props.sub}</Text>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.row}>
            <Text style={styles.date}>{formatDate(props.date)}</Text>
            <Text style={styles.time}> | {props.time}</Text>
          </View>
          <Text style={styles.type}>{props.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 20,
    flexDirection: "row",
    columnGap: 20
  },
  cardContent: {
    flexDirection: "column",
    justifyContent: "center",
  },
  cardImage: {
    width: "20%",
    marginVertical: "auto"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2264DC",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  sub: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  type: {
    fontSize: 14,
    color: "#FFBF18",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
});

export default memo(todoCard);
