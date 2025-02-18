import { View, Text, StyleSheet } from "react-native";
import React, { memo, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, useNavigation } from "expo-router";

import globalStyle from "@/styles/globalStyle";

const courseDetails = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Course Details",
      headerStyle: {
        backgroundColor: "#2264DC",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  return (
    <View style={[globalStyle.container, styles.container]}>
      <View style={styles.courseInfoContainer}>
        <View style={styles.courseInfo}>
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Course Code
          </Text>
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Course Title
          </Text>
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis
            maiores, quidem voluptate quis facere doloribus quas optio. Nisi
            tempore iure error labore est quisquam repudiandae itaque, aperiam
            quia, vitae reiciendis. Lorem
          </Text>
        </View>
      </View>
      <View style={styles.linksContainer}>
        <Link href={"/(course)/speechTrainingExercises"} style={styles.link}>
          <View style={styles.linkContent}>
            <MaterialIcons name="record-voice-over" size={40} color="#FFBF18" />
            <View style={styles.linkTextContainer}>
              <Text style={styles.fontSizeOne}>Speech Training Exercises</Text>
              <Entypo name="chevron-small-right" size={30} color="#CCC" />
            </View>
          </View>
        </Link>
        <Link href={"/(course)/announcements"} style={styles.link}>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Announcements</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </Link>
        <Link href={"/(course)/assignments"} style={styles.link}>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Assignments</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </Link>
        <Link href={"/(course)/scores"} style={styles.link}>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Scores</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </Link>
        <Link href={"/(course)/modules"} style={styles.link}>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Modules</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  courseInfoContainer: {
    backgroundColor: "#1F1F1F",
    padding: 13,
    borderRadius: 10,
  },
  courseInfo: {
    borderLeftColor: "#fff",
    borderLeftWidth: 5,
    paddingHorizontal: 19,
  },
  linksContainer: {
    rowGap: 10,
    marginTop: 10,
  },
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  linkContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: "100%",
  },
  linkTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fontSizeOne: {
    fontSize: 18,
  },
  fontSizeTwo: {
    fontSize: 15,
  },
  fontSizeThree: {
    fontSize: 14,
  },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    paddingLeft: 19,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default memo(courseDetails);
