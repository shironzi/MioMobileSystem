import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, memo, useContext, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CourseCardViewContext } from "@/components/contexts/CourseCardViewContext";
import globalStyle from "@/styles/globalStyle";
import CourseCard from "@/components/CourseCard";
import { getSubjects } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";

const data = [
  { label: "Academic Courses", value: "academic" },
  { label: "Specialized Courses", value: "specialized" },
];

const index = () => {
  const [selectedValue, setSelectedValue] = useState("academic");
  const { courseCardView } = useContext(CourseCardViewContext);
  const [subjects, setSubjects] = useState<Record<string, any> | null>(null);
  const [hasAuthError, setHasAuthError] = useState(false);
  const [loading, setLoading] = useState(true);

  useAuthGuard(hasAuthError);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await getSubjects("GR7");
        setSubjects(data.subjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subjects: ", err);
        setHasAuthError(true);
      }
    }
    fetchSubjects();
  }, []);

  const filtered = subjects
    ? subjects.filter(
        (s: {
          title: string;
          section: string;
          subject_id: string;
          description: string;
          subjectType: string;
        }) => s.subjectType === selectedValue
      )
    : [];

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  return (
    <View>
      <View>
        <View style={styles.courseContainer}>
          <Text style={styles.courseTitle}>Courses</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              renderRightIcon={(isOpened) => (
                <MaterialIcons
                  name={isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  style={styles.iconStyle}
                />
              )}
              data={data}
              value={selectedValue}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                setSelectedValue(item.value);
              }}
            />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={[
            courseCardView ? styles.gridContainer : null,
            globalStyle.container,
          ]}
        >
          {filtered?.map(
            (subject: {
              title: string;
              section: string;
              subject_id: string;
              description: string;
              subjectType: string;
            }) => {
              if (subject.subjectType === selectedValue) {
                return (
                  <View
                    key={subject.subject_id}
                    style={courseCardView ? styles.gridItem : null}
                  >
                    <CourseCard
                      courseTitle={subject.title}
                      courseSection={subject.section}
                      courseId={subject.subject_id}
                      description={subject.description}
                      courseImage={require("@/assets/dashImage/language.png")}
                    />
                    <Text>{courseCardView}</Text>
                  </View>
                );
              }
              return (
                <View
                  key={subject.subject_id}
                  style={courseCardView ? styles.gridItem : null}
                >
                  <CourseCard
                    courseTitle={subject.title}
                    courseSection={subject.section}
                    courseId={subject.subject_id}
                    description={subject.description}
                    courseImage={require("@/assets/dashImage/language.png")}
                  />
                  <Text>{courseCardView}</Text>
                </View>
              );
            }
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 20,
  },
  dropdownContainer: {
    width: 200,
  },
  dropdown: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  selectedTextStyle: {
    color: "#FFBF18",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
  iconStyle: {
    fontSize: 20,
    color: "#FFBF18",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
  },
  gridItem: {
    width: "50%",
    justifyContent: "center",
  },
});

export default memo(index);
