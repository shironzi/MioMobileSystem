import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteQuiz, getQuizzes } from "@/utils/query";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import NoQuizzes from "@/components/noData/NoQuizzes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import QuizCard from "@/components/QuizCard";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Quiz {
  quiz_id: string;
  title: string;
  total_points: string;
  deadline_date: string;
}

const Quiz = () => {
  HeaderConfig("Quiz");
  const router = useRouter();

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await getQuizzes(subjectId);
      setQuizzes(res.quizzes);
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  const handleSelectQuiz = (quizId: string, index: number) => {
    if (role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/quiz/AddQuiz",
        params: { subjectId: subjectId, quizId: quizId },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/quiz/ViewActivity",
        params: { quizId: quizId, subjectId: subjectId, index: index + 1 },
      });
    }
  };
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [targetQuiz, setTargetQuiz] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!targetQuiz) return;

    const res = await deleteQuiz(subjectId, targetQuiz);

    if (res.success) {
      setQuizzes((prev) => prev.filter((quiz) => quiz.quiz_id != targetQuiz));
    }
    setDeleteConfirm(false);
    setTargetQuiz(null);
  };

  return (
    <View>
      <ScrollView
        style={{ backgroundColor: "#fff", height: "100%", paddingTop: 20 }}
      >
        <View>
          {role === "teacher" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 6,
                borderStyle: "dashed",
                borderWidth: 2,
                borderRadius: 20,
                paddingVertical: 20,
                justifyContent: "center",
                backgroundColor: "#FFBF1840",
                borderColor: "#FFBF18",
                marginHorizontal: 20,
                marginBottom: 15,
              }}
              onPress={() =>
                router.push({
                  pathname: "/subject/(sub-details)/quiz/AddQuiz",
                  params: { subjectId: subjectId },
                })
              }
            >
              <Ionicons name="add-circle-sharp" size={24} color="#FFB200" />
              <Text style={[globalStyles.title, { color: "#FFB200" }]}>
                Add Quiz
              </Text>
            </TouchableOpacity>
          )}

          {quizzes ? (
            quizzes?.map((quiz, index) => (
              <GestureHandlerRootView style={{ flex: 1 }} key={index}>
                <QuizCard
                  quiz_id={quiz.quiz_id}
                  subjectId={subjectId}
                  title={quiz.title}
                  total_points={quiz.total_points}
                  role={role}
                  handleDelete={() => {
                    setDeleteConfirm(true);
                    setTargetQuiz(quiz.quiz_id);
                  }}
                />
              </GestureHandlerRootView>
            ))
          ) : (
            <View
              style={[
                { marginVertical: "auto", height: "100%" },
                role === "teacher" ? { marginTop: 180 } : { marginTop: 200 },
              ]}
            >
              <NoQuizzes />
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        isVisible={deleteConfirm}
        description={"Are you sure you want to delete this Quiz?"}
        cancelDisplay={"Cancel"}
        approveDisplay={"Delete"}
        handleCancel={() => setDeleteConfirm(false)}
        handleApprove={() => handleDelete()}
      />
    </View>
  );
};

export default memo(Quiz);
