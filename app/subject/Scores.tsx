import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import SpeechScores from "@/app/subject/(sub-details)/Scores/SpeechScores";
import { useLocalSearchParams } from "expo-router";
import { getActivities } from "@/utils/specialized";

const Scores = () => {
  useHeaderConfig("Scores");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();
  const [activities, setActivities] = useState<any>({});

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities(subjectId);
      if (data?.success && data.activities) {
        setActivities(data.activities);
      }
    };
    fetchActivities();
  }, []);

  return (
    <View>
      {Object.entries(activities).map(([activityType, difficulties]: any) =>
        Object.entries(difficulties).map(([difficulty, info]: any) => (
          <SpeechScores
            key={`${activityType}-${difficulty}`}
            subjectId={subjectId}
            difficulty={difficulty}
            placeholder={`${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Flashcards`}
            activityType={activityType}
            activityIds={info.activity_ids}
            role={role}
          />
        )),
      )}
    </View>
  );
};

export default Scores;
