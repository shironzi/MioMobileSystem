import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, memo } from "react";
import CourseCard from "@/components/CourseCard";
import { Dropdown } from "react-native-element-dropdown"; 
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const data = [
  { label: "Academic Courses", value: "academic" },
  { label: "Specialized Courses", value: "specialized" },
];

const DropdownComponent = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
  const [selectedValue, setSelectedValue] = useState("academic");

  return (
    <View style={styles.dropdownContainer}>
      <Dropdown 
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        // containerStyle={styles.dropdownList} 
        renderRightIcon={() => <MaterialIcons name="keyboard-arrow-down" style={styles.iconStyle} />}
        data={data}
        value={selectedValue}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          setSelectedValue(item.value);
          onValueChange?.(item.value);
        }}
      />
    </View>
  );
};

const Index = () => {
  const [selectedCourseType, setSelectedCourseType] = useState<string>("academic");

  return (
    <ScrollView>
      <View style={styles.headerContainer}>
        <Text style={styles.courseTitle}>Courses</Text>
        <DropdownComponent onValueChange={setSelectedCourseType} />
      </View>
      {selectedCourseType === "academic" && (
        <>
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </>
      )}
    </ScrollView>
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
    // borderColor: "#000",
    paddingVertical: 8,
  },
  // dropdownList: {
  //  borderEndWidth: 3,
  //  borderColor: "#FFF18",
  // },
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
