import { Text, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { useEffect, useState } from "react";
import { getRemedialList } from "@/utils/specialized";
import { useLocalSearchParams } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import RemedialItem from "@/app/subject/(sub-details)/Scores/Remedial/RemedialItem";

interface Remedial {
  activity_title: string;
  remedialId: string;
  activityType: string;
}

const RemedialList = () => {
  useHeaderConfig("Scores");

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [activeRemedial, setActivityRemedial] = useState<Remedial[]>([]);
  const [inactiveRemedial, setInactivityRemedial] = useState<Remedial[]>([]);

  useEffect(() => {
    const fetchRemedial = async () => {
      const res = await getRemedialList(subjectId);

      console.log(res);
      if (res.success) {
        setActivityRemedial(res.active_remedials);
        setInactivityRemedial(res.inactive_remedials);
      }
    };

    fetchRemedial();
  }, []);

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      {activeRemedial.map((item) => (
        <RemedialItem subjectId={subjectId} remedial={item} />
      ))}
      <View style={globalStyles.cardContainer1}>
        <Text>Archive</Text>
      </View>
    </View>
  );
};

export default RemedialList;
