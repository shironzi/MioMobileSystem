import { View } from "react-native";
import { ActivityItem } from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import ItemCard from "@/app/subject/(sub-details)/Scores/ItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import * as SecureStore from "expo-secure-store";

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

  const handleRoute = async (activityId: string) => {
    if (role === "student" || role === "parent") {
      const studentId =
        (await SecureStore.getItemAsync("studentid")) ??
        (await SecureStore.getItemAsync("id"));

      router.push({
        pathname: "/subject/Scores/SpecializedScore",
        params: { studentId, activityId, role, subjectId, activityType },
      });
      return;
    }

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
