import { View, Text, ScrollView } from "react-native";
import React from "react";
import CourseCard from "../components/CourseCard";

const index = () => {
  return (
    <ScrollView>
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
      {<CourseCard />}
    </ScrollView>
  );
};

export default index;
