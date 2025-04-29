import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";

type PlayCardProps = {
  id: number;
  label: string;
};

const PlayCard = ({ id, label }: PlayCardProps) => {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/activities/fillInTheBlank")}
    >
      <View style={styles.linkDecoration}>
        <Text style={styles.cardNumber}>{id}</Text>
        <Text style={styles.cardWord}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardNumber: {
    left: 10,
    fontSize: 18,
    color: "#000",
    marginBottom: 0,
  },
  cardWord: {
    fontSize: 18,
    color: "#FFBF18",
    textDecorationLine: "underline",
  },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default memo(PlayCard);
