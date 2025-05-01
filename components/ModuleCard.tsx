import React, { memo } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const ModuleCard = (props: { title: string }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/(sub-details)/moduleDetails")}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.yellowBulletin} />
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
          </View>
          <Entypo name="chevron-small-right" size={26} color="#ccc" />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    top:15
  },
  cardContainer: {
    borderRadius:10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    margin: 0,
    borderWidth: 0,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  yellowBulletin: {
    width: "1.5%",
    height: 45,
    backgroundColor: "#FFBF18",
    borderRadius: 3,
    marginRight: 14,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
});

export default memo(ModuleCard);
