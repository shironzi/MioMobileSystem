import React, { memo, useCallback, useState } from "react";
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import ScoresCard from "@/components/ScoresCard";
import { AntDesign } from "@expo/vector-icons";

enum scoreType {
  assessment = "Assessment",
  typeEntry = "Type Entry",
  exercise = "Exercise",
}

const data = [
  {
    id: 1,
    name: "Speech Flashcard Activity",
    difficulty: "Easy",
    level: 1,
    score: "8/10",
    category: scoreType.exercise,
  },
  {
    id: 2,
    name: "Audio Task",
    difficulty: "Average",
    level: 1,
    score: "10/10",
    category: scoreType.assessment,
  },
  {
    id: 3,
    name: "Language",
    difficulty: "Medium",
    level: 2,
    score: "8/10",
    category: scoreType.typeEntry,
  },
];

const ScoresScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<scoreType | "all">("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Scores",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  const filteredData =
    selectedCategory === "all"
      ? data
      : data.filter((item) => item.category === selectedCategory);

  const handleSelect = (value: scoreType | "all") => {
    setSelectedCategory(value);
    setDropdownVisible(false);
  };

  return (
    <ScrollView>
      <View style={{ margin: 20, position: "relative" }}>
        <TouchableOpacity
          onPress={() => setDropdownVisible(!dropdownVisible)}
          style={styles.dropdownToggleWrapper}
        >
          <Text style={styles.dropdownToggle}>
            {selectedCategory === "all" ? "All" : selectedCategory}{" "}
            <AntDesign name={dropdownVisible ? "up" : "down"} size={14} color="#FFBF18" style={{ marginLeft: 5 }}/>
          </Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => handleSelect("all")}>
              <Text style={styles.dropdownItem}>All</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => handleSelect(scoreType.exercise)}>
              <Text style={styles.dropdownItem}>Exercises</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => handleSelect(scoreType.assessment)}>
              <Text style={styles.dropdownItem}>Tests</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => handleSelect(scoreType.typeEntry)}>
              <Text style={styles.dropdownItem}>Type Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.row}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Name</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Difficulty</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Level</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Score</Text>
      </View>

      <View>
        {filteredData.map((item) => (
          <ScoresCard
            key={item.id}
            name={item.name}
            difficulty={item.difficulty}
            level={item.level}
            score={item.score}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    margin: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 60,
    justifyContent: "space-between",
    marginBottom: -10,
  },
  dropdownItem: {
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
  },
  separator: {
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  dropdownToggleWrapper: {
    alignSelf: "flex-end",
    zIndex: 10,
  },
  
  dropdownToggle: {
    color: "#F4B400",
    fontSize: 16,
    // fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#2264DC",
    padding: 10,
    borderRadius: 16,
    width: 160,
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
});

export default memo(ScoresScreen);
