import NotificationCard from "@/components/NotificationCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const data = [
  {
    id: 1,
    title: "Notification Title 1",
    date: new Date(Date.now()),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 2,
    title: "Notification Title 2",
    date: new Date("2025-1-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 3,
    title: "Notification Title 3",
    date: new Date("2025-1-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 4,
    title: "Notification Title 4",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 5,
    title: "Notification Title 5",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
  {
    id: 6,
    title: "Notification Title 6w",
    date: new Date("2024-5-5"),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure...",
    type: "activity",
  },
];

const Notification = () => {
  const [expandedSections, setExpandedSections] = useState(new Set<string>());
  const [notifications, setNotifications] = useState(data);
  const openSwipeableRef = useRef<number | null>(null);

  const deleteNotification = useCallback(
    (id: number) => {
      openSwipeableRef.current = null;

      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }, 100);
    },
    [openSwipeableRef]
  );

  const now = useMemo(() => new Date(), []);
  const filteredData = useMemo(
    () => notifications.filter((item) => now > item.date),
    [notifications, now]
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
  ).filter((section) => section.data.length > 0);

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
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        extraData={[expandedSections, notifications]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ section, item }) => {
          const isExpanded = expandedSections.has(section.date);
          if (!isExpanded) return null;
          return (
            <NotificationCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              time={item.time}
              type={item.type}
              handleDelete={() => deleteNotification(item.id)}
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
