import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import HeaderConfig from "@/utils/HeaderConfig";

enum activityCategory {
  speech = "speech",
  auditory = "auditory",
  language = "language",
  academic = "academic",
}

const courseDetails = () => {
  const router = useRouter();

  const { id, description, title, subjectType, role } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    subjectType: keyof typeof activityCategory;
    role: string;
  }>();

  HeaderConfig("Course Details");

  return (
    <View style={styles.container}>
      <View style={styles.courseInfoContainer}>
        <View style={styles.courseInfo}></View>
        <View>
          <Text style={[styles.fontSizeOne]}>{id}</Text>
          <Text style={[styles.fontSizeOne]}>{title}</Text>
          <Text style={[styles.fontSizeTwo]}>{description}</Text>
        </View>
      </View>
      <View style={styles.linksContainer}>
        {subjectType !== "academic" ? (
          <TouchableOpacity
            style={styles.link}
            onPress={useCallback(() => {
              switch (subjectType) {
                case activityCategory.speech:
                  router.push({
                    pathname:
                      "/subject/(exercises)/(speech)/speechTrainingExercises",
                  });
                  break;
                case activityCategory.auditory:
                  router.push({
                    pathname:
                      "/subject/(exercises)/(language)/languageTrainingExercises",
                  });
                  break;
                case activityCategory.language:
                  router.push({
                    pathname:
                      "/subject/(exercises)/(language)/languageTrainingExercises",
                  });
                  break;
                default:
                  router.push("/subject/courseDetails");
              }
            }, [router])}
          >
            <View style={styles.linkContent}>
              <Image
                source={
                  subjectType === activityCategory.speech
                    ? require("@/assets/icons/speech.png")
                    : subjectType === activityCategory.auditory
                      ? require("@/assets/icons/auditory.png")
                      : subjectType === activityCategory.language
                        ? require("@/assets/icons/language.png")
                        : null
                }
                style={{ width: 37, height: 37 }}
              />
              <View style={styles.linkTextContainer}>
                <Text style={styles.fontSizeOne}>
                  {subjectType} Training Exercises
                </Text>
                <Entypo name="chevron-small-right" size={30} color="#CCC" />
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.link}
          onPress={useCallback(
            () =>
              router.push({
                pathname: "/subject/announcements",
                params: { subjectId: id, role: role },
              }),
            [],
          )}
        >
          <View style={styles.yellowBulletin}></View>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Announcements</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={useCallback(
            () =>
              router.push({
                pathname: "/subject/assignments",
                params: { subjectId: id },
              }),
            [],
          )}
        >
          <View style={styles.yellowBulletin}></View>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Assignments</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={useCallback(() => router.push("/subject/scores"), [])}
        >
          <View style={styles.yellowBulletin}></View>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Scores</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={useCallback(
            () =>
              router.push({
                pathname: "/subject/modules",
                params: { subjectId: id },
              }),
            [router],
          )}
        >
          <View style={styles.yellowBulletin}></View>
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Modules</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        {role === "teacher" ? (
          <TouchableOpacity
            style={styles.link}
            onPress={useCallback(
              () => router.push("/subject/attendance"),
              [router],
            )}
          >
            <View style={styles.yellowBulletin}></View>
            <View style={styles.linkDecoration}>
              <Text style={styles.fontSizeOne}>Attendance</Text>
              <Entypo name="chevron-small-right" size={30} color="#CCC" />
            </View>
          </TouchableOpacity>
        ) : null}
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
    paddingLeft: 13,
    paddingRight: 50,
    paddingVertical: 15,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    columnGap: 14,
    borderRadius: 10,
  },
  courseInfo: {
    borderColor: "#fff",
    borderWidth: 2.5,
    borderRadius: 100,
  },
  linksContainer: {
    rowGap: 10,
    marginTop: 10,
  },
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 11,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    margin: 3,
  },
  linkContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    backgroundColor: "#fff",
    paddingVertical: 4,
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
    textAlignVertical: "center",
  },
  fontSizeTwo: {
    fontSize: 15,
  },
  linkDecoration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 18,
  },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    height: "100%",
    borderWidth: 2.5,
    borderRadius: 100,
  },
});

export default memo(courseDetails);
