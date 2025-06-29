import React, { useEffect, useState } from "react";
import {
  // RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import SpeechScores from "@/app/subject/(sub-details)/Scores/SpeechScores";
import { useLocalSearchParams } from "expo-router";
import { getActivities } from "@/utils/specialized";
import { FontAwesome6 } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import QuizzesScores from "@/components/QuizzesScores";
import LoadingCard from "@/components/loadingCard";
import * as Sharing from "expo-sharing";

const IPADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS;

const Scores = () => {
  useHeaderConfig("Scores");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();
  const [activities, setActivities] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  const [assignments, setAssignments] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  async function downloadFile() {
    try {
      const url = `${IPADDRESS}/subjects/${subjectId}/scorebook`;

      const fileName = url.split("/").pop();
      if (!FileSystem.documentDirectory) {
        return;
      }
      const localUri = FileSystem.documentDirectory + fileName;

      const { uri } = await FileSystem.downloadAsync(url, localUri);
      console.log("Download completed to", uri);

      // Share the file using expo-sharing
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Sharing is not available on this platform");
      }
    } catch (error) {
      console.error("Error downloading or sharing file", error);
    }
  }

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities(subjectId);
      console.log(data);
      if (data?.success) {
        setActivities(data.activities);
        setQuizzes(data.quizzes);
        setAssignments(data.assignments);
      }

      console.log(data);
      setLoading(false);
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  // const [isRefreshing, setIsRefreshing] = useState(false);
  //
  // const onRefresh = () => {
  //   setIsRefreshing(true);
  //   setTimeout(() => {
  //     setIsRefreshing(false);
  //   }, 2000);
  // };

  return (
    <ScrollView
      style={{
        paddingVertical: 20,
        backgroundColor: "#fff",
      }}
      // refreshControl={
      //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      // }
    >
      <View style={{ paddingBottom: 50 }}>
        {/*{role === "teacher" && (*/}
        {/*  <TouchableOpacity*/}
        {/*    onPress={downloadFile}*/}
        {/*    style={{*/}
        {/*      borderStyle: "dashed",*/}
        {/*      borderWidth: 2,*/}
        {/*      borderRadius: 20,*/}
        {/*      width: "90%",*/}
        {/*      flexDirection: "row",*/}
        {/*      alignItems: "center",*/}
        {/*      justifyContent: "center",*/}
        {/*      marginHorizontal: "auto",*/}
        {/*      height: 70,*/}
        {/*      borderColor: "#FFBF18",*/}
        {/*      backgroundColor: "#FFBF1826",*/}
        {/*      columnGap: 10,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <FontAwesome6 name="file-csv" size={19} color="#FFBF18" />*/}
        {/*    <Text style={{ color: "#FFBF18" }}>Generate Report</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}
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
        {assignments.length > 0 && (
          <QuizzesScores
            subjectId={subjectId}
            quizzes={quizzes}
            role={role}
            placeholder={"Quizzes"}
          />
        )}
        {assignments.length > 0 && (
          <QuizzesScores
            subjectId={subjectId}
            quizzes={assignments}
            role={role}
            placeholder={"Assignments"}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Scores;
