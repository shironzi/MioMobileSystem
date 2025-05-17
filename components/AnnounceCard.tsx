import React, { memo, useCallback,useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Modal } from "react-native";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import DeleteCard from "./deleteCard";

const announceCard = (props: { title: string; date: String; time: string }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(sub-details)/announceDetails")}
      style={styles.touchableOpacity}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.row}>
          <View style={styles.yellowBulletin}></View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.date}>
              {props.date} {props.time}
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity>
                <Entypo
                  name="edit"
                  size={15}
                  color="#aaa"
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Entypo name="trash" size={15} color="#aaa" />
              </TouchableOpacity>
            </View>
            <Entypo name="chevron-small-right" size={30} color="#aaa" />
          </View>
        </View>
      </Card>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteCard}
        onRequestClose={() => setShowDeleteCard(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DeleteCard onClose={() => setShowDeleteCard(false)} />
          </View>
        </View>
      </Modal>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    padding: 15,
    paddingEnd: 0,
    margin: 15,
    marginBottom: 0,
    borderRadius: 10,
    elevation: 5,
  },
  cardContainer: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
    shadowColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    left: -5,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  linkDecoration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 18,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: -10,
  },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    height: 45,
    width: "1.5%",
    borderRadius: 100,
    left: -20,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: -20,
  },
  icons: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight: -5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 10,
  },
});

export default memo(announceCard);
