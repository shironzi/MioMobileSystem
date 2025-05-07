import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import DropDownPicker from "react-native-dropdown-picker";

const months = [
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
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendar = () => {
  HeaderConfig("Calendar");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDay();

  const daysToSunday = currentDay === 0 ? 0 : currentDay;
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - daysToSunday);

  const weekDates = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(months[currentMonth]);
  const [items] = useState(months.map((m) => ({ label: m, value: m })));

  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  const handleSelectedDay = (value: number) => {
    setSelectedDay(value);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>2025</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        placeholder={value}
        style={{ width: "30%", borderWidth: 0, backgroundColor: "transparent" }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {weekDays.map((day, index) => {
          const dateNum = weekDates[index].getDate();
          const isSelected = dateNum === selectedDay;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectedDay(dateNum)}
              style={[
                {
                  flexDirection: "column",
                  alignItems: "center",
                  rowGap: 10,
                  width: "12%",
                  paddingVertical: 15,
                },
                isSelected
                  ? {
                      backgroundColor: "#FFBF18",
                      borderRadius: 50,
                    }
                  : {},
              ]}
            >
              <Text style={isSelected ? { color: "#fff" } : {}}>{day}</Text>
              <Text style={isSelected ? { color: "#fff" } : {}}>{dateNum}</Text>
              {isSelected ? (
                <Text
                  style={{
                    backgroundColor: "#2264DC",
                    borderRadius: 180,
                    width: 12,
                    height: 12,
                  }}
                ></Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default calendar;
