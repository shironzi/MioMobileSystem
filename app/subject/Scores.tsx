import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import SpeechScores from "@/app/subject/(sub-details)/Scores/SpeechScores";
import { router, useLocalSearchParams } from "expo-router";
import { getActivities } from "@/utils/specialized";
import QuizzesScores from "@/components/QuizzesScores";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome } from "@expo/vector-icons";

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

  // async function downloadFile() {
  //   try {
  //     const url = `${IPADDRESS}/subjects/${subjectId}/scorebook`;
  //
  //     const fileName = url.split("/").pop();
  //     if (!FileSystem.documentDirectory) {
  //       return;
  //     }
  //     const localUri = FileSystem.documentDirectory + fileName;
  //
  //     const { uri } = await FileSystem.downloadAsync(url, localUri);
  //     console.log("Download completed to", uri);
  //
  //     // Share the file using expo-sharing
  //     if (await Sharing.isAvailableAsync()) {
  //       await Sharing.shareAsync(uri);
  //     } else {
  //       console.log("Sharing is not available on this platform");
  //     }
  //   } catch (error) {
  //     console.error("Error downloading or sharing file", error);
  //   }
  // }

  const handleRemedialRoute = () => {
    if (role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/Scores/ScoreStudentList",
        params: { subjectId: subjectId, role: role, activityType: "remedial" },
      });
      return;
    }
    router.push({
      pathname: "/subject/(sub-details)/Scores/Remedial/RemedialList",
      params: { subjectId: subjectId, role: role },
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities(subjectId);
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

  return (
    <ScrollView
      style={{
        paddingVertical: 20,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ paddingBottom: 50 }}>
        <TouchableOpacity
          style={[
            globalStyles.cardContainer,
            {
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
          onPress={handleRemedialRoute}
        >
          <Text style={globalStyles.text1}>View Remedials</Text>
          <FontAwesome name="long-arrow-right" size={24} color="black" />
        </TouchableOpacity>
        {Object.entries(activities).map(([activityType, difficulties]: any) =>
          Object.entries(difficulties).map(([difficulty, info]: any) => (
            <SpeechScores
              key={`${activityType}-${difficulty}`}
              subjectId={subjectId}
              difficulty={difficulty}
              placeholder={`${
                activityType === "phrase"
                  ? "Reading Flashcards"
                  : activityType === "question"
                    ? "Word Flashcards"
                    : activityType === "picture"
                      ? "Picture Flashcards"
                      : activityType === "bingo"
                        ? "Piddie Says"
                        : activityType === "matching"
                          ? "Matching Cards"
                          : activityType.charAt(0).toUpperCase() +
                            activityType.slice(1)
              } `}
              activityType={activityType}
              activityIds={info.activity_ids}
              role={role}
            />
          )),
        )}
        {quizzes.length > 0 && (
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
