import { View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import globalStyles from "@/styles/globalStyles";
import { AcademicActivity } from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import React, { useMemo } from "react";
import ItemCard from "@/app/subject/(sub-details)/Scores/ItemCard";
import { router, useLocalSearchParams } from "expo-router";

const SelectAssignment = () => {
  useHeaderConfig("Select Quiz");

  const { students, role, subjectId, quizzes, activityType } =
    useLocalSearchParams<{
      students: string;
      quizzes: string;
      role: string;
      subjectId: string;
      activityType: string;
    }>();

  const handleRoute = (activityId: string) => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/SelectStudent",
      params: {
        students,
        role,
        subjectId,
        activityId,
        activityType,
      },
    });
  };

  const parsedStudents = useMemo<AcademicActivity[]>(() => {
    try {
      return JSON.parse(quizzes || "[]");
    } catch {
      return [];
    }
  }, [quizzes]);

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      {parsedStudents.map((ass) => (
        <ItemCard
          placeholder={ass.title}
          key={ass.id}
          handleRoute={() => handleRoute(ass.id)}
        />
      ))}
    </View>
  );
};

export default SelectAssignment;
