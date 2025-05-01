import { View, StyleSheet } from "react-native";
import React, { memo } from "react";
import ModuleCard from "@/components/ModuleCard";
import HeaderConfig from "@/components/HeaderConfig";

const data = [
  {
    id: 1,
    title: "[M1 - MAIN]  Speech Development",
  },
  {
    id: 2,
    title: "[M2 - MAIN]  Intonation Development and Training",
  },
  {
    id: 3,
    title: "[M3 - MAIN]  Accent Development",
  },
  {
    id: 4,
    title: "[M4 - MAIN]  Sound Development",
  },
];

const modules = () => {
  HeaderConfig("Modules");

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <ModuleCard key={item.id} title={item.title} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
});

export default memo(modules);
