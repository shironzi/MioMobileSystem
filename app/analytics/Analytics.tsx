import AnalyticsCard from "@/app/analytics/AnalyticsCard";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { getAnalyticsDashboard, getAnalyticsStudents } from "@/utils/analytics";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CurveType, LineChart, PieChart } from "react-native-gifted-charts";

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
    assignments_overall_completion_rate: number;
    missing_submissions: number;
    onTime_submission: number;
    late_submissions: number;
  }>();

  const [lineData, setLineData] = useState<{ value: number; label: string }[]>(
    [],
  );

  const [subjectList, setSubjectList] = useState<
    { subjectId: string; title: string }[]
  >([]);

  const [studentList, setStudentList] = useState<
    { name: string; student_id: string }[]
  >([]);

  const [subject, setSubject] = useState<{ subject_id: string }>();
  const [student, setStudent] = useState<{ student_id: string }>();
  const [openModal, setCloseModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAnalyticsDashboard();
      console.log(res);

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
          assignments_overall_completion_rate:
            res.assignments_overall_completion_rate,
          onTime_submission: res.onTime_submission,
          late_submissions: res.late_submissions,
          missing_submissions: res.missing_submissions,
        });

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

        const subjects = Object.values(res.subjects_data).map(
          (subject: any) => ({
            subjectId: subject.subjectId,
            title: subject.title,
          }),
        );

        setSubjectList(subjects);
        if (subjects.length > 0) {
          setSubject({ subject_id: subjects[0].subjectId });
        }
        setLineData(transformedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (subject && subject.subject_id) {
        const res = await getAnalyticsStudents(subject.subject_id);
        console.log("fetching students");

        if (res.success) {
          setStudentList(res.peoples);
          if (res.peoples.length > 0) {
            setStudent({ student_id: res.peoples[0].student_id });
          }
        }
      }
    };

    fetchStudents();
  }, [subject]);

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

  const handleModalBackgroundPress = () => {
    setCloseModal(false);
  };

  const handleStudentSelect = () => {
    if (!student) return;
    router.push({
      pathname: "/analytics/StudentAnalytics",
      params: { studentId: student.student_id },
    });
  };

  return (
    <ScrollView style={{ paddingHorizontal: 20, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setCloseModal(!openModal)}
        >
          <FontAwesome name="filter" size={20} color="#aaa" />
          <Text style={[globalStyles.text1, { color: "#aaa" }]}>Filter By</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onRequestClose={() => setCloseModal(false)}
        >
          <TouchableWithoutFeedback onPress={handleModalBackgroundPress}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View
                  style={{
                    width: "80%",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#2264dc",
                      height: 60,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        top: 5,
                      }}
                    >
                      <Text
                        style={{
                          // marginBottom: 10,
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#fff",
                          margin: 12,
                          left: 10,
                        }}
                      >
                        Category
                      </Text>
                      <TouchableOpacity onPress={() => setCloseModal(false)}>
                        <MaterialIcons
                          name="close"
                          size={24}
                          color="#fff"
                          style={{ top: 3, right: 20 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      borderColor: "#ddd",
                      borderWidth: 1,
                      borderRadius: 20,
                      marginBottom: 10,
                      marginHorizontal: 20,
                      marginTop: 20,
                    }}
                  >
                    <Picker
                      selectedValue={subject}
                      onValueChange={(itemValue) => setSubject(itemValue)}
                    >
                      {subjectList.map((subject) => (
                        <Picker.Item
                          label={subject.title}
                          value={subject.subjectId}
                          key={subject.subjectId}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View
                    style={{
                      borderColor: "#ddd",
                      borderWidth: 1,
                      borderRadius: 20,
                      marginBottom: 10,
                      marginHorizontal: 20,
                    }}
                  >
                    <Picker
                      selectedValue={student?.student_id}
                      onValueChange={(itemValue) =>
                        setStudent({ student_id: itemValue })
                      }
                    >
                      {studentList.map((student) => (
                        <Picker.Item
                          label={student.name}
                          value={student.student_id}
                          key={student.student_id}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.cancelButton]}
                      onPress={() => setCloseModal(false)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteButton]}
                      onPress={() => handleStudentSelect()}
                    >
                      <Text style={styles.deleteText}>Apply</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <Button title="Apply" onPress={() => handleStudentSelect()} />
									<Button title="Close" onPress={() => setCloseModal(false)} /> */}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
          <View style={[styles.header]}>
            <View
              style={[
                styles.headerItem,
                { backgroundColor: "#2264DC47", left: -10 },
              ]}
            >
              <MaterialIcons name="av-timer" size={24} color="#2264DC" />
            </View>
            <View style={{ left: -10 }}>
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

      <View style={{}}>
        <AnalyticsCard
          data={data?.assignments_overall_completion_rate ?? 0}
          title={"Assignments"}
          percentage={
            data?.assignments_overall_completion_rate.toString() ?? "0"
          }
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
          <Text style={globalStyles.text1}>Passing Rate</Text>
          <PieChart
            data={[
              {
                value: data?.passing_rate ?? 0,
                color: "#2264dc",
                text: data?.passing_rate
                  ? `${data?.passing_rate?.toFixed(2)}%`
                  : "0",
              },
              {
                value: data?.passing_rate ? 100 - data?.passing_rate : 0,
                color: "#FFBF18",
                text: data?.passing_rate
                  ? `${(100 - data?.passing_rate).toFixed(2)}%`
                  : "0",
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
              <Entypo name="dot-single" size={35} color="#2264dc" />
              <Text
                style={[
                  globalStyles.label,
                  { fontSize: 13, marginLeft: -10, fontWeight: 400 },
                ]}
              >
                Pass
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
                Fail
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.overallContainer}>
          <Text style={globalStyles.text1}>Submission Rate</Text>
          <PieChart
            data={[
              {
                value: data?.late_submissions ?? 0,
                color: "#F68D2B",
                text: data?.late_submissions
                  ? `${data?.late_submissions}`
                  : "0",
              },
              {
                value: data?.missing_submissions ?? 0,
                color: "#FFBF18",
                text: data?.missing_submissions
                  ? `${data?.missing_submissions}`
                  : "0",
              },
              {
                value: data?.onTime_submission ?? 0,
                color: "#344BFD",
                text: data?.onTime_submission
                  ? `${data?.onTime_submission}`
                  : "0",
              },
            ]}
            isAnimated
            radius={50}
            innerRadius={45}
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
              left: -5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: -10,
              }}
            >
              <Entypo name="dot-single" size={35} color="#2264dc" />
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
                marginTop: -10,
              }}
            >
              <Entypo name="dot-single" size={35} color="#F68d2b" />
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
                marginTop: -20,
              }}
            >
              <Entypo name="dot-single" size={35} color="#Ffbf18" />
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

      <View style={[styles.lineChartContainer, { marginBottom: 70 }]}>
        <LineChart
          initialSpacing={0}
          data={lineData}
          spacing={45}
          hideDataPoints
          thickness={2}
          color="#2264DC"
          isAnimated
          hideRules
          yAxisColor="#aaa"
          curveType={CurveType.QUADRATIC}
          curvature={1}
          showVerticalLines={false}
          xAxisColor="#aaa"
          height={170}
          yAxisLabelWidth={40}
          yAxisTextStyle={{
            color: "#1F1F1F80",
            fontSize: 12,
          }}
          xAxisLength={290}
          xAxisLabelTextStyle={styles.lineChart}
        />
      </View>
      {/*<TouchableOpacity style={styles.exportButton}>*/}
      {/*  <FontAwesome6 name="file-export" size={20} color="#439558" />*/}
      {/*  <Text style={[globalStyles.text1, { color: "#439558" }]}>*/}
      {/*    Export CSV*/}
      {/*  </Text>*/}
      {/*</TouchableOpacity>*/}
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
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
    marginBottom: 70,
    marginTop: 10,
  },
  filterButton: {
    flexDirection: "row",
    borderColor: "#ddd",
    borderRadius: 20,
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
    marginTop: 20,
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
    borderColor: "#ddd",
  },
  overallContainer: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    height: 230,
    justifyContent: "center",
    rowGap: 10,
    borderColor: "#ddd",
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
    borderColor: "#ddd",
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cancelButton: {
    borderColor: "#ffbf18",
    borderWidth: 2,
    backgroundColor: "#fff",
    marginRight: 10,
    borderRadius: 50,
    width: "47%",
    paddingVertical: 5,
  },
  deleteButton: {
    width: "47%",
    backgroundColor: "#Ffbf18",
    borderRadius: 50,
    padding: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#ffbf18",
    fontWeight: 500,
    textAlign: "center",
    padding: 10,
  },
  deleteText: {
    paddingTop: 2,
    fontSize: 16,
    color: "#fff",
    fontWeight: 500,
    textAlign: "center",
    top: 5,
  },
});

export default Analytics;
