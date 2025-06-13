import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import HeaderConfig from "@/utils/HeaderConfig";

const courseDetails = () => {
  const router = useRouter();

  const { id, description, title, role, subjectType, specializedType } =
    useLocalSearchParams<{
      id: string;
      title: string;
      description: string;
      subjectType: string;
      specializedType?: string;
      role: string;
    }>();

  HeaderConfig("Course Details");

  return (
    <View style={styles.container}>
      <View style={styles.courseInfoContainer}>
        <View style={styles.courseInfo}></View>
        <View>
          <Text style={[styles.fontSizeTwo, { color: "#fff" }]}>{id}</Text>
          <Text style={[styles.fontSizeOne, { color: "#fff" }]}>{title}</Text>
          <Text style={[styles.fontSizeTwo, { color: "#fff" }]}>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.linksContainer}>
        {subjectType === "specialized" && (
          <TouchableOpacity
            style={styles.link}
            onPress={useCallback(() => {
              switch (specializedType) {
                case "speech":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(speech)/speechTrainingExercises",
                    params: { subjectId: id, role: role },
                  });
                  break;
                case "auditory":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(auditory)/auditoryTrainingExercise",
                    params: { subjectId: id, role: role },
                  });
                  break;
                case "language":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(language)/languageTrainingExercises",
                    params: { subjectId: id, role: role },
                  });
                  break;
                default:
                  router.push("/subject/courseDetails");
              }
            }, [router, specializedType, id, role])}
          >
            <View style={styles.linkContent}>
              <Image
                source={
                  specializedType === "speech"
                    ? require("@/assets/icons/speech.png")
                    : specializedType === "auditory"
                      ? require("@/assets/icons/auditory.png")
                      : specializedType === "language"
                        ? require("@/assets/icons/language.png")
                        : null
                }
                style={{ width: 37, height: 37 }}
              />
              <View style={styles.linkTextContainer}>
                <Text style={styles.fontSizeOne}>
                  {specializedType} Training Exercises
                </Text>
                <Entypo name="chevron-small-right" size={30} color="#CCC" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.link}
          onPress={useCallback(
            () =>
              router.push({
                pathname: "/subject/announcements",
                params: { subjectId: id, role: role },
              }),
            [router, id, role],
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
                params: { subjectId: id, role: role },
              }),
            [router, id, role],
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
          onPress={useCallback(
            () =>
              router.push({
                pathname: "/subject/Scores",
                params: { subjectId: id },
              }),
            [router, id],
          )}
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
            [router, id],
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
    margin: 15,
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
    fontSize: 12,
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
