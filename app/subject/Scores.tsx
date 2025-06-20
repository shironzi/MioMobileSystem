import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import SpeechScores from "@/app/subject/(sub-details)/Scores/SpeechScores";
import { useLocalSearchParams } from "expo-router";
import { getActivities } from "@/utils/specialized";
import { FontAwesome6 } from "@expo/vector-icons";

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
      console.log(data);
      if (data?.success && data.activities) {
        setActivities(data.activities);
      }
    };
    fetchActivities();
  }, []);

  return (
    <View style={{ paddingVertical: 20 }}>
      <TouchableOpacity
        style={{
          borderStyle: "dashed",
          borderWidth: 2,
          borderRadius: 20,
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: "auto",
          height: 70,
          borderColor: "#FFBF18",
          backgroundColor: "#FFBF1826",
          columnGap: 10,
        }}
      >
        <FontAwesome6 name="file-csv" size={19} color="#FFBF18" />
        <Text style={{ color: "#FFBF18" }}>Generate Report</Text>
      </TouchableOpacity>
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
