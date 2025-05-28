import ScoresCard from "@/components/ScoresCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { AntDesign } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    // score: "8/10",
    student: "8 of 15",
    category: scoreType.exercise,
  },
  {
    id: 2,
    name: "Audio Task",
    difficulty: "Average",
    level: 1,
    // score: "10/10",
    student: "10 of 15",
    category: scoreType.assessment,
  },
  {
    id: 3,
    name: "Language",
    difficulty: "Medium",
    level: 2,
    // score: "8/10",
    student: "12 of 15",
    category: scoreType.typeEntry,
  },
];

const ScoresScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<scoreType | "all">(
    "all",
  );
  const [modalVisible, setModalVisible] = useState(false);

  HeaderConfig("Scores");

  const filteredData = useMemo(() => {
    return selectedCategory === "all"
      ? data
      : data.filter((item) => item.category === selectedCategory);
  }, [data, selectedCategory]);

  const handleSelect = useCallback((value: scoreType | "all") => {
    setSelectedCategory(value);
    setModalVisible(false);
  }, []);

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.dropdownToggleWrapper}
        >
          <Text style={styles.dropdownToggle}>
            {selectedCategory === "all" ? "All" : selectedCategory}{" "}
            <AntDesign
              name="down"
              size={14}
              color="#FFBF18"
              style={{ marginLeft: 5 }}
            />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.label}>Difficulty</Text>
        <Text style={styles.label}>Level</Text>
        {/* <Text style={styles.label}>Score</Text> */}
        <Text style={styles.label}>Student</Text>
      </View>

      <View>
        {filteredData.map((item) => (
          <ScoresCard
            key={item.id}
            name={item.name}
            difficulty={item.difficulty}
            level={item.level}
            // score={item.score}
            student={item.student}
          />
        ))}
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => handleSelect("all")}>
              <Text style={styles.modalItem}>All</Text>
              <View style={styles.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect(scoreType.exercise)}>
              <Text style={styles.modalItem}>Exercises</Text>
              <View style={styles.divider} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelect(scoreType.assessment)}
            >
              <Text style={styles.modalItem}>Assessmets</Text>
              <View style={styles.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelect(scoreType.typeEntry)}>
              <Text style={styles.modalItem}>Type Entry</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 60,
    justifyContent: "space-between",
    marginBottom: -10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownToggleWrapper: {
    alignSelf: "flex-end",
  },
  dropdownToggle: {
    color: "#F4B400",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "#2264DC",
    padding: 12,
    borderRadius: 15,
    width: 150,
    top: 110,
    right: -230,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalItem: {
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
  },
  divider: {
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
});

export default memo(ScoresScreen);
