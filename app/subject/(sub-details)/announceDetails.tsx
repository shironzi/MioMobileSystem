import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "Activity 1",
    date: new Date(Date.now()),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisice elit. Quisquam, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  },
];

const announceDetails = () => {
  HeaderConfig("Announcement");

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {item.date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}{" "}
              {item.time}
            </Text>
            <Text style={styles.description}>{item.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    elevation:5
  },
  cardContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    // shadowColor: "transparent",
    elevation: 5,
   
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    
  },
  title: {
    fontSize: 20,
    color: "#2264dc",
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    left: 2,
    lineHeight: 20,
    width: "100%",
    borderColor: "#FFBF18",
    paddingLeft: 0,
  },
});

export default memo(announceDetails);
