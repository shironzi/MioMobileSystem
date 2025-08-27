import { View, Text } from "react-native";
import globalStyles from "@/styles/globalStyles";
import React from "react";

interface Activity {
  activityType: string;
  difficulty: string;
  activity_ids: string;
  activity_titles: string;
}

interface Props {
  activities: Activity[];
}

const SpecializedScores = ({ activities }: Props) => {
  return (
    <View>
      {activities.map((activity, index) => (
        <Text key={index} style={globalStyles.text1}>
          {activity.activityType}
        </Text>
      ))}
    </View>
  );
};

export default SpecializedScores;
