import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CourseCard = (props: {
  courseTitle: string;
  courseSection: string;
  courseId: string;
  courseImage: string;
  description: string;
  subjectType: string;
  specializedType: string | null;
  role: string | null;
  background_color: string;
  banner_subTitle: string;
  banner_title: string;
  banner_description: string;
}) => {
  const router = useRouter();

  const getCourseCode = (title: string) => {
    const words = title.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase(); // First 2 letters of the single word
    } else {
      const firstLetter = words[0].charAt(0).toUpperCase();
      const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
      return firstLetter + lastLetter;
    }
  };

  const handleRoute = () => {
    const imageUrl = encodeURIComponent(JSON.stringify(props.courseImage));

    router.push({
      pathname: "/subject/courseDetails",
      params: {
        id: props.courseId,
        description: props.description,
        title: props.courseTitle,
        subjectType: props.subjectType,
        role: props.role,
        specializedType: props.specializedType,
        image_url: imageUrl,
        banner_subTitle: props.banner_subTitle,
        banner_title: props.banner_title,
        banner_description: props.banner_description,
      },
    });
  };

  const courseCode = getCourseCode(props.courseTitle);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleRoute}>
      <View
        style={{
          height: 250,
          borderRadius: 10,
          backgroundColor: "#fff",
          marginHorizontal: 5,
          marginVertical: 10,
          elevation: 5,
          marginTop: 10,
          marginBottom: -15,
          paddingBottom: 10,
        }}
      >
        <View>
          {props.courseImage?.trim() ? (
            <Image
              source={{ uri: props.courseImage }}
              resizeMode="cover"
              style={[
                {
                  width: "100%",
                  height: "90%",
                  borderRadius: 10,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
                props.role === "teacher"
                  ? { marginBottom: -50 }
                  : { marginBottom: -40 },
                props.background_color && {
                  backgroundColor: props.background_color,
                },
              ]}
            />
          ) : (
            <View
              style={[
                {
                  width: "100%",
                  height: "90%",
                  marginBottom: -40,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: "#DEDFE2",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ margin: "auto", fontSize: 85 }}>{courseCode}</Text>
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          <View style={{ marginVertical: "auto" }}>
            <MaterialIcons
              name="circle"
              color="#ffbf18"
              size={12}
              style={{ left: 10, marginTop: 3 }}
            />
          </View>
          <View style={{ marginTop: -20 }}>
            <Text
              style={{
                color: "#333",
                fontWeight: 500,
                fontSize: 16,
                marginLeft: 30,
                marginBottom: 2,
                textTransform: "capitalize",
                flexWrap: "wrap",
              }}
            >
              {props.courseTitle}
            </Text>
            {props.role === "teacher" && (
              <Text
                style={{
                  color: "#333",
                  marginLeft: 30,
                  fontWeight: 300,
                  fontSize: 13,
                }}
              >
                {props.courseId}
              </Text>
            )}
            <Text
              style={{
                color: "#333",
                marginLeft: 30,
                marginBottom: 10,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {props.courseSection}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CourseCard);
