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

  const courseCode = getCourseCode(props.courseTitle);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/subject/courseDetails",
          params: {
            id: props.courseId,
            description: props.description,
            title: props.courseTitle,
            subjectType: props.subjectType,
            role: props.role,
            specializedType: props.specializedType,
          },
        })
      }
    >
      <View
        style={{
          height: 190,
          borderRadius: 10,
          backgroundColor: "#fff",
          marginHorizontal: 5,
          marginVertical: 10,
          elevation: 5,
          marginTop: 10,
          marginBottom: -15,
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
                  height: "95%",
                  marginBottom: -40,
                  borderRadius: 10,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
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
                  height: "95%",
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
        <View style={{}}>
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
            <Text
              style={{
                color: "#333",
                marginLeft: 30,
                marginBottom: 10,
                fontWeight: 300,
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
