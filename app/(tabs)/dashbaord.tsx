import { View, Text } from "react-native";
import React from "react";
import CourseCard from "../../components/CourseCard";

const dashbaord = () => {
  return (
    <View>
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
    </View>
  );
};

export default dashbaord;
