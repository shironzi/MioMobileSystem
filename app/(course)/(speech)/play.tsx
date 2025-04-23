import React, { memo, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import PlayCard from "@/components/playCard";

const word = "Play";
//word.length 
const data = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
  }));

const Play = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Picture Flashcards",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  const renderItem = ({ item }: { item: { id: number} }) => (
    <PlayCard id={item.id} label="Play" />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Easy</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
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
