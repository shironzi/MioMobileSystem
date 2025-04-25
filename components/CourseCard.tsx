import { Text, TouchableOpacity } from "react-native";
import { Card } from "@rneui/themed";
import React, { memo } from "react";
import { useRouter } from "expo-router";

const CourseCard = (props: {
  courseTitle: string;
  courseSection: string;
  courseId: number;
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(course)/courseDetails",
          params: { id: props.courseId },
        })
      }
    >
      <Card
        containerStyle={{
          borderRadius: 10,
          backgroundColor: "#f0f0f0",
          marginHorizontal: 5,
          marginVertical: 0,
        }}
      >
        <Card.Image
          source={{
            uri: "https://pic-bstarstatic.akamaized.net/ugc/093038ab9a4a29b0d4d6edb0575c82a7.jpg",
          }}
          style={{
            borderRadius: 3,
          }}
        />
        <Text
          style={{
            color: "#333",
            fontWeight: "bold",
            fontSize: 16,
            marginTop: 5,
          }}
        >
          {props.courseTitle}
        </Text>
        <Text style={{ color: "#666" }}>{props.courseSection}</Text>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(CourseCard);
