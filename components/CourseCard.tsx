import { Text, TouchableOpacity } from "react-native";
import { Card } from "@rneui/themed";
import React from "react";
import { useRouter } from "expo-router";

const CourseCard = () => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.navigate("/course/courseDetails")}>
      <Card containerStyle={{ borderRadius: 10 }}>
        <Card.Image
          source={{
            uri: "https://media.istockphoto.com/id/486555606/vector/black-vector-grunge-stamp-sample.jpg?s=612x612&w=0&k=20&c=IL8MiWgIr3okKuK4ZuA2qmEU2YlIFSfyQYZCDAA6MIY=",
          }}
        />
        <Text>Course Title</Text>
        <Text>Course Section</Text>
      </Card>
    </TouchableOpacity>
  );
};

export default CourseCard;
