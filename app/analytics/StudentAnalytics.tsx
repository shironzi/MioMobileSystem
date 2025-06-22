import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";
import { PieChart, RadarChart } from "react-native-gifted-charts";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import AnalyticsCard from "@/app/analytics/AnalyticsCard";
import { fetchStudentAnalytics } from "@/utils/analytics";
import { useLocalSearchParams } from "expo-router";
import LoadingCard from "@/components/loadingCard";
import Radar from "@/app/analytics/Radar";

interface TotalPerDifficulty {
  phrase: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  picture: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  question: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  bingo: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  matching: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  fill: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  homonyms: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
}

const StudentAnalytics = () => {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<{
    sessions: number;
    active_today: boolean;
    overall_completion_rate: number;
    overall_average: number;
    average_score_quizzes: number;
    speech_completion_rate: number;
    auditory_completion_rate: number;
    language_completion_rate: number;
    total_score_per_difficulty: TotalPerDifficulty;
    weekdays_present_count: Record<string, number>;
    failed_quizzes: number;
  }>();

  useEffect(() => {
    setLoading(true);
    const fetchStudentData = async () => {
      const res = await fetchStudentAnalytics(studentId); // Replace with your API call logic

      if (res.success) {
        setData({
          sessions: res.sessions,
          active_today: res.active_today,
          overall_completion_rate: res.overall_completion_rate ?? 0,
          overall_average: res.overall_average ?? 0,
          average_score_quizzes: res.average_score_quizzes ?? 0,
          speech_completion_rate: res.speech_completion_rate ?? 0,
          auditory_completion_rate: res.auditory_completion_rate ?? 0,
          language_completion_rate: res.language_completion_rate ?? 0,
          total_score_per_difficulty: res.total_score_per_difficulty ?? {},
          weekdays_present_count: res.weekdays_present_count ?? {},
          failed_quizzes: res.failed_quizzes ?? 0,
        });
      } else {
        console.log("Failed to fetch data");
      }

      console.log(data);
      setLoading(false);
    };

    fetchStudentData();
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
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "column", width: "49%", rowGap: 10 }}>
          <View style={[styles.header, { backgroundColor: "#FFBF1926" }]}>
            <View style={styles.headerItem}>
              <MaterialIcons name="person" size={24} color="#FFBF19" />
            </View>
            <View>
              <Text style={globalStyles.text1}>
                {data?.active_today ? "Active" : "Inactive"}
              </Text>
              <Text style={globalStyles.label}>Active Today</Text>
            </View>
          </View>
          <View style={styles.header}>
            <View style={[styles.headerItem, { backgroundColor: "#2264DC47" }]}>
              <MaterialIcons name="av-timer" size={24} color="#2264DC" />
            </View>
            <View>
              <Text style={globalStyles.text1}>{data?.sessions}</Text>
              <Text style={globalStyles.label}>Sessions</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "column", width: "49%", rowGap: 10 }}>
          <View style={[styles.header, { backgroundColor: "#55BC8E26" }]}>
            <View style={[styles.headerItem, { backgroundColor: "#55BC8E47" }]}>
              <Entypo name="check" size={20} color="#55BC8E" />
            </View>
            <View>
              <Text style={globalStyles.text1}>
                {data?.overall_completion_rate.toFixed(2)}%
              </Text>
              <Text style={globalStyles.label}>Completion Rate</Text>
            </View>
          </View>
          <View style={[styles.header, { backgroundColor: "#FF7A6726" }]}>
            <View style={[styles.headerItem, { backgroundColor: "#FF7A6747" }]}>
              <Ionicons name="book" size={20} color="#FF7A67" />
            </View>
            <View>
              <Text style={globalStyles.text1}>
                {data?.overall_average.toFixed(2)}%
              </Text>
              <Text style={globalStyles.label}>Average Score</Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <AnalyticsCard
          data={data?.average_score_quizzes ?? 0}
          title={"Assignments"}
          percentage={data?.average_score_quizzes.toFixed(0).toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.average_score_quizzes ?? 0}
          title={"Quizzes"}
          percentage={data?.average_score_quizzes.toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.speech_completion_rate ?? 0}
          title={"Speech"}
          percentage={data?.speech_completion_rate.toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.auditory_completion_rate ?? 0}
          title={"Auditory"}
          percentage={data?.auditory_completion_rate.toString() ?? "0"}
        />
        <AnalyticsCard
          data={data?.language_completion_rate ?? 0}
          title={"Language"}
          percentage={data?.language_completion_rate.toString() ?? "0"}
        />
      </View>
      <View>
        <Text>Student Progress in Specialized Trainings</Text>
        <RadarChart
          data={[42, 40, 35, 40, 38, 55, 100, 100, 100, 100, 100]}
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          labelConfig={{ stroke: "blue", fontWeight: "bold" }}
          dataLabels={["$42", "$40", "$35", "$40", "$38", "$55", "50"]}
          dataLabelsConfig={{ stroke: "brown" }}
          dataLabelsPositionOffset={0}
          maxValue={70}
        />
        {/*{data?.total_score_per_difficulty && (*/}
        {/*  <Radar Props={data?.total_score_per_difficulty} />*/}
        {/*)}*/}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    flexDirection: "row",
    borderColor: "#439558",
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: "#43955826",
    width: "100%",
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
    marginBottom: 70,
    marginTop: 10,
  },
  lineChart: {
    color: "#1F1F1F80",
    fontSize: 15,
    marginLeft: 20,
  },
  lineChartContainer: {
    width: "100%",
    marginHorizontal: "auto",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderColor: "#00000024",
  },
  overallContainer: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    height: 230,
    justifyContent: "center",
    rowGap: 10,
    borderColor: "#00000024",
    borderWidth: 1,
  },
  activitiesContainer: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    height: 230,
    justifyContent: "center",
    rowGap: 10,
    borderColor: "#00000024",
    borderWidth: 1,
  },
  activities: {
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "#55BC8E26",
    borderRadius: 20,
    height: 160,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#2264DC26",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    borderRadius: 20,
    height: 75,
    columnGap: 15,
  },
  headerItem: {
    backgroundColor: "#FFBF1947",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 360,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 160,
    columnGap: 10,
    marginHorizontal: "auto",
    marginVertical: 10,
    marginTop: 20,
  },
});

export default StudentAnalytics;
