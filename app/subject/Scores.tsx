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

  const generateScoreBook = async () => {
    const filename = "scorebook.pdf";
    const result = await FileSystem.downloadAsync(
      `${IPADDRESS}/subjects/${subjectId}/scorebook`,
      FileSystem.documentDirectory + filename,
    );

    saveFile(result.uri, filename, result.headers["Content-Type"]);
    console.log(filename);
  };

  const saveFile = async (uri: string, filename: string, mimeType: string) => {
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permission.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        filename,
        mimeType,
      ).then(async (uri) => {
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      });
    } else {
      shareAsync(uri);
    }
  };

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
        {role === "teacher" && (
          <TouchableOpacity
            onPress={generateScoreBook}
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
        )}
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
