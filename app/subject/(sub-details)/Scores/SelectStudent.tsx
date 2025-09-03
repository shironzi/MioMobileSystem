import { View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import ItemCard from "@/app/subject/(sub-details)/Scores/ItemCard";
import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Student } from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import useHeaderConfig from "@/utils/HeaderConfig";

const SelectStudent = () => {
  useHeaderConfig("Select Student");

  const { students, activityId, role, subjectId, activityType } =
    useLocalSearchParams<{
      students: string;
      activityId: string;
      role: string;
      subjectId: string;
      activityType: string;
    }>();

  const parsedStudents = useMemo<Student[]>(() => {
    try {
      return JSON.parse(students || "[]");
    } catch {
      return [];
    }
  }, [students]);

  const handleRoute = (studentId: string, studentName?: string) => {
    if (activityType === "remedial") {
      router.push({
        pathname: "/subject/Scores/Remedial/RemedialList",
        params: { studentId, role, subjectId, studentName },
      });
    } else if (activityType === "assignment") {
      router.push({
        pathname: "/subject/Scores/ViewAssignment",
        params: { studentId, role, subjectId, studentName, activityId },
      });
    } else {
      router.push({
        pathname: "/subject/Scores/SelectAttempt",
        params: { studentId, activityId, role, subjectId, activityType },
      });
    }

    console.log(activityType);
  };

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      {parsedStudents.map((act) => (
        <ItemCard
          placeholder={act.name}
          key={act.studentId}
          handleRoute={() => handleRoute(act.studentId, act.name)}
        />
      ))}
    </View>
  );
};

export default SelectStudent;
