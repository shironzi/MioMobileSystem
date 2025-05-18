import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const ScoresCard = (props: {
  name: string;
  difficulty: string;
  level: number;
  // score: string;
  student: string;
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/subject/scoreNames")}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.flex2}>
            <Text style={[styles.text, styles.wrapText]} numberOfLines={3}>
              {props.name}
            </Text>
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.text, styles.center]}>{props.difficulty}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.text, styles.center]}>{props.level}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.text, styles.right]}>{props.student}</Text>
            {/* <Text style={[styles.text, styles.right]}>{props.score}</Text> */}
          </View>
          <Entypo
            name="chevron-small-right"
            size={30}
            color="#ccc"
            style={{ left: -10 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    left: -15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: -15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    left: 10,
  },
  flex2: {
    flex: 1,
  },
  flex1: {
    flex: 1,
    left: -20,
  },
  text: {
    fontSize: 14,
  },
  center: {
    textAlign: "center",
    left: 10,
  },
  right: {
    textAlign: "right",
    left: -10,
  },
  wrapText: {
    flexWrap: "wrap",
  },
});

export default memo(ScoresCard);
