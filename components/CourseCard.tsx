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
    const words = title.split(" ");
    if (words.length === 1) {
      return title.slice(0, 2).toUpperCase(); // First 2 letters of a single word
    } else {
      return words.map((word) => word.charAt(0).toUpperCase()).join(""); // First letter of each word
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
                  borderEndStartRadius: 10,
                  borderEndEndRadius: 10,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: "#DEDFE2",
                  alignItems: "center",
                },
                // props.background_color && {
                //   backgroundColor: props.background_color,
                // },
              ]}
            >
              <Text style={{ margin: "auto", fontSize: 100 }}>
                {courseCode}
              </Text>
            </View>
          )}
        </View>
        <View style={{ justifyContent: "center" }}>
          <View style={{ marginVertical: "auto", marginTop: 15 }}>
            <MaterialIcons
              name="circle"
              color="#ffbf18"
              size={12}
              style={{ left: 13 }}
            ></MaterialIcons>
          </View>
          <View style={{ marginTop: -30 }}>
            <Text
              style={{
                color: "#333",
                fontWeight: 500,
                fontSize: 16,
                marginLeft: 35,
                marginBottom: 2,
                textTransform: "capitalize",
              }}
            >
              {props.courseTitle}
            </Text>
            <Text
              style={{
                color: "#333",
                marginLeft: 35,
                marginBottom: 10,
                fontWeight: 300,
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
