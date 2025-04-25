import React, { memo, useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import TodoCard from "@/components/todoCard";
import { AntDesign } from "@expo/vector-icons";

enum todoType {
  academic = "academic",
  specialized = "specialized",
}

const data = [
  {
    id: 1,
    title: "Math",
    sub: "Task 1",
    date: "2025-04-23",
    time: "10:00 AM",
    type: "Not Submitted",
    category: todoType.academic,
  },
  {
    id: 2,
    title: "Speech Development",
    sub: "Picture Flashcards",
    date: "2025-04-23",
    time: "10:00 AM",
    type: "Not Submitted",
    category: todoType.specialized,
  },
  {
    id: 3,
    title: "Science",
    sub: "Assignment 1",
    date: "2025-04-23",
    time: "10:00 AM",
    type: "Not Submitted",
    category: todoType.academic,
  },
  {
    id: 4,
    title: "Speech Development",
    sub: "Picture Flashcards",
    date: "2025-04-23",
    time: "10:00 AM",
    type: "Submitted",
    category: todoType.specialized,
  },
  {
    id: 5,
    title: "English",
    sub: "Activity 1",
    date: "2025-04-23",
    time: "10:00 AM",
    type: "Submitted",
    category: todoType.academic,
  },
];


const Todo = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<todoType | "all">("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const filteredData = selectedCategory === "all"
    ? data
    : data.filter((item) => item.category === selectedCategory);

  const handleSelect = (value: todoType | "all") => {
    setSelectedCategory(value);
    setDropdownVisible(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownHeader} 
        onPress={() => setDropdownVisible(!dropdownVisible)}>
        <Text style={styles.dropdownLabel}>
          {selectedCategory === "all" ? "All" : selectedCategory === todoType.academic ? "Academic" : "Specialized"}
        </Text>
        <AntDesign 
          name={dropdownVisible ? "up" : "down"} 
          size={14} 
          color="#FFBF18" 
          style={{ marginLeft: 5, fontWeight: "bold", marginRight: 5 }} 
        />
      </TouchableOpacity>

      <Modal transparent visible={dropdownVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.dropdownBox}>
          {["all", todoType.academic, todoType.specialized].map((type, index) => (
            <TouchableOpacity key={type} 
              onPress={() => handleSelect(type as todoType | "all")}>
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>
                  {type === "all" ? "All" : type === todoType.academic ? "Academic" : "Specialized"}
                </Text>
                {index < 2 && <View style={styles.divider} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredData.map((item) => (
          <TodoCard
            key={item.id}
            title={item.title}
            sub={item.sub}
            date={item.date}
            time={item.time}
            type={item.type}
          />
        ))}
      </ScrollView>
    </View>

    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fff", 
    padding: 10 
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 8,
    marginBottom: -5,
  },
  dropdownLabel: {
    right: 10,
    fontSize: 15,
    color: "#FFBF18",
    textDecorationLine: "underline",

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownBox: {
    position: "absolute",
    right: 20,
    top: 120,
    backgroundColor: "#3267e3",
    borderRadius: 20,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#fff",
  },
  divider: {
    borderBottomColor: "#ffffff99",
    borderBottomWidth: 1,
    marginTop: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 70,
  },
});

export default memo(Todo);
