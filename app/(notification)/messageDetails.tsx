import HeaderConfig from "@/utils/HeaderConfig";
import React, { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MessageDetailsCard from "./MessageDetailsCard";

const title = "Message Title";

const data = [
  {
    id: 1,
    name: "Ava Arce",
    date: new Date(Date.now()),
    time: "10:10 am",
    mess: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: 2,
    name: "Ava Arce",
    date: new Date(Date.now()),
    time: "10:10 am",
    mess: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: 3,
    name: "Ava Arce",
    date: new Date(Date.now()),
    time: "10:10 am",
    mess: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
  {
    id: 4,
    name: "Ava Arce",
    date: new Date(Date.now()),
    time: "10:10 am",
    mess: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit",
  },
];

const messageDetails = () => {
  HeaderConfig("Message");
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          {data.map((data) => (
            <MessageDetailsCard
              key={data.id}
              name={data.name}
              date={data.date}
              time={data.time}
              mess={data.mess}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
});

export default memo(messageDetails);
