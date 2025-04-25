import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
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
        }
  return (
    <TouchableOpacity>
      <Card containerStyle={styles.card}>
        <View style={styles.cardContent}>
          <MaterialIcons name="image" size={50} color="#FFBF18" style={styles.icon} />
          <Text style={styles.sub}>{props.sub}</Text>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.row}>
            <Text style={styles.date}>{formatDate(props.date)}</Text>
            <Text style={styles.time}> | {props.time}</Text>
          </View>
          <Text style={styles.type}>{props.type}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    left: -15,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 5,
    padding: 20,
    height: 110,
    
  },
  cardContent: {
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    left: 70,
    top: -50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2264DC",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  sub: {
    left: 70,
    top: -50,
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  type: {
    left: 70,
    top: -50,
    fontSize: 14,
    color: "#FFBF18",
  },
  row: {
    left: 70,
    top: -50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    marginRight: 10,
    left: 0,
    top: 20,
  },
});

export default memo(todoCard);