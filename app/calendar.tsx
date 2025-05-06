import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import moment from "moment";
import HeaderConfig from "@/components/HeaderConfig";

const screenWidth = Dimensions.get("window").width;


const CalendarScreen: React.FC = () => {
  HeaderConfig("Calendar");
  const today = moment().format("YYYY-MM-DD");

  const [items] = useState<{
    [date: string]: {
      id: string;
      title: string;
      time: string;
      submitted: boolean;
    }[];
  }>({
    [today]: [
      {
        id: "1",
        title: "Picture Flashcards",
        time: "09:00 AM",
        submitted: true,
      },
      {
        id: "2",
        title: "Picture Flashcards",
        time: "10:00 AM",
        submitted: false,
      },
      {
        id: "3",
        title: "Picture Flashcards",
        time: "11:00 AM",
        submitted: false,
      },
    ],
  });

  const [selected, setSelected] = useState<string>(today);

  return <Agenda items={items} selected={selected} />;
};

const styles = StyleSheet.create({
  dayCell: {
    width: screenWidth / 7,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 10,
    color: "#9B9B9B",
  },
  dayNameSelected: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  dayNumberContainer: {
    marginTop: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberContainerSelected: {
    backgroundColor: "#4A90E2",
  },
  dayNumber: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  dayNumberSelected: {
    color: "#fff",
  },
  dot: {
    marginTop: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4A90E2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dueText: {
    fontSize: 12,
    color: "#666",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  submitted: {
    color: "#28A745",
  },
  notSubmitted: {
    color: "#DC3545",
  },
});

export default CalendarScreen;
