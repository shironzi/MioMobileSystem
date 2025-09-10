import { ScrollView, StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React, { useEffect, useState } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";
import AcademicItemCard from "@/app/subject/(sub-details)/Scores/AcademicItemCard";
import { getStudentQuiz } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import LoadingCard from "@/components/loadingCard";
import { Quiz } from "@/app/subject/(sub-details)/Scores/ScoresTypes";

const ViewQuizzes = () => {
  useHeaderConfig("Quiz");

  const { studentId, subjectId, activityId } = useLocalSearchParams<{
    studentId: string;
    subjectId: string;
    activityId: string;
  }>();

  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState("");
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await getStudentQuiz(subjectId, activityId, studentId);

      setTotal(res.total);
      setScore(res.score);
      setDescription(res.description);
      setQuiz(res.quiz);

      setPercentage(() => {
        if (!res.total || res.total === 0) return 0;
        return (res.score / res.total) * 100;
      });

      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <LoadingCard />;
  }

  const totalScoreView = () => (
    <View>
      <Text style={{ fontSize: 24, color: "#1F1F1F", textAlign: "center" }}>
        {score}
      </Text>
      <Text>Points</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.cardContainer}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Score</Text>
          <View style={styles.scoreBox}>
            <AnimatedCircularProgress
              size={150}
              width={10}
              fill={percentage}
              tintColor="#2264DC"
              backgroundColor="#e7eaea"
              rotation={0}
              lineCap="round"
            >
              {totalScoreView}
            </AnimatedCircularProgress>
            <Text>Out of {total} points</Text>
          </View>
        </View>

        <View>
          <AcademicItemCard
            title={"Description"}
            description={description}
            hasScore={false}
          />

          {quiz.map((item, index) => (
            <AcademicItemCard
              key={index}
              title={`Question ${index + 1}`}
              question={item.question}
              answerType={item.type}
              options={item.options}
              studentAnswer={item.student_answer}
              totalScore={item.points.toString()}
              score={item.score.toString()}
              correct_answer={item.correct_answer}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
});

export default ViewQuizzes;
