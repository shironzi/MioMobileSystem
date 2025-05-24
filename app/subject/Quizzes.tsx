import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import QuizCard from "@/components/QuizCard";
import { getQuizzes } from "@/utils/query";

const Quiz = () => {
  HeaderConfig("Quiz");
  const router = useRouter();

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<
    {
      quiz_id: string;
      total: number;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizzes(subjectId);

        setQuizzes(res.quizzes);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Quizzes Error: " + err);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading.......</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {quizzes.length > 0 ? (
          <View style={styles.content}>
            {quizzes.map((item, index) => (
              <QuizCard
                key={index}
                title={item.title}
                quizId={item.quiz_id}
                total={item.total}
                subjectId={subjectId}
                role={role}
              />
            ))}
          </View>
        ) : (
          <View>
            <Text>no quizzes yet</Text>
          </View>
        )}
      </ScrollView>
      {role === "teacher" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push("/subject/quiz/AddQuiz");
          }}
        >
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default memo(Quiz);
