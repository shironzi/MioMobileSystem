import { View, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import ModuleCard from "@/components/ModuleCard";

const data = [
  {
    id: 1,
    title: "[M1 - MAIN]  Speech Development",
  },
  {
    id: 2,
    title: "[M2 - MAIN]  Speech Development",
  },
  {
    id: 3,
    title: "[M3 - MAIN]  Speech Development",
  },
  {
    id: 4,
    title: "[M4 - MAIN]  Speech Development",
  },
];

const modules = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Modules",
        headerStyle: styles.headerStyle,
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {},
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  return (
      <View style={styles.container}>
        {data.map((item) => (
          <ModuleCard
            key={item.id}
            title={item.title}
            
          />
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
