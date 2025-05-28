import HeaderConfig from "@/utils/HeaderConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const formatKey = (d: Date) => d.toISOString().split("T")[0];

const data = {
  [formatKey(new Date("2025-05-08T10:00:00"))]: {
    1: {
      courseType: "Math",
      title: "Algebra Practice",
      dueDate: new Date("2025-05-08T10:00:00"),
      isSubmitted: true,
    },
    2: {
      courseType: "Science",
      title: "Physics Experiment",
      dueDate: new Date("2025-05-09T14:00:00"),
      isSubmitted: false,
    },
  },
  [formatKey(new Date("2025-05-09T12:00:00"))]: {
    1: {
      courseType: "History",
      title: "World War II Essay",
      dueDate: new Date("2025-05-09T12:00:00"),
      isSubmitted: false,
    },
  },
  [formatKey(new Date("2025-05-10T16:00:00"))]: {
    1: {
      courseType: "Art",
      title: "Sketching Assignment",
      dueDate: new Date("2025-05-10T16:00:00"),
      isSubmitted: true,
    },
    2: {
      courseType: "Physical Education",
      title: "Fitness Test",
      dueDate: new Date("2025-05-10T09:00:00"),
      isSubmitted: false,
    },
  },
  [formatKey(new Date("2025-05-11T18:00:00"))]: {
    1: {
      courseType: "Music",
      title: "Piano Practice",
      dueDate: new Date("2025-05-11T18:00:00"),
      isSubmitted: false,
    },
  },
};

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

const Calendar = () => {
  HeaderConfig("Calendar");

  const today = useMemo(() => new Date(), []);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(months[today.getMonth()]);
  const [items] = useState(months.map((m) => ({ label: m, value: m })));
  const [selectedDate, setSelectedDate] = useState(today);

  const calculateWeekDates = useCallback((centerDate: Date) => {
    const result: Date[] = [];
    const startOfWeek = new Date(centerDate);
    startOfWeek.setDate(centerDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      result.push(date);
    }

    return result;
  }, []);

  const [weekDates, setWeekDates] = useState(calculateWeekDates(selectedDate));

  const handleSelectedDay = useCallback(
    (index: number) => {
      const newDate = new Date(weekDates[index]);

      setSelectedDate(newDate);
      setWeekDates(calculateWeekDates(newDate));
    },
    [weekDates, calculateWeekDates],
  );

  const handleMonthChange = useCallback(() => {
    const newDate = new Date(
      selectedDate.setFullYear(
        selectedDate.getFullYear(),
        months.indexOf(value),
        selectedDate.getDate(),
      ),
    );

    setSelectedDate(newDate);
    setWeekDates(calculateWeekDates(newDate));
  }, [selectedDate, value, calculateWeekDates]);

  return (
    <View style={{ padding: 20 }}>
      <Text>2025</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={handleMonthChange}
        placeholder={value}
        style={{ width: "35%", borderWidth: 0, backgroundColor: "transparent" }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {weekDates.map((date, index) => {
          const isSelected =
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectedDay(index)}
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
              <Text style={isSelected ? { color: "#fff" } : {}}>
                {weekDays[date.getDay()]}
              </Text>
              <Text style={isSelected ? { color: "#fff" } : {}}>
                {date.getDate()}
              </Text>
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
      {Object.keys(data).includes(selectedDate.toISOString().split("T")[0]) ? (
        Object.entries(data[selectedDate.toISOString().split("T")[0]]).map(
          ([taskId, task]) => (
            <View
              key={taskId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View style={{ width: "20%", justifyContent: "center" }}>
                <FontAwesome name="picture-o" size={43} color="#FFBF18" />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text style={{ color: "#1F1F1F", fontSize: 14 }}>
                  {task.courseType}
                </Text>
                <Text style={{ color: "#000", fontSize: 18 }}>
                  {task.title}
                </Text>
                <Text style={{ color: "#1F1F1F", fontSize: 12 }}>
                  {task.dueDate.toLocaleString()}
                </Text>
                <Text
                  style={[
                    { color: "#1F1F1F", fontSize: 14 },
                    task.isSubmitted
                      ? { color: "#FFBF18" }
                      : { color: "#1F1F1F" },
                  ]}
                >
                  {task.isSubmitted ? "Submitted" : "Not Submitted"}
                </Text>
              </View>
            </View>
          ),
        )
      ) : (
        <Text>No available activity</Text>
      )}
    </View>
  );
};

export default memo(Calendar);
