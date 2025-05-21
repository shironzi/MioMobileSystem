import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const announceCard = (props: {
  subjectId: string;
  title: string;
  date: string;
  time: string;
  description: string;
  announcementId: string;
  role: string;
}) => {
  const router = useRouter();

  const newDate = new Date(props.date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const handleNavigate = () => {
    if (props.role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/announcement/addAnnouncement",
        params: {
          subjectId: props.subjectId,
          announcementId: props.announcementId,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/announcement/announcementDetails",
        params: {
          subjectId: props.subjectId,
          title: props.title,
          date: newDate,
          time: props.time,
          description: props.description,
          announcementId: props.announcementId,
          role: props.role,
        },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigate} style={styles.touchableOpacity}>
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <View style={styles.yellowBulletin}></View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {props.title}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.date}>
              {newDate} {props.time}
            </Text>
            <Entypo name="chevron-small-right" size={30} color="#aaa" />
          </View>
        </View>
      </View>
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
});

export default memo(announceCard);
