import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from "expo-router";

import globalStyle from "@/styles/globalStyle";
import HeaderConfig from "@/components/HeaderConfig";

enum activityCategory {
  speech = "Speech",
  auditory = "Auditory",
  language = "Language",
  academic = "Academic",
}

const data = [
  {
    courseId: 1,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.academic,
  },
  {
    courseId: 2,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.academic,
  },
  {
    courseId: 3,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.academic,
  },
  {
    courseId: 4,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.speech,
  },
  {
    courseId: 5,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.auditory,
  },
  {
    courseId: 6,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.language,
  },
  {
    courseId: 7,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.language,
  },
  {
    courseId: 8,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.language,
  },
  {
    courseId: 9,
    title: "Academic",
    section: "tw23",
    activityCategory: activityCategory.language,
  },
];

const courseDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<{
    courseId: number;
    title: string;
    section: string;
    activityCategory: activityCategory;
  } | null>(null);

  useEffect(() => {
    const courseId = Number(id);
    const foundCourse = data?.find((c) => c.courseId === courseId);
    setCourse(foundCourse ?? null);
  }, [id]);

  HeaderConfig("Course Details");

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
        <TouchableOpacity 
          style={[styles.link, styles.content]}
          onPress={useCallback(() => {
            if (!course) return;

            switch (course.activityCategory) {
              case activityCategory.speech:
                router.push({
                  pathname: "/(course)/(speech)/speechTrainingExercises",
                });
                break;
              case activityCategory.auditory:
                router.push({
                  pathname: "/(course)/(auditory)/auditoryTrainingExercises",
                });
                break;
              case activityCategory.language:
                router.push({
                  pathname: "/(course)/(speech)/languageTrainingExercises",
                });
                break;
              default:
                router.push("/(course)/(speech)/speechTrainingExercises");
            }
          }, [course, router])}
        >
          <View style={styles.linkContent}>
            <Image
              source={
                course?.activityCategory === activityCategory.speech
                  ? require("@/assets/icons/speech.png")
                  : course?.activityCategory === activityCategory.auditory
                  ? require("@/assets/icons/auditory.png")
                  : course?.activityCategory === activityCategory.language
                  ? require("@/assets/icons/language.png")
                  : null
              }
              style={{ width: 37, height: 37 }}
            />
            <View style={styles.linkTextContainer}>
              <Text style={styles.fontSizeOne}>
                {course?.activityCategory} Training Exercises
              </Text>
              <Entypo name="chevron-small-right" size={30} color="#CCC" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, styles.content]}
          onPress={useCallback(
            () => router.push("/(course)/announcements"),
            []
          )}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Announcements</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, styles.content]}
          onPress={useCallback(() => router.push("/(course)/assignments"), [])}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Assignments</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, styles.content]}
          onPress={useCallback(() => router.push("/(course)/scores"), [])}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Scores</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, styles.content]}
          onPress={useCallback(
            () => router.push("/(course)/modules"),
            [router]
          )}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Modules</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </TouchableOpacity>
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
    elevation: 5
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
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
    textAlignVertical:"center",
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
  content: {
    elevation: 2,
    margin: 3
  }
});

export default memo(courseDetails);
