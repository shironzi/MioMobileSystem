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
  { title: "course 1", section: "tw23", courseType: courseType.academic },
  { title: "course 2", section: "tw23", courseType: courseType.specialized },
];

const DropdownComponent = ({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState("academic");

  return (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        renderRightIcon={() => (
          <MaterialIcons name="keyboard-arrow-down" style={styles.iconStyle} />
        )}
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
  const [selectedCourseType, setSelectedCourseType] =
    useState<string>("academic");

  return (
    <ScrollView>
      <View style={styles.headerContainer}>
        <Text style={styles.courseTitle}>Courses</Text>
        <DropdownComponent onValueChange={setSelectedCourseType} />
      </View>

      {selectedCourseType === "academic" ? (
        <>
          <SpecializedCard courseTitle="course 1" courseSection="TW23" />
        </>
      ) : (
        <>
          <SpecializedCard courseTitle="course 1" courseSection="TW23" />
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
