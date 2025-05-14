import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const QuizCard = (props: { 
    title: string; 
    date: Date; 
    time: string;
    score: string;
    question: string;
    type: string;
    onPress: () => void;
}) => {
  const router = useRouter();

  // const formatDate = useCallback(
  //   (date: Date) => {
  //     return date.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "2-digit",
  //       year: "numeric",
  //     });
  //   },
  //   [Date]
  // );

  return (
    <TouchableOpacity
      // onPress={() => router.navigate("/(sub-details)/assDetails")}
      onPress={props.onPress}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.yellowBulletin} />
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={3}>{props.title}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.score}>{props.score} | </Text>
              <Text style={styles.question}>{props.question}</Text>
              {/* <Text style={styles.type}> | {props.type}</Text> */}
            </View>
          </View>
          <View style={styles.rightSection}>
            {/* <Text style={styles.date}>
              {formatDate(props.date)} {props.time}
            </Text> */}
            <View style={styles.icons}>
            <TouchableOpacity>
              <Entypo name="edit" size={15} color="#aaa" style={{marginRight:8}} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="trash" size={15} color="#aaa" />
            </TouchableOpacity>
          </View>
            <Entypo name="chevron-small-right" size={30} color="#aaa" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    top:15,
  },
  cardContainer: {
    borderWidth: 0,
    margin: 0,
    padding: 0,
    borderRadius: 16,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  yellowBulletin: {
    width: "1.5%",
    height: 55,
    backgroundColor: "#FFBF18",
    borderRadius: 3,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 13,
    color: "#888",
  },
  question: {
    fontSize: 13,
    color: "#888",
  },
  type: {
    fontSize: 13,
    color: "#888",
  },
  rightSection: {
    flexDirection:"row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    textAlign: "right",
  },
  icons: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight:5,
    top: -8,
  },
});


export default memo(QuizCard);