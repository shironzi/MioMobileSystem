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

  const handleRoute = (studentId: string) => {
    router.push({
      pathname: "/subject/Scores/SelectAttempt",
      params: { studentId, activityId, role, subjectId, activityType },
    });
  };

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      {parsedStudents.map((act) => (
        <ItemCard
          placeholder={act.name}
          key={act.studentId}
          handleRoute={() => handleRoute(act.studentId)}
        />
      ))}
    </View>
  );
};

export default SelectStudent;
