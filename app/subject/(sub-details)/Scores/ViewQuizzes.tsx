import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";
import AcademicItemCard from "@/app/subject/(sub-details)/Scores/AcademicItemCard";
import { getStudentQuiz, updateStudentQuiz } from "@/utils/query";
import { router, useLocalSearchParams } from "expo-router";
import LoadingCard from "@/components/loadingCard";
import { Quiz } from "@/app/subject/(sub-details)/Scores/ScoresTypes";
import Button from "@/components/commons/Button";
import Score from "@/components/commons/Score";
import CompletedAlert from "@/components/Alerts/CompletedAlert";

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
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const res = await updateStudentQuiz(
      subjectId,
      activityId,
      studentId,
      quiz,
      comment,
    );

    if (res.success) {
      setModalMessage(res.message);
    } else {
      setModalMessage(
        "Something went wrong while updating the student quiz. Please try again.",
      );
    }
    setShowModal(true);
  };
  const handleCancel = () => {
    router.back();
    router.back();
    router.back();
  };

  const handleItemScore = (
    question_id: string,
    score: string,
    points: number,
  ) => {
    let newScore = parseInt(score);

    if (isNaN(newScore)) {
      newScore = 0;
    } else if (newScore < 0) {
      newScore = 0;
    } else if (newScore > points) {
      newScore = points;
    }

    setQuiz((items) =>
      items.map((item) =>
        item.question_id === question_id ? { ...item, score: newScore } : item,
      ),
    );
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await getStudentQuiz(subjectId, activityId, studentId);

      setTotal(res.total);
      setScore(res.score);
      setDescription(res.description);
      setQuiz(res.quiz);
      setComment(res.comments);

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

  return (
    <View style={[globalStyles.container]}>
      {showModal && (
        <CompletedAlert message={modalMessage} handleButton={handleCancel} />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ rowGap: 20 }}>
          <Score
            percentage={percentage}
            score={score}
            setScore={setScore}
            total={total}
          />

          <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.text1}>Comment</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              style={styles.commentInput}
              placeholder={"Add your comment here"}
            />
          </View>

          <View style={{ rowGap: 20 }}>
            <AcademicItemCard
              title={"Description"}
              description={description}
              hasScore={false}
            />

            <View style={{ rowGap: 10 }}>
              {quiz.map((item, index) => (
                <AcademicItemCard
                  key={index}
                  title={`Question ${index + 1}`}
                  question={item.question}
                  answerType={item.type}
                  options={item.options}
                  studentAnswer={item.student_answer}
                  totalScore={item.max_point.toString()}
                  score={item.points.toString()}
                  correct_answer={item.correct_answer}
                  setScore={(score) =>
                    handleItemScore(item.question_id, score, item.max_point)
                  }
                />
              ))}
            </View>
          </View>

          <Button
            submit={handleSubmit}
            cancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  commentInput: {
    borderWidth: 1,
    borderColor: "#82828257",
    borderRadius: 10,
    minHeight: 100,
    textAlignVertical: "top",
    paddingHorizontal: 10,
  },
});

export default ViewQuizzes;
