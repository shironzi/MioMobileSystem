import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import React, { useEffect, useState } from "react";
import { getAnalyticsDashboard } from "@/utils/analytics";
import { CurveType, LineChart, PieChart } from "react-native-gifted-charts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";
import Entypo from "@expo/vector-icons/Entypo";
import AnalyticsCard from "@/app/analytics/AnalyticsCard";
import { FontAwesome6 } from "@expo/vector-icons";
import LoadingCard from "@/components/loadingCard";
import { Picker } from "@react-native-picker/picker";

const Analytics = () => {
  useHeaderConfig("Analytics");

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    active_today: number;
    overall_completion_rate: number;
    sessions: number;
    weekly_engagement: Record<string, number>;
    overall_speech_completion_rate: number;
    overall_language_completion_rate: number;
    overall_auditory_completion_rate: number;
    quizzes_overall_completion_rate: number;
    passing_rate: number;
  }>();

  const [lineData, setLineData] = useState<{ value: number; label: string }[]>(
    [],
  );

  const [subjectList, setSubjectList] = useState<
    { subjectId: string; title: string }[]
  >([]);

  const [subject, setSubject] = useState<string>();
  const [student, setStudent] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAnalyticsDashboard();
      if (res.success) {
        setData({
          active_today: res.active_today,
          overall_completion_rate: res.overall_completion_rate,
          sessions: res.sessions,
          weekly_engagement: res.weekly_engagement,
          quizzes_overall_completion_rate: res.quizzes_overall_completion_rate,
          overall_speech_completion_rate: res.overall_speech_completion_rate,
          overall_language_completion_rate:
            res.overall_language_completion_rate,
          overall_auditory_completion_rate:
            res.overall_auditory_completion_rate,
          passing_rate: res.passing_rate,
        });

        // Object.entries(res.subjects_data).map(([key, value]: [string, any]) => {
        //   setSubjectList((prev) => [...prev, { subjectId: key, title: value }]);
        // });
        //
        // setSubject(subjectList[0].subjectId);

        const transformedData = Object.entries(res.weekly_engagement).map(
          ([dateStr, value]: [string, any]) => {
            const date = new Date(dateStr);
            return {
              value: value,
              label: date.toLocaleDateString("en-US", {
                weekday: "short",
              }),
            };
          },
        );

        setLoading(false);
        setLineData(transformedData);
      }
    };

    fetchData();
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
    <ScrollView style={{ paddingHorizontal: 20, backgroundColor: "#fff" }}>
      <View style={{ justifyContent: "flex-end" }}>
        {/*<TouchableOpacity>*/}
        {/*  <FontAwesome6 name="sliders" size={24} color="black" />*/}
        {/*</TouchableOpacity>*/}

        <Picker
          selectedValue={subject}
          onValueChange={(itemValue) => setSubject(itemValue)}
        >
          {subjectList?.map((subject) => (
            <Picker.Item label={subject.title} value={subject.subjectId} />
          ))}
        </Picker>
      </View>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "column", width: "49%", rowGap: 10 }}>
          <View style={[styles.header, { backgroundColor: "#FFBF1926" }]}>
            <View style={styles.headerItem}>
              <MaterialIcons name="person" size={24} color="#FFBF19" />
            </View>
            <View>
              <Text style={globalStyles.text1}>{data?.active_today}</Text>
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

        <View style={styles.activities}>
          <PieChart
            data={[
              { value: data?.overall_completion_rate ?? 0, color: "#55BC8E" },
              {
                value: 100 - (data?.overall_completion_rate ?? 0),
                color: "#D9D9D9",
              },
            ]}
            donut
            showGradient
            sectionAutoFocus
            radius={40}
            innerRadius={34}
            innerCircleColor={"#55BC8E"}
            centerLabelComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="check" size={24} color="#fff" />
                </View>
              );
            }}
          />
          <View>
            <Text style={[globalStyles.text1, { textAlign: "center" }]}>
              {data?.overall_completion_rate}%
            </Text>
            <Text style={[globalStyles.label, { textAlign: "center" }]}>
              Completion Rate
            </Text>
          </View>
        </View>
      </View>

      <View style={{ rowGap: 10, marginVertical: 10 }}>
        <AnalyticsCard
          data={data?.quizzes_overall_completion_rate ?? 0}
          title={"Assignments"}
          percentage={data?.quizzes_overall_completion_rate.toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.quizzes_overall_completion_rate ?? 0}
          title={"Quizzes"}
          percentage={data?.quizzes_overall_completion_rate.toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.overall_speech_completion_rate ?? 0}
          title={"Speech"}
          percentage={data?.overall_speech_completion_rate.toString() ?? "0"}
        />

        <AnalyticsCard
          data={data?.overall_auditory_completion_rate ?? 0}
          title={"Auditory"}
          percentage={data?.overall_auditory_completion_rate.toString() ?? "0"}
        />
        <AnalyticsCard
          data={data?.overall_language_completion_rate ?? 0}
          title={"Language"}
          percentage={data?.overall_language_completion_rate.toString() ?? "0"}
        />
      </View>

      <View style={{ flexDirection: "row", columnGap: 10, marginVertical: 10 }}>
        <View style={styles.activitiesContainer}>
          <Text style={globalStyles.text1}>Overall Result</Text>
          <PieChart
            data={[
              {
                value: data?.passing_rate ?? 0,
                color: "#344BFD",
                text: data?.passing_rate ? `${data?.passing_rate}%` : "0",
              },
              {
                value: data?.passing_rate ? 100 - data?.passing_rate : 0,
                color: "#FFBF18",
                text: data?.passing_rate ? `${100 - data?.passing_rate}%` : "0",
              },
            ]}
            isAnimated
            radius={50}
            innerRadius={0}
            donut
            showText
            textColor="white"
            textSize={20}
            fontWeight="bold"
            textBackgroundRadius={22}
            showValuesAsLabels
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -10,
              }}
            >
              <Entypo name="dot-single" size={35} color="#344BFD" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                Passed
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Entypo name="dot-single" size={35} color="#FFBF18" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                Failed
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.overallContainer}>
          <Text style={globalStyles.text1}>Overall Result</Text>
          <PieChart
            data={[
              {
                value: data?.passing_rate ?? 0,
                color: "#344BFD",
                text: data?.passing_rate ? `${data?.passing_rate}%` : "0",
              },
              {
                value: data?.passing_rate ? 100 - data?.passing_rate : 0,
                color: "#FFBF18",
                text: data?.passing_rate ? `${100 - data?.passing_rate}%` : "0",
              },
            ]}
            isAnimated
            radius={50}
            innerRadius={0}
            donut
            showText
            textColor="white"
            textSize={20}
            fontWeight="bold"
            textBackgroundRadius={22}
            showValuesAsLabels
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "80%",
              flexWrap: "wrap",
              height: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -10,
              }}
            >
              <Entypo name="dot-single" size={35} color="#344BFD" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                On-time
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Entypo name="dot-single" size={35} color="#FFBF18" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                Late
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -10,
                marginTop: -30,
              }}
            >
              <Entypo name="dot-single" size={35} color="#F68D2B" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                Missing
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.lineChartContainer}>
        <LineChart
          initialSpacing={0}
          data={lineData}
          spacing={50}
          hideDataPoints
          thickness={2.5}
          color="#2264DC"
          isAnimated
          hideRules
          yAxisColor="#2264DC"
          curveType={CurveType.QUADRATIC}
          curvature={1}
          showVerticalLines={false}
          xAxisColor="#2264DC"
          height={170}
          yAxisLabelWidth={40}
          yAxisTextStyle={{
            color: "#1F1F1F80",
            fontSize: 15,
          }}
          xAxisLength={300}
          xAxisLabelTextStyle={styles.lineChart}
        />
      </View>
      <TouchableOpacity style={styles.exportButton}>
        <FontAwesome6 name="file-export" size={20} color="#439558" />
        <Text style={[globalStyles.text1, { color: "#439558" }]}>
          EXPORT CSV
        </Text>
      </TouchableOpacity>
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

export default Analytics;
