import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HeaderConfig from "@/utils/HeaderConfig";

const newCourseDetails = () => {
  const router = useRouter();
  const {
    id,
    title,
    role,
    subjectType,
    specializedType,
    image_url,
    banner_description,
    banner_subTitle,
    banner_title,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    subjectType: string;
    specializedType?: string;
    role: string;
    image_url: string;
    banner_subTitle: string;
    banner_title: string;
    banner_description: string;
  }>();

  const parsedImageUrl = useMemo<string>(() => {
    try {
      return JSON.parse(image_url || "");
    } catch {
      return [];
    }
  }, [image_url]);

  const headerTitle =
    subjectType === "specialized" && role !== "parent"
      ? specializedType === "speech"
        ? "Speech Development"
        : specializedType === "auditory"
          ? "Auditory Development"
          : specializedType === "language"
            ? "Language Development"
            : "Course Details"
      : "Course Details";

  HeaderConfig(headerTitle);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getCourseCode = () => {
    const words = title.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase(); // First 2 letters of the single word
    } else {
      const firstLetter = words[0].charAt(0).toUpperCase();
      const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
      return firstLetter + lastLetter;
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      style={{ backgroundColor: "#fff", flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.cardContainer}>
        {parsedImageUrl.trim().length > 0 ? (
          <Image source={{ uri: parsedImageUrl }} style={styles.subImg} />
        ) : (
          <Text style={{ margin: "auto", fontSize: 85 }}>
            {getCourseCode()}
          </Text>
        )}

        <View style={styles.group}>
          <Text style={styles.subId}>{banner_subTitle}</Text>
          <Text style={styles.subName}>{banner_title}</Text>
          <Text style={styles.subDesc}>{banner_description}</Text>
        </View>
      </View>

      <View style={styles.subContainer}>
        {subjectType === "specialized" && role !== "parent" && (
          <TouchableOpacity
            onPress={useCallback(() => {
              switch (specializedType) {
                case "speech":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(speech)/speechTrainingExercises",
                    params: { subjectId: id, role },
                  });
                  break;
                case "auditory":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(auditory)/auditoryTrainingExercise",
                    params: { subjectId: id, role },
                  });
                  break;
                case "language":
                  router.push({
                    pathname:
                      "/subject/(exercises)/(language)/languageTrainingExercises",
                    params: { subjectId: id, role },
                  });
                  break;
                default:
                  router.push("/subject/courseDetails");
              }
            }, [router, specializedType, id, role])}
          >
            <Image
              resizeMode="contain"
              source={
                specializedType === "speech"
                  ? require("@/assets/course/speechHeader.png")
                  : specializedType === "auditory"
                    ? require("@/assets/course/auditoryHeader.png")
                    : require("@/assets/course/languageHeader.png")
              }
              style={styles.speech}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.subCourse}
          onPress={useCallback(() => {
            router.push({
              pathname: "/subject/announcements",
              params: { subjectId: id, role },
            });
          }, [router, id, role])}
        >
          <View style={styles.row}>
            <Image
              source={require("@/assets/course/ann.png")}
              style={styles.courseImg}
            />
            <Text style={{ fontSize: 14, left: -40 }}>Announcements</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={20}
              color="#1f1f1f"
              style={{ left: 15 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subCourse}
          onPress={useCallback(() => {
            router.push({
              pathname: "/subject/assignments",
              params: { subjectId: id, role },
            });
          }, [router, id, role])}
        >
          <View style={styles.row}>
            <Image
              source={require("@/assets/course/ass.png")}
              style={[styles.courseImg, { left: -20 }]}
            />
            <Text style={{ fontSize: 14, left: -50 }}>Assignments</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={20}
              color="#1f1f1f"
              style={{ left: 15 }}
            />
          </View>
        </TouchableOpacity>

        {subjectType === "academics" && (
          <TouchableOpacity
            style={styles.subCourse}
            onPress={useCallback(() => {
              router.push({
                pathname: "/subject/Quizzes",
                params: { subjectId: id, role },
              });
            }, [router, id, role])}
          >
            <View style={styles.row}>
              <Image
                source={require("@/assets/course/qz.png")}
                style={[styles.courseImg, { width: 48, left: -20 }]}
              />
              <Text style={{ fontSize: 14, left: -70 }}>Quizzes</Text>
              <FontAwesome6
                name="arrow-right-long"
                size={20}
                color="#1f1f1f"
                style={{ left: 15 }}
              />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.subCourse}
          onPress={useCallback(() => {
            router.push({
              pathname: "/subject/Scores",
              params: { subjectId: id, role },
            });
          }, [router, id, role])}
        >
          <View style={styles.row}>
            <Image
              source={require("@/assets/course/score.png")}
              style={[styles.courseImg, { left: -15 }]}
              // resizeMode="contain"
            />
            <Text style={{ fontSize: 14, left: -70 }}>Scores</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={20}
              color="#1f1f1f"
              style={{ left: 15 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subCourse}
          onPress={useCallback(() => {
            router.push({
              pathname: "/subject/modules",
              params: {
                subjectId: id,
                role: role,
                specializedType: specializedType ?? "",
              },
            });
          }, [router, id, role, specializedType])}
        >
          <View style={styles.row}>
            <Image
              source={require("@/assets/course/module.png")}
              resizeMode="contain"
              style={[styles.courseImg, { width: 48, left: -20 }]}
            />
            <Text style={{ fontSize: 14, left: -65 }}>Modules</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={20}
              color="#1f1f1f"
              style={{ left: 15 }}
            />
          </View>
        </TouchableOpacity>

        {role === "teacher" && (
          <TouchableOpacity
            style={styles.subCourse}
            onPress={useCallback(() => {
              router.push({
                pathname: "/subject/attendance",
                params: { subjectId: id, role: role },
              });
            }, [router, id, role])}
          >
            <View style={styles.row}>
              <Image
                source={require("@/assets/course/attendance.png")}
                style={[styles.courseImg, { width: 40 }]}
              />
              <Text style={{ fontSize: 14, left: -50 }}>Attendance</Text>
              <FontAwesome6
                name="arrow-right-long"
                size={20}
                color="#1f1f1f"
                style={{ left: 15 }}
              />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.subCourse}
          onPress={useCallback(() => {
            router.push({
              pathname: "/subject/Peoples",
              params: { subjectId: id, role: role },
            });
          }, [router, id, role])}
        >
          <View style={styles.row}>
            <Image
              source={require("@/assets/course/people.png")}
              style={[styles.courseImg, { width: 40 }]}
            />
            <Text style={{ fontSize: 14, left: -50 }}>People</Text>
            <FontAwesome6
              name="arrow-right-long"
              size={20}
              color="#1f1f1f"
              style={{ left: 15 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default memo(newCourseDetails);

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    // padding: 20,
    // backgroundColor: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  subImg: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 130,
    width: "100%",
  },
  group: {
    margin: 20,
  },
  subId: {
    color: "#828282",
    top: -10,
    fontSize: 14,
    // margin: 10,
    // left: 10,
  },
  subName: {
    top: -5,
    fontSize: 18,
    color: "#2264dc",
    fontWeight: 500,
    // margin: 10,
    // left: 10,
  },

  subDesc: {
    textAlign: "justify",
    fontWeight: 300,
    fontSize: 12,
  },
  subContainer: {},
  speech: {
    height: 115,
    width: "91%",
    marginHorizontal: "auto",
  },
  subCourse: {
    backgroundColor: "000",
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    padding: 10,
  },
  courseImg: {
    height: 40,
    width: 40,
    left: -10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
});
