import { View } from "react-native";
import { ActivityItem } from "@/app/subject/Scores/ScoresTypes";
import ItemCard from "@/app/subject/Scores/ItemCard";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";

const SelectActivity = () => {
  useHeaderConfig("Select Activity");

  const { sActivity } = useLocalSearchParams<{
    sActivity: string;
  }>();

  const parsedActivities: ActivityItem[] = useMemo<ActivityItem[]>(() => {
    try {
      return JSON.parse(sActivity || "[]");
    } catch {
      return [];
    }
  }, [sActivity]);

  return (
    <View style={[globalStyles.container, { rowGap: 15 }]}>
      {parsedActivities.map((act) => (
        <ItemCard placeholder={act.title} key={act.activityId} />
      ))}
    </View>
  );
};

export default SelectActivity;
