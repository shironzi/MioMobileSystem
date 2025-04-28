import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, memo, useContext } from "react";
import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CourseCardViewContext } from "@/components/contexts/CourseCardViewContext";
import globalStyle from "@/styles/globalStyle";
import CourseCard from "@/components/CourseCard";

enum courseType {
  academic = "academic",
  specialized = "specialized",
}

const data = [
  { label: "Academic Courses", value: "academic" },
  { label: "Specialized Courses", value: "specialized" },
];

const courses = [
  {
    courseId: 1,
    title: "Math",
    section: "tw23",
    courseType: courseType.academic,
    courseImage: require("@/assets/dashImage/math.png"),
  },
  {
    courseId: 2,
    title: "English",
    section: "tw23",
    courseType: courseType.academic,
    courseImage: require("@/assets/dashImage/english.png"),
  },
  {
    courseId: 3,
    title: "Science",
    section: "tw23",
    courseType: courseType.academic,
    courseImage: require("@/assets/dashImage/science.png"),
  },
  {
    courseId: 4,
    title: "Speech Training",
    section: "tw23",
    courseType: courseType.specialized,
    courseImage: require("@/assets/dashImage/speech.png"),
  },
  {
    courseId: 5,
    title: "Auditory Training ",
    section: "tw23",
    courseType: courseType.specialized,
    courseImage: require("@/assets/dashImage/science.png"),
  },
  {
    courseId: 6,
    title: "Language Training",
    section: "tw23",
    courseType: courseType.specialized,
    courseImage: require("@/assets/dashImage/language.png"),
  },
  // {
  //   courseId: 7,
  //   title: "Filipino",
  //   section: "tw23",
  //   courseType: courseType.academic,
  //   courseImage: require("@/assets/dashImage/math.png")
  // },

  // {
  //   courseId: 8,
  //   title: "MAPEH",
  //   section: "tw23",
  //   courseType: courseType.academic,
  // },
  // {
  //   courseId: 9,
  //   title: "Araling Panlipunan",
  //   section: "tw23",
  //   courseType: courseType.academic,
  // },
];

const dashboard = () => {
  const [selectedValue, setSelectedValue] = useState("academic");
  const { courseCardView } = useContext(CourseCardViewContext);

  return (
    <ScrollView>
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
          {courses?.map((course, index) => {
            if (course.courseType === selectedValue) {
              return (
                <View
                  key={index}
                  style={courseCardView ? styles.gridItem : null}
                >
                  <CourseCard
                    courseTitle={course.title}
                    courseSection={course.section}
                    courseId={course.courseId}
                    courseImage={course.courseImage}
                  />
                  <Text>{courseCardView}</Text>
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>
    </ScrollView>
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

export default memo(dashboard);
