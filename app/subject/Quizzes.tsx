import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { formatToLongDateTime } from "@/utils/DateFormat";
import HeaderConfig from "@/utils/HeaderConfig";
import { getQuizzes } from "@/utils/query";
import { FontAwesome6 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

        {quizzes.map((quiz, index) => (
          <TouchableOpacity
            key={index}
            style={[
              globalStyles.cardContainer1,
              { flexDirection: "row", alignItems: "center", marginVertical: 5 },
            ]}
            onPress={() => handleSelectQuiz(quiz.quiz_id, index)}
          >
            <View style={styles.yellowBulletin}></View>
            <View style={{ width: "40%" }}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[globalStyles.textLabel, { fontWeight: 500 }]}
              >
                Quiz {index + 1}
              </Text>
              <Text style={globalStyles.text2}>{quiz.total_points} Pts</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                columnGap: 15,
                width: "60%",
                alignItems: "center",
                marginHorizontal: -10,
              }}
            >
              <Text style={[globalStyles.text2]}>
                {formatToLongDateTime(quiz.deadline_date)}
              </Text>
              <FontAwesome6 name="arrow-right-long" size={20} color="#1f1f1f" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  yellowBulletin: {
    backgroundColor: "#FFBF18",
    height: 45,
    width: "1.5%",
    borderRadius: 100,
  },
});

export default memo(Quiz);
