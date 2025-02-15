import { ScrollView, Text } from "react-native";
import React, { memo } from "react";
import CourseCard from "@/components/CourseCard";

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

export default memo(index);
