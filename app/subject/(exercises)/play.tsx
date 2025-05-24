import HeaderConfig from "@/utils/HeaderConfig";
import PlayCard from "@/components/playCard";
import React, { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";

const Play = () => {
  HeaderConfig("Play");

  const { activity, difficulty, category } = useLocalSearchParams<{
    activity: string;
    difficulty: string;
    category: string;
  }>();

  const data = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
  }));

  const renderItem = ({ item }: { item: { id: number } }) => (
    <PlayCard
      id={item.id}
      label="Play"
      activity={activity}
      difficulty={difficulty}
      category={category}
    />
  );

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>Easy</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        style={{ paddingHorizontal: 5 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

export default memo(Play);
