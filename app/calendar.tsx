import React, { memo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import CalendarCard from "@/components/CalendarCard";
import { MarkedDates } from "react-native-calendars/src/types";
import HeaderConfig from "@/components/HeaderConfig";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};
LocaleConfig.defaultLocale = "fr";

const CalendarScreen = () => {
  const [selected, setSelected] = useState("");

  HeaderConfig("Calendar");

  const markedDates: MarkedDates = selected
    ? {
        [selected]: {
          selected: true,
          selectedColor: "#FFBF18",
          selectedTextColor: "#fff",
          dots: [
            {
              key: "dot1",
              color: "#2264DC",
              selectedDotColor: "#2264DC",
            },
          ],
        },
      }
    : {};

  return (
    <ScrollView>
      <View style={styles.container}>
        <Calendar
          style={styles.calendar}
          markingType="multi-dot"
          markedDates={markedDates}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: "#f5f5f5",
            calendarBackground: "#f5f5f5",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#FFBF18",
            selectedDayTextColor: "#000",
            todayTextColor: "#FFBF18",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#2264DC",
            selectedDotColor: "#ffffff",
            arrowColor: "#2264DC",
            monthTextColor: "#2264DC",
            indicatorColor: "#2264DC",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          onDayPress={(day: DateData) => {
            setSelected(day.dateString);
          }}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selected && (
            <>
              <CalendarCard
                title="Speech Development"
                sub="Picture Flashcards"
                date={selected}
                time="10:00 AM"
                type="Submitted"
              />
              <CalendarCard
                title="Speech Development"
                sub="Picture Flashcards"
                date={selected}
                time="10:00 AM"
                type="Submitted"
              />
              <CalendarCard
                title="Speech Development"
                sub="Picture Flashcards"
                date={selected}
                time="10:00 AM"
                type="Submitted"
              />
              <CalendarCard
                title="Speech Development"
                sub="Picture Flashcards"
                date={selected}
                time="10:00 AM"
                type="Submitted"
              />
              <CalendarCard
                title="Speech Development"
                sub="Picture Flashcards"
                date={selected}
                time="10:00 AM"
                type="Submitted"
              />
            </>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  calendar: {
    margin: 5,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    paddingBottom:10,


  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 70,
  },
});

export default memo(CalendarScreen);
