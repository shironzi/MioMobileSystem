import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PlayCard = (props: {
  id: number;
  label: string;
  activity: string;
  difficulty: string;
  category: string;
}) => {
  const router = useRouter();
  const handleCategory = () => {
    if (props.category === "speech") {
      if (props.activity === "picture_flashcards") {
        router.push({
          pathname: "/subject/(exercises)/(speech)/PictureFlashcards",
        });
      }

      if (props.activity === "flashcards") {
        router.push({
          pathname: "/subject/(exercises)/(speech)/Flashcards",
        });
      }
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCategory}>
      <View style={styles.borderLeft}></View>
      <View style={styles.linkDecoration}>
        <Text style={styles.cardNumber}>{props.id}</Text>
        <Text style={styles.cardWord}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
  },
  cardNumber: {
    fontSize: 18,
    color: "#000",
  },
  cardWord: {
    fontSize: 18,
    color: "#FFBF18",
    textDecorationLine: "underline",
  },
  linkDecoration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  borderLeft: {
    borderColor: "#FFBF18",
    borderWidth: 2.5,
    backgroundColor: "#FFBF18",
    borderRadius: 100,
    height: "100%",
  },
});

export default memo(PlayCard);
