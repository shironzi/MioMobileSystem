import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, memo } from "react";
import SpecializedCard from "@/components/SpecializedCard";
import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

enum courseType {
  academic = "academic",
  specialized = "specialized",
}

const data = [
  { label: "Academic Courses", value: "academic" },
  { label: "Specialized Courses", value: "specialized" },
];

const courses = [
  { title: "Academic", section: "tw23", courseType: courseType.academic },
  { title: "Academic", section: "tw23", courseType: courseType.academic },
  { title: "Academic", section: "tw23", courseType: courseType.academic },
  { title: "Specialized", section: "tw23", courseType: courseType.specialized },
  { title: "Specialized", section: "tw23", courseType: courseType.specialized },
  { title: "Specialized", section: "tw23", courseType: courseType.specialized },
  { title: "Specialized", section: "tw23", courseType: courseType.specialized },
  { title: "Specialized", section: "tw23", courseType: courseType.specialized },
];

const Index = () => {
  const [selectedValue, setSelectedValue] = useState("academic");

  return (
    <View>
      <View
        style={{
          display: "flex",
          ...styles.headerContainer,
        }}
      >
        <Text style={styles.courseTitle}>Courses</Text>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            renderRightIcon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
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
      <ScrollView>
        {courses?.map((course, index) => {
          if (course.courseType === selectedValue) {
            return (
              <SpecializedCard
                key={index}
                courseTitle={course.title}
                courseSection={course.section}
              />
            );
          }
          return null;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
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
    paddingHorizontal: 10,
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
});

export default memo(Index);
