import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivities } from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ScoreDropdown from "@/app/subject/Scores/ScoreDropdown";
import { SpecializedActivity, Student } from "@/app/subject/Scores/ScoresTypes";
import ItemCard from "@/app/subject/Scores/ItemCard";

const Scores = () => {
  useHeaderConfig("Scores");

  const { subjectId, role, specializedType } = useLocalSearchParams<{
    subjectId: string;
    role: string;
    specializedType: string;
  }>();
  const [activities, setActivities] = useState<SpecializedActivity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  const [assignments, setAssignments] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

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
        setStudents(data.students);
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ paddingBottom: 50 }}>
        <ItemCard
          placeholder={"View Remedials"}
          handleRoute={handleRemedialRoute}
        />

        {specializedType === "speech" ? (
          <View>
            <ScoreDropdown
              title={"Picture Flashcards"}
              sActivity={activities.filter(
                (act) => act.activityType === "picture",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"picture"}
            />
            <ScoreDropdown
              title={"Word Flashcards"}
              sActivity={activities.filter(
                (act) => act.activityType === "word",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"word"}
            />
            <ScoreDropdown
              title={"Reading Flashcards"}
              sActivity={activities.filter(
                (act) => act.activityType === "phrase",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"phrase"}
            />
          </View>
        ) : (
          ""
        )}

        {/*<SpecializedScores activities={activities} />*/}
        {/*{quizzes.length > 0 && (*/}
        {/*  <QuizzesScores*/}
        {/*    subjectId={subjectId}*/}
        {/*    quizzes={quizzes}*/}
        {/*    role={role}*/}
        {/*    placeholder={"Quizzes"}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{assignments.length > 0 && (*/}
        {/*  <QuizzesScores*/}
        {/*    subjectId={subjectId}*/}
        {/*    quizzes={assignments}*/}
        {/*    role={role}*/}
        {/*    placeholder={"Assignments"}*/}
        {/*  />*/}
        {/*)}*/}
      </View>

      <View></View>
    </ScrollView>
  );
};

export default Scores;
