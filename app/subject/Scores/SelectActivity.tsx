import { View } from "react-native";
import { ActivityItem } from "@/app/subject/Scores/ScoresTypes";
import ItemCard from "@/app/subject/Scores/ItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";

const SelectActivity = () => {
  useHeaderConfig("Select Activity");

  const { sActivity, students, role, subjectId, activityType } =
    useLocalSearchParams<{
      sActivity: string;
      students: string;
      role: string;
      subjectId: string;
      activityType: string;
    }>();

  const parsedActivities: ActivityItem[] = useMemo<ActivityItem[]>(() => {
    try {
      return JSON.parse(sActivity || "[]");
    } catch {
      return [];
    }
  }, [sActivity]);

  const handleRoute = (activityId: string) => {
    router.push({
      pathname: "/subject/Scores/SelectStudent",
      params: { students, activityId, role, subjectId, activityType },
    });
  };

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      {parsedActivities.map((act) => (
        <ItemCard
          placeholder={act.title}
          key={act.activityId}
          handleRoute={() => handleRoute(act.activityId)}
        />
      ))}
    </View>
  );
};

export default SelectActivity;
