import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { memo } from "react";
import ModuleCard from "@/components/ModuleCard";
import HeaderConfig from "@/components/HeaderConfig";
import { useRouter } from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

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
  const router = useRouter();
 

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {data.map((item) => (
            <ModuleCard key={item.id} title={item.title} />
          ))}
        </View>
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
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
  addButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -370,
    right: 20,
    elevation: 5,
  },
});


export default memo(modules);
