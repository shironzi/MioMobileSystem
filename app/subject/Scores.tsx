import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getActivities } from "@/utils/specialized";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ScoreDropdown from "@/app/subject/(sub-details)/Scores/ScoreDropdown";
import {
  AcademicActivity,
  SpecializedActivity,
  Student,
} from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import ItemCard from "@/app/subject/(sub-details)/Scores/ItemCard";

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
  const [quizzes, setQuizzes] = useState<AcademicActivity[]>([]);
  const [assignments, setAssignments] = useState<AcademicActivity[]>([]);

  const handleRemedialRoute = () => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/SelectStudent",
      params: {
        subjectId: subjectId,
        role: role,
        activityType: "remedial",
        students: JSON.stringify(students),
      },
    });
  };

  const handleAssignmentRoute = () => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/SelectAssignment",
      params: {
        subjectId: subjectId,
        role: role,
        activityType: "assignment",
        students: JSON.stringify(students),
        assignments: JSON.stringify(assignments),
      },
    });
  };

  const handleQuizzesRoute = () => {
    router.push({
      pathname: "/subject/(sub-details)/Scores/SelectQuizzes",
      params: {
        subjectId: subjectId,
        role: role,
        activityType: "quiz",
        students: JSON.stringify(students),
        quizzes: JSON.stringify(quizzes),
      },
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
      <View style={{ paddingBottom: 50, rowGap: 20 }}>
        {specializedType === "speech" ||
          specializedType === "auditory" ||
          (specializedType === "language" && (
            <ItemCard
              placeholder={"Remedials"}
              handleRoute={handleRemedialRoute}
            />
          ))}
        <ItemCard
          placeholder={"Assignments"}
          handleRoute={handleAssignmentRoute}
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
                (act) => act.activityType === "question",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"question"}
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
        ) : specializedType === "auditory" ? (
          <View>
            <ScoreDropdown
              title={"Piddie Says"}
              sActivity={activities.filter(
                (act) => act.activityType === "bingo",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"bingo"}
            />
            <ScoreDropdown
              title={"Matching Cards"}
              sActivity={activities.filter(
                (act) => act.activityType === "matching",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"matching"}
            />
          </View>
        ) : specializedType === "language" ? (
          <View>
            <ScoreDropdown
              title={"Fill in the Box"}
              sActivity={activities.filter(
                (act) => act.activityType === "fill",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"fill"}
            />
            <ScoreDropdown
              title={"Homonyms"}
              sActivity={activities.filter(
                (act) => act.activityType === "homonyms",
              )}
              students={students}
              role={role}
              subjectId={subjectId}
              activityType={"homonyms"}
            />
          </View>
        ) : (
          <ItemCard placeholder={"Quizzes"} handleRoute={handleQuizzesRoute} />
        )}
      </View>
    </ScrollView>
  );
};

export default Scores;
