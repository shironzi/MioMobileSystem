import React, { memo } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import HelpCard from "@/components/HelpCard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    name: "Ava Samantha Arce",
    time: "10:00 AM",
    msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc non arcu fermentum pharetra. Vivamus id justo vitae odio feugiat scelerisque.",
    type: "Resolved",
  },
  {
    id: 2,
    name: "Ava Samantha Arce",
    time: "2:00 PM",
    msg: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    type: "Resolved",
  },
  {
    id: 3,
    name: "Ava Samantha Arce",
    time: "4:00 PM",
    msg: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
    type: "Resolved",
  },
  {
    id: 4,
    name: "Ava Samantha Arce",
    time: "6:00 PM",
    msg: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    type: "Resolved",
  },
  {
    id: 5,
    name: "Ava Samantha Arce",
    time: "8:00 PM",
    msg: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    type: "Resolved",
  },
];

const help = () => {
  const router = useRouter();
  HeaderConfig("Help & Support");

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reports</Text>
      {data.map((item) => (
        <HelpCard
          key={item.id}
          name={item.name}
          time={item.time}
          msg={item.msg}
          type={item.type}
        />
      ))}
    
    </ScrollView>
    <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("helpDetails")}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginBottom: -100,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 20,
    elevation: 5,
  },
});

export default memo(help);
