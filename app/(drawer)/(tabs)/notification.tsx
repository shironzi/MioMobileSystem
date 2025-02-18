import {
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useMemo, useState } from "react";
import NotificationCard from "@/components/NotificationCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const data = [
  {
    id: 1,
    title: "Notification Title",
    date: new Date(Date.now()),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 2,
    title: "Notification Title",
    date: new Date("2025-1-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 3,
    title: "Notification Title",
    date: new Date("2025-1-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 4,
    title: "Notification Title",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 5,
    title: "Notification Title",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 6,
    title: "Notification Title",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
];

const Notification = () => {
  const [expandedSections, setExpandedSections] = useState(new Set<string>());

  const now = useMemo(() => new Date(), []);
  const filteredData = useMemo(
    () => data.filter((item) => now > item.date),
    []
  );

  const sections = Object.values(
    filteredData.reduce((acc, item) => {
      const dateStr = item.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, data: [] };
      }
      acc[dateStr].data.push(item);
      return acc;
    }, {} as Record<string, { date: string; data: typeof filteredData }>)
  );

  const handleToggle = (date: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  return (
    <SafeAreaView>
      <SectionList
        sections={sections}
        extraData={expandedSections}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ section, item }) => {
          const isExpanded = expandedSections.has(section.date);
          if (!isExpanded) return null;
          return (
            <NotificationCard
              title={item.title}
              desc={item.desc}
              type={item.type}
            />
          );
        }}
        renderSectionHeader={({ section: { date } }) => {
          const isExpanded = expandedSections.has(date);
          return (
            <Pressable onPress={() => handleToggle(date)}>
              <View style={styles.header}>
                <Text>{date}</Text>
                {isExpanded ? (
                  <MaterialIcons name="arrow-drop-up" size={24} color="black" />
                ) : (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="black"
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
});

export default memo(Notification);
