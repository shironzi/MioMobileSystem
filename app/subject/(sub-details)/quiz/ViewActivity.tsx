import { Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { getQuizAttempts } from "@/utils/query";
import globalStyles from "@/styles/globalStyles";
import { formatToLongDate, formatToLongDateTime } from "@/utils/DateFormat";

export interface QuizInfo {
  title: string;
  description: string;
  deadline: string;
  time_limit: number;
  total_points: number;
  end_time: string;
  start_time: string;
  attempts: number;
}

export interface Attempt {
  attempt_id: string;
  score: number | null;
  status: string | null;
  submitted_at: string | null;
}

const ViewActivity = () => {
  useHeaderConfig("Quiz");

  const { subjectId, quizId, index } = useLocalSearchParams<{
    subjectId: string;
    quizId: string;
    index: string;
  }>();

  const [quizInfo, setQuizInfo] = useState<QuizInfo>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [prevAttemptId, setPrevAttemptId] = useState<string>("");

  const startQuiz = () => {
    router.push({
      pathname: "/subject/(sub-details)/quiz/TakeQuiz",
      params: {
        subjectId: subjectId,
        quizId: quizId,
        prevAttemptId: prevAttemptId,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchActivity = async () => {
        const res = await getQuizAttempts(subjectId, quizId);
        setQuizInfo(res.quiz_info);
        setAttempts(res.scores);
        setPrevAttemptId(res.active_attempt ?? "");
      };

      fetchActivity();

      return () => {};
    }, [subjectId, quizId]),
  );

  return (
    <View>
      <View style={[globalStyles.cardContainer1, { rowGap: 5 }]}>
        <Text style={[globalStyles.text1, { fontSize: 18 }]}>Quiz {index}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{ flexDirection: "row", width: "70%", alignItems: "center" }}
          >
            <Text style={[globalStyles.text1, { fontSize: 14 }]}>
              Deadline{" "}
            </Text>
            <Text style={[{ fontSize: 14 }]}>
              {quizInfo?.deadline
                ? formatToLongDateTime(quizInfo?.deadline)
                : "No Due Date"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
              alignItems: "center",
            }}
          >
            <Text style={[globalStyles.text1, { fontSize: 14 }]}>Points</Text>
            <Text style={[{ fontSize: 14 }]}>{quizInfo?.total_points}</Text>
          </View>
        </View>
        {/*<View>*/}
        {/*  <Text style={[globalStyles.text1, { fontSize: 14 }]}>*/}
        {/*    Availability{" "}*/}
        {/*  </Text>*/}
        {/*  <View>*/}
        {/*    {quizInfo?.deadline ? (*/}
        {/*      <View>*/}
        {/*        <Text>*/}
        {/*          {formatToLongDate(quizInfo.deadline)} {}*/}
        {/*        </Text>*/}
        {/*        <Text>{formatToLongDate(quizInfo.deadline)}</Text>*/}
        {/*      </View>*/}
        {/*    ) : (*/}
        {/*      <Text>No Due Date</Text>*/}
        {/*    )}*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View>
          <Text>Attempts {quizInfo?.attempts ?? "-"}</Text>
        </View>
      </View>
      <View style={[globalStyles.cardContainer1, { marginVertical: 0 }]}>
        <View style={{ marginBottom: 10 }}>
          <Text style={[globalStyles.text1, { fontSize: 16 }]}>
            Latest Attempts
          </Text>
        </View>

        {attempts.length === 0 ? (
          <Text>No attempts found.</Text>
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 5,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ flex: 1, fontWeight: "bold" }}>#</Text>
              <Text style={{ flex: 2, fontWeight: "bold" }}>Score</Text>
              <Text style={{ flex: 3, fontWeight: "bold" }}>Status</Text>
              <Text style={{ flex: 4, fontWeight: "bold" }}>Submitted At</Text>
            </View>

            {attempts.map((attempt, i) => (
              <View
                key={attempt.attempt_id}
                style={{
                  flexDirection: "row",
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                }}
              >
                <Text style={{ flex: 1 }}>{i + 1}</Text>
                <Text style={{ flex: 2 }}>
                  {attempt.score !== null ? `${attempt.score}` : "-"}
                </Text>
                <Text style={{ flex: 3 }}>{attempt.status ?? "-"}</Text>
                <Text style={{ flex: 4 }}>
                  {attempt.submitted_at
                    ? formatToLongDate(attempt.submitted_at)
                    : "-"}
                </Text>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={startQuiz}
        >
          <Text style={globalStyles.submitButtonText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewActivity;
