import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@rneui/themed";
import Entypo from "@expo/vector-icons/Entypo";

const ScoresCard = (props: {
  name: string;
  difficulty: string;
  level: number;
  score: string;
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("scoreDetails")}>
      <Card containerStyle={styles.card}>
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
            <Text style={[styles.text, styles.right]}>{props.score}</Text>
          </View>
          <Entypo name="chevron-small-right" size={30} color="#ccc" style={{left:-10}} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    left: -15,
    padding: 10,
    // borderRadius: 8,
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
    // marginRight:30,
    
  }
  
});

export default memo(ScoresCard);
