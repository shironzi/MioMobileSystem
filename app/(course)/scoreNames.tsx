import { View, StyleSheet, ScrollView } from "react-native";
import React, { memo } from "react";
import ScoreNamesCard from "@/components/ScoreNamesCard";
import HeaderConfig from "@/components/HeaderConfig";
import { useRouter } from "expo-router";

const data = [
  {
    id: 1,
    name: "Ava Samantha Arce",
    score: 50 + "/50 pts",
    attempt: "1 attempt/s",
  },
  {
    id: 2,
    name: "Aaron Josh Baon",
    score: 50 + "/50 pts",
    attempt: "5 attempt/s",
  },
  {
    id: 3,
    name: "Jorell Andrei Finez",
    score: 50 + "/50 pts",
    attempt: "7 attempt/s",
  },
  {
    id: 4,
    name: "Julia Ansherina Mendoza",
    score: 50 + "/50 pts",
    attempt: "10 attempt/s",
  },
];

const scoreNames = () => {
  HeaderConfig("Scores");

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {data.map((item) => (
            <ScoreNamesCard
              key={item.id}
              name={item.name}
              score={item.score}
              attempt={item.attempt}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
});

export default memo(scoreNames);
