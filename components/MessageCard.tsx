import React, { memo } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import globalStyles from "@/styles/globalStyles";

const MessageCard = (props: {
  name: string;
  date: string;
  desc: string;
  thread: string;
  selectedType: string;
}) => {
  return (
    <View style={[globalStyles.container, styles.cardContainer]}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/(notification)/messageDetails",
            params: {
              thread: props.thread,
              name: props.name,
              selectedType: props.selectedType,
            },
          });
        }}
      >
        <View style={styles.innerContainer}>
          <View style={styles.row}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("@/assets/images/default_profile.png")}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.messageContent}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{props.name}</Text>
                <Text>{props.date}</Text>
              </View>
              <Text style={styles.descText}>
                {props.desc.length > 100
                  ? props.desc.substring(0, 47) + "..."
                  : props.desc}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: "#00000024",
    borderRadius: 20,
  },
  innerContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 20,
  },
  imageWrapper: {
    borderWidth: 1,
    padding: 2.5,
    borderRadius: 50,
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  messageContent: {
    marginVertical: "auto",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "auto",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "500",
  },
  descText: {
    fontSize: 14,
    marginTop: 5,
    height: 30,
    width: 270,
  },
});

export default memo(MessageCard);
